import React from "react"; 
import { Link } from "react-router-dom";
const Homepage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <header className="relative text-center py-20 bg-cover bg-center" style={{ backgroundImage: "url('/images/allMuseum.jpg')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold">Starting of Modern Era</h1>
          <p className="mt-4 text-lg">Welcome to the new age heritage. Book tickets with us for a hassle-free experience.</p>
          <Link to="/getAll">
          <button className="mt-6 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
            Book Tickets
          </button>
          </Link>
        </div>
      </header>
      
      {/* About Section */}
      <section className="py-16 text-center px-6">
        <h2 className="text-4xl font-semibold text-green-400">About Us</h2>
        <p className="mt-4 text-lg max-w-3xl mx-auto">We provide a seamless way to book tickets to monuments and museums, helping you avoid long queues and enjoy your visit stress-free.</p>
        <img src="./images/seamless.jpg" alt="Seamless Ticket Booking" className="mt-6 rounded-lg mx-auto max-w-md h-auto" />
      </section>
      
      {/* Exhibition Gallery */}
      <section className="py-16 bg-gray-800 px-6">
        <h2 className="text-4xl font-semibold text-center text-green-400">Our Exhibition Gallery</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <img src="/images/qutob.jpg" alt="Qutub Minar" className="rounded-lg max-w-xs h-auto mx-auto" />
          <img src="/images/hawaMahal.jpg" alt="Hawa Mahal" className="rounded-lg max-w-xs h-auto mx-auto" />
          <img src="/images/gateway.jpg" alt="Gateway of India" className="rounded-lg max-w-xs h-auto mx-auto" />
          <img src="/images/mysore.jpg" alt="Mysore Palace" className="rounded-lg max-w-xs h-auto mx-auto" />
          <img src="/images/modernArt.webp" alt="Grand Museum Hall" className="rounded-lg max-w-xs h-auto mx-auto" />
          <img src="/images/grandMuseum.webp" alt="Modern Art Museum" className="rounded-lg max-w-xs h-auto mx-auto" />
        </div>
      </section>
      
      {/* How It Works */}
      <section id="about"className="py-16 text-center px-6">
        <h2 className="text-4xl font-semibold text-green-400">How It Works</h2>
        <div className="mt-8 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-4">
            <img src="/images/step1.webp" alt="Browse Monuments" className="w-24 h-24 rounded-lg" />
            <p className="text-lg">1. Visit our website and browse available monuments.</p>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <img src="/images/step4.webp" alt="Sign Up" className="w-24 h-24 rounded-lg" />
            <p className="text-lg">2. Sign up or log in to book your tickets.</p>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <img src="/images/step2.webp" alt="Payment" className="w-24 h-24 rounded-lg" />
            <p className="text-lg">3. Select a monument, choose a time slot, and pay securely online.</p>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <img src="/images/step3.webp" alt="QR Ticket" className="w-24 h-24 rounded-lg" />
            <p className="text-lg">4. Receive your QR ticket instantly for hassle-free entry.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
