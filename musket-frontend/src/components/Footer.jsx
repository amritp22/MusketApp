import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white text-center py-4 mt-auto">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Musket App. All Rights Reserved.
      </p>
      <div className="flex justify-center space-x-6 mt-2">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500">
          Facebook
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
          Twitter
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
          Instagram
        </a>
      </div>
      <div className="mt-3">
        <p className="text-sm">Reach Us: <a href="mailto:muskeet@gmail.com" className="text-blue-400 hover:underline">muskeet@gmail.com</a></p>
      </div>
    </footer>
  );
};

export default Footer;
