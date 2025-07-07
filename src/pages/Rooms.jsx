import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('/rooms');
        setRooms(res.data);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        alert('Could not load rooms');
      }
    };

    fetchRooms();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/rooms', { name: newRoomName });
      setRooms(prev => [...prev, res.data]);
      setNewRoomName('');
    } catch (err) {
      alert('Room creation failed: ' + (err.response?.data?.message || 'Error'));
    }
  };
  
  const handleJoinRoom = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/rooms/join', { code: joinCode });
      if (!rooms.find(r => r.id === res.data.room.id)) {
        setRooms(prev => [...prev, res.data.room]);
      }
      setJoinCode('');
    } catch (err) {
      alert('Joining room failed: ' + (err.response?.data?.message || 'Error'));
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-blue-700">Your Rooms</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow"
        >
          Logout
        </button>
      </div>
  
      {/* Create Room */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Create a New Room</h2>
        <form onSubmit={handleCreateRoom} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Room name"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            required
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow">
            Create
          </button>
        </form>
      </div>
  
      {/* Join Room */}
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-2">Join a Room</h2>
        <form onSubmit={handleJoinRoom} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Room code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            required
            className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-400"
          />
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow">
            Join
          </button>
        </form>
      </div>
  
      {/* Rooms List */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.length === 0 ? (
          <p className="text-gray-600 text-lg">No rooms yet. Create or join one!</p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="bg-white/90 rounded-xl border border-gray-200 p-5 shadow-md hover:shadow-xl transition">
              <h3 className="font-bold text-lg text-blue-800">{room.name}</h3>
              <p className="text-sm text-gray-500 mb-3">Code: <span className="font-mono">{room.code}</span></p>
              <button
                onClick={() => navigate(`/rooms/${room.id}`)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 shadow-sm"
              >
                Open Room
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );  
}
