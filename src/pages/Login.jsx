import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import Navbar from '../components/Navbar';

export default function Login() {
  const [loading,setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/rooms';
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex flex-col">
      <Navbar />
  
      <div className="flex flex-1 items-center justify-center px-4">
        {loading ? (
          <div className="bg-white/70 backdrop-blur-md shadow-2xl border border-white/30 rounded-2xl p-10 w-full max-w-md flex flex-col items-center justify-center space-y-4 animate-fade-in">
            <div className="flex justify-center items-center mt-4">
              <div className="w-6 h-6 border-4 border-white border-t-orange-500 rounded-full animate-spin"></div>
              <span className="ml-3 text-blue-600 font-semibold">Logging in...</span>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleLogin}
            className="bg-white/70 backdrop-blur-md shadow-2xl border border-white/30 rounded-2xl p-10 w-full max-w-md space-y-6 animate-fade-in"
          >
            <h2 className="text-3xl font-extrabold text-center text-blue-700 drop-shadow-sm">
              Welcome Back
            </h2>
  
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
  
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
  
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl font-semibold hover:scale-105 transform transition"
            >
              Login
            </button>
  
            <p className="text-center text-sm text-gray-700">
              Don't have an account?{' '}
              <a href="/register" className="text-indigo-600 hover:underline font-medium">
                Register
              </a>
            </p>
          </form>
        )}
      </div>
    </div>
  );  
}
