import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 shadow-md py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-extrabold text-blue-700 drop-shadow-sm">
          Social Shopper
        </Link>
        {/* Add more nav links or buttons here if needed */}
      </div>
    </nav>
  );
}
