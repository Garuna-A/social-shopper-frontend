import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const [loading,setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/login');
    } catch (err) {
      console.error(err);
      alert('Registration failed: ' + (err.response?.data?.message || 'Unexpected error'));
    }
    finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      {loading ? (
        <div className="bg-white/70 backdrop-blur-md p-10 rounded-2xl shadow-2xl flex flex-col items-center space-y-4 animate-fade-in">
          <div className="flex justify-center items-center">
            <div className="w-6 h-6 border-4 border-white border-t-orange-500 rounded-full animate-spin"></div>
            <span className="ml-3 text-orange-600 font-semibold text-lg">Creating your account...</span>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleRegister}
          className="bg-white/70 backdrop-blur-md shadow-2xl border border-white/30 rounded-2xl p-10 w-full max-w-md space-y-6 animate-fade-in"
        >
          <h2 className="text-3xl font-extrabold text-center text-indigo-700 drop-shadow-sm">Create Account</h2>
  
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
  
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
  
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
  
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-3 rounded-xl font-semibold hover:scale-105 transform transition"
          >
            Register
          </button>
  
          <p className="text-center text-sm text-gray-700">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-600 hover:underline font-medium">Login</a>
          </p>
        </form>
      )}
    </div>
  );  
}
