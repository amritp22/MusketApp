import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user data from localStorage on mount
  useEffect(() => {
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      try {
        setUser(storedUser ? JSON.parse(storedUser) : null);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setUser(null);
      }
    };
  
    updateUser(); // Run once on mount
  
    window.addEventListener("storage", updateUser); // Listen for changes
  
    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);
  
  

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // Redirect to home after logout
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 shadow-lg">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/images/logo.webp" alt="Musket App Logo" className="h-12 w-12 rounded-full" />
        <span className="text-xl font-bold ml-3">Musket App</span>
      </div>

      {/* Navigation Links */}
      <div className="space-x-6 flex items-center">
        <Link to="/" className="hover:text-green-400">Home</Link>
        {user && user.role === "ROLE_ADMIN" ? (
          <Link to="/qr" className="hover:text-green-400">Scan Tickets</Link>
        ) : (
          <Link to="/getAll" className="hover:text-green-400">Book Tickets</Link>
        )}
        {user && user.role === "ROLE_ADMIN" ? (
          <Link to="/upload" className="hover:text-green-400">Publish Museum</Link>
        ) : null}

        {user ? (
          user.role === "ROLE_ADMIN" ? (
            <Link to="/all-bookings" className="hover:text-green-400">Museum Bookings</Link>
          ) : (
            <Link to="/myBookings" className="hover:text-green-400">My Bookings</Link>
          )
        ) : (
          <a className="hover:text-green-400" href="/#about">About</a>
        )}


        {/* Conditionally render login/logout */}
        {user ? (
          <div className="relative group">
            <button className="flex items-center space-x-2 bg-green-500 px-4 py-2 rounded-lg">
              <span>{user.fullName}</span>
              <span>⬇</span>
            </button>
            {/* Fix: Keep dropdown open on hover */}
            <div className="absolute right-0 mt-2 w-40 bg-white text-black shadow-md rounded-md opacity-0 group-hover:opacity-100 group-hover:visible transition-opacity duration-200">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <Link to="/login" className="hover:text-green-400 bg-green-500 px-4 py-2 rounded-lg">
            Login
          </Link>
        )}

      </div>
    </nav>
  );
};

export default Header;
