import React from 'react';
import useAuthStore from '../store/authStore'; // Ensure this is the correct path

const Navbar = () => {
  const { user, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <span className="text-xl font-bold text-blue-600">Kanban Style TODO List</span>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-700 font-medium">{user?.email}</span>
        <button
          onClick={logout}
          className="cursor-pointer px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;