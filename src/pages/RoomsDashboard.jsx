import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useParams } from 'react-router-dom';

export default function RoomDashboard() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    imageUrl: '',
    link: ''
  });
  
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

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newItem,
        price: parseFloat(newItem.price),
        roomId: parseInt(id)
      };
      const res = await axios.post('/items', payload);
      setRoom(prev => ({
        ...prev,
        items: [res.data, ...prev.items]
      }));
      setNewItem({ name: '', price: '', imageUrl: '', link: '' });
    } catch (err) {
      alert('Failed to add item: ' + (err.response?.data?.message || 'Error'));
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
        <h2 className="text-lg font-semibold mb-4">Add Item</h2>
        <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Item name"
            value={newItem.name}
            onChange={e => setNewItem({ ...newItem, name: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newItem.price}
            onChange={e => setNewItem({ ...newItem, price: e.target.value })}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newItem.imageUrl}
            onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Link (optional)"
            value={newItem.link}
            onChange={e => setNewItem({ ...newItem, link: e.target.value })}
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Add Item
          </button>
        </form>
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
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Added By</th>
                  {isCreator && <th className="px-4 py-2">Moderate</th>}
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {room.items.map(item => (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 py-2">{item.name}</td>
                    <td className="px-4 py-2">₹{item.price}</td>
                    <td className="px-4 py-2">{item.status}</td>
                    <td className="px-4 py-2">{item.addedBy.name}</td>
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
    </div>
  );
}
