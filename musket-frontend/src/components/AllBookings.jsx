import React, { useState, useEffect } from "react";

const AllBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMuseum, setSelectedMuseum] = useState("All"); // Default "All"

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tickets/find");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // ✅ Extract Unique Museum Names for Dropdown
  const museumNames = ["All", ...new Set(bookings.map((b) => b.museum))];

  // ✅ Filter Bookings Based on Selected Museum
  const filteredBookings =
    selectedMuseum === "All"
      ? bookings
      : bookings.filter((booking) => booking.museum === selectedMuseum);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">All Bookings</h2>

      {/* ✅ Show Museum Dropdown for Admins */}
      {/* {user && user.role === "ROLE_ADMIN" && ( */}
        <div className="mb-4 text-center">
          <label className="font-bold mr-2">Filter by Museum:</label>
          <select
            value={selectedMuseum}
            onChange={(e) => setSelectedMuseum(e.target.value)}
            className="border p-2 rounded"
          >
            {museumNames.map((museum) => (
              <option key={museum} value={museum}>
                {museum}
              </option>
            ))}
          </select>
        </div>
      {/* )} */}

      {loading && <p className="text-center text-gray-600">Loading bookings...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Museum</th>
                <th className="py-3 px-6 text-left">Contact</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Persons</th>
                <th className="py-3 px-6 text-left">Time</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">No bookings found.</td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-6">{booking.fullName}</td>
                    <td className="py-3 px-6">{booking.museum}</td>
                    <td className="py-3 px-6">{booking.contact}</td>
                    <td className="py-3 px-6">{booking.date || "N/A"}</td>
                    <td className="py-3 px-6">{booking.noPerson}</td>
                    <td className="py-3 px-6">{booking.time || "N/A"}</td>
                    <td className={`py-3 px-6 font-bold ${booking.status === "VALID" ? "text-green-500" : "text-red-500"}`}>
                      {booking.status === "VALID" ? "Not Visited" : "Visited"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookings;
