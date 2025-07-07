import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useParams } from 'react-router-dom';

export default function RoomDashboard() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Adjusted to safely parse token and access userId
  const currentUserId = localStorage.getItem('token') ? 
    JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId : null;

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`/rooms/${id}`);
        setRoom(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching room:', err);
        alert('Failed to load room');
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  const updateItemStatus = async (itemId, status) => {
    try {
      await axios.patch(`/items/${itemId}`, { status });
      setRoom((prev) => ({
        ...prev,
        items: prev.items.map(item => item.id === itemId ? { ...item, status } : item)
      }));
    } catch (err) {
        console.error(err)  
      alert('Failed to update item status');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) { // Trim to handle empty spaces
      setSearchResults([]);
      return;
    }
  
    try {
      const res = await axios.get(`/ebay/search?q=${encodeURIComponent(searchTerm)}`); // Encode search term
      const formatted = res.data.map(item => ({
        id: item.itemId,
        title: item.title,
        price: item.price?.value || 0,
        image: item.image?.imageUrl || '',
        url: item.itemWebUrl
      }));
      setSearchResults(formatted);
    } catch (err) {
      console.error('eBay search failed:', err);
      alert('Failed to fetch items from eBay');
    }
  };
  
  
  const handleAddItem = async (item) => {
    try {
      const payload = {
        name: item.title,
        price: parseFloat(item.price), // Ensure price is a number
        imageUrl: item.image,
        link: item.url,
        roomId: parseInt(id)
      };
      await axios.post('/items',payload);

      // Re-fetch room data to get the newly added item with its details (like addedBy)
      const res = await axios.get(`/rooms/${id}`);
      setRoom(res.data);
      setSearchResults([]); // Clear search results after adding
      setSearchTerm(''); // Clear search term after adding
    } catch (err) {
      console.error(err);
      alert('Failed to add item');
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this item?')) { // Confirmation
      return;
    }
    try {
      await axios.delete(`/items/${itemId}`);
      setRoom((prev) => ({
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      }));
    } catch (err) {
        console.error(err)
      alert('Failed to delete item');
    }
  };


  const exportToCSV = () => {
    if (!room?.items) return;
  
    const approvedItems = room.items.filter(item => item.status === 'approved');
  
    const headers = ['Name', 'Price', 'Added By', 'Link'];
    const rows = approvedItems.map(item => [
      item.name,
      item.price,
      item.addedBy?.name || 'N/A', // Handle case where addedBy might be null/undefined
      item.link || ''
    ]);
  
    const csvContent =
      [headers, ...rows]
        .map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
        .join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${room.name}-approved-items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  };
  

  if (loading) return <p className="text-center text-lg text-gray-600 mt-10">Loading room details...</p>;
  if (!room) return <p className="text-center text-lg text-red-600 mt-10">Room not found or an error occurred.</p>;

  const isCreator = room.creator?.id === currentUserId; // Safe access

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 sm:p-8 md:p-10 space-y-8 max-w-7xl mx-auto font-sans">
      
      {/* Room Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{room.name}</h1>
        {/* Changed room code text color to a lighter shade and added a subtle background */}
        <p className="text-sm opacity-90 mt-2 sm:mt-0">Room Code: <span className="font-mono text-lg bg-white bg-opacity-30 px-3 py-1 rounded-md ml-2 text-blue-900 font-bold">
          {room.code}
          </span>
        </p>
      </div>

      {/* Members Section */}
      <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
          Members
        </h2>
        {room.members.length === 0 ? (
          <p className="text-gray-500 italic">No members in this room yet.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-gray-700">
            {room.members.map(member => (
              <li key={member.id} className="flex items-center bg-gray-50 px-3 py-2 rounded-md shadow-sm text-sm">
                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {member.name} {member.id === room.creator.id && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Creator</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Search and Add Items Section */}
      <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
          Search and Add Items
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search for products on eBay..."
            className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => { if (e.key === 'Enter') handleSearch(); }}
          />
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 ease-in-out font-semibold shadow-md"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map(item => (
              <div key={item.id} className="border border-gray-200 p-5 rounded-lg shadow-md bg-gray-50 flex flex-col items-center text-center transform hover:scale-105 transition duration-200 ease-in-out">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-32 h-32 object-contain mb-4 border border-gray-100 p-1 rounded-md bg-white"
                  />
                ) : (
                  <div className="w-32 h-32 flex items-center justify-center bg-gray-200 text-gray-500 rounded-md mb-4">No Image</div>
                )}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-semibold text-blue-700 hover:underline mb-2 line-clamp-2"
                  title={item.title}
                >
                  {item.title}
                </a>
                <p className="text-lg font-bold text-gray-900 mb-3">${parseFloat(item.price).toFixed(2)}</p>
                <button
                  className="mt-auto px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 ease-in-out font-medium shadow"
                  onClick={() => handleAddItem(item)}
                >
                  Add to Room
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Items List Section */}
      <div className="bg-white shadow-md p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
          Room Items
        </h2>
        {room.items.length === 0 ? (
          <p className="text-gray-500 italic">No items have been added to this room yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Image</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added By</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                  {isCreator && <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moderate</th>}
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {room.items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                    <td className="px-4 py-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-contain rounded-md border border-gray-100 p-0.5" />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-400 text-xs rounded-md">No Image</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{item.name}</td>
                    <td className="px-4 py-3 text-gray-700">${parseFloat(item.price).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{item.addedBy?.name || 'Unknown'}</td>
                    <td className="px-4 py-3">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline transition duration-150 ease-in-out text-sm">
                        View Product
                      </a>
                    </td>
                    {isCreator && (
                      // Added flex and gap-2 to make buttons side-by-side
                      <td className="px-4 py-3 flex items-center justify-center space-x-2 h-full"> 
                        <button
                          onClick={() => updateItemStatus(item.id, 'approved')}
                          className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-1 transition duration-150 ease-in-out text-sm"
                          title="Approve Item"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        </button>
                        <button
                          onClick={() => updateItemStatus(item.id, 'rejected')}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition duration-150 ease-in-out text-sm"
                          title="Reject Item"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                        </button>
                      </td>
                    )}
                    <td className="px-4 py-3">
                      {item.addedBy?.id === currentUserId && (
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition duration-150 ease-in-out text-sm font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Checkout Button (visible to Creator) */}
      {isCreator && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowCheckout(!showCheckout)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-3 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out text-lg font-bold shadow-lg"
          >
            {showCheckout ? 'Hide Checkout Summary' : 'Proceed to Checkout'}
          </button>
        </div>
      )}

      {/* Checkout Summary Section */}
      {showCheckout && (
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-7 rounded-xl shadow-xl border border-blue-200">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-5 flex items-center">
            <svg className="w-6 h-6 mr-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 1a1 1 0 000 2h10a1 1 0 000-2H3z"></path><path fillRule="evenodd" d="M14 6a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1h11zm-3 2a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd"></path></svg>
            Checkout Summary
          </h2>
          {room.items.filter(item => item.status === 'approved').length === 0 ? (
            <p className="text-gray-600 italic">No approved items to checkout yet.</p>
          ) : (
            <ul className="space-y-4 mb-6">
              {room.items
                .filter(item => item.status === 'approved')
                .map(item => (
                  <li key={item.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                    <div>
                      <a
                        href={item.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 font-semibold hover:underline text-base"
                      >
                        {item.name}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">${parseFloat(item.price).toFixed(2)}</p>
                    </div>
                  </li>
                ))}
            </ul>
          )}
          
          <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow-inner border border-blue-100">
            <span className="text-xl font-extrabold text-gray-900">Total Approved Items:</span>
            <span className="text-2xl font-extrabold text-green-700">
              ${room.items
                .filter(item => item.status === 'approved')
                .reduce((total, item) => total + parseFloat(item.price || 0), 0) // Handle potential non-numeric price
                .toFixed(2)}
            </span>
          </div>

          <button
            onClick={exportToCSV}
            className="mt-6 w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 ease-in-out font-semibold text-lg shadow-md flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Download Approved Items as CSV
          </button>
        </div>
      )}

    </div>
  );
}