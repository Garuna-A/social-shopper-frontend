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
  
  const currentUserId = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).userId;

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
    if (!searchTerm) return setSearchResults([]);
  
    try {
      const res = await axios.get(`/ebay/search?q=${searchTerm}`);
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
        price: item.price,
        imageUrl: item.image,
        link: item.url,
        roomId: parseInt(id)
      };
      await axios.post('/items',payload);

      const res = await axios.get(`/rooms/${id}`);
      setRoom(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to add item');
    }
  };

  const deleteItem = async (itemId) => {
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
      item.addedBy.name,
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
  };
  

  if (loading) return <p>Loading room...</p>;
  if (!room) return <p>Room not found</p>;

  const isCreator = room.creator.id === currentUserId;

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-blue-700">{room.name}</h1>
        <p className="text-sm text-gray-500">Room Code: <span className="font-mono">{room.code}</span></p>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Members</h2>
        <ul className="list-disc list-inside text-gray-700">
          {room.members.map(member => (
            <li key={member.id}>{member.name}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white shadow p-6 rounded-md">
      <h2 className="text-lg font-semibold mb-4">Search and Add Items</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search for products..."
          className="flex-1 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map(item => (
            <div key={item.id} className="border p-4 rounded shadow-sm bg-gray-50 flex flex-col items-center">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-contain mx-auto"
              />
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium mt-2 text-blue-600 hover:underline text-center block"
              >
                {item.title}
              </a>
              <p className="text-sm text-gray-700 mb-2">${item.price}</p>
              <button
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 mt-auto "
                onClick={() => handleAddItem(item)}
              >
                Add to Room
              </button>
            </div>

            
          ))}
        </div>
        
      )}
    </div>


      <div>
        <h2 className="text-xl font-semibold mb-2">Items</h2>
        {room.items.length === 0 ? (
          <p className="text-gray-500">No items added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className='px-4 py-2'>Image</th>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Added By</th>
                  <th className="px-4 py-2">View</th>
                  {isCreator && <th className="px-4 py-2">Moderate</th>}
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {room.items.map(item => (
                  <tr key={item.id} className="border-t">

                    <td className="px-4 py-2">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-contain" />
                      ) : (
                        <span className="text-gray-400 italic">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">${item.price}</td>
                    <td className="px-4 py-2">{item.status}</td>
                    <td className="px-4 py-2">{item.addedBy.name}</td>
                    <td className="px-4 py-2"><a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                                View
                    </a>
                    </td>
                    {isCreator && (
                      <td className="px-4 py-2 space-x-1">
                        <button
                          onClick={() => updateItemStatus(item.id, 'approved')}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          ✓
                        </button>
                        <button
                          onClick={() => updateItemStatus(item.id, 'rejected')}
                          className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          ✕
                        </button>
                      </td>
                    )}
                    <td className="px-4 py-2">
                      {item.addedBy.id === currentUserId && (
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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

      {showCheckout && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Checkout Summary</h2>
          <ul className="space-y-2">
            {room.items
              .filter(item => item.status === 'approved')
              .map(item => (
                <li key={item.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                  <div>
                    <a
                      href={item.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {item.name}
                    </a>
                    <p className="text-sm text-gray-500">${item.price}</p>
                  </div>
                </li>
              ))}
          </ul>
          <div className="mt-4 font-semibold">
            Total: $
            {room.items
              .filter(item => item.status === 'approved')
              .reduce((total, item) => total + parseFloat(item.price), 0)
              .toFixed(2)}
          </div>
          <button
            onClick={exportToCSV}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Download Approved Items as CSV
          </button>
        </div>
      )}


      {isCreator && (
      <button
        onClick={() => setShowCheckout(true)}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Checkout
      </button>
    )}

    </div>
  );
}
