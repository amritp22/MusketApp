import React, { useEffect, useState } from "react";
import axios from "axios";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from storage
        const response = await axios.get("http://localhost:8080/api/tickets/my-tickets", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-bold text-center">My Booking History</h2>
      <div className="mt-4">
        {bookings.length > 0 ? (
          bookings.map((ticket) => (
            <div key={ticket.id} className="border p-4 rounded-lg shadow-lg my-2">
              <p><strong>Museum:</strong> {ticket.museum}</p>
              <p><strong>Date:</strong> {ticket.date}</p>
              <p><strong>Persons:</strong> {ticket.noPerson}</p>
              <p className={`
                font-bold 
                ${ticket.status === "VALID" ? "text-red-600" : ""}
                ${ticket.status === "USED" ? "text-green-600" : ""}
                ${ticket.status === "EXPIRED" ? "text-yellow-600" : ""}
              `}>
                <strong>Status:</strong> {ticket.status === "VALID" ? "Yet to Visit" : ticket.status === "USED" ? "Visited" : ticket.status}
              </p>

            </div>
          ))
        ) : (
          <p className="text-center">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
