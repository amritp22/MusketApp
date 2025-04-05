import { useState, useEffect } from "react";
import MuseumCard from "./MuseumComponent/MuseumCard";


const MuseumList = () => {
  const [museums, setMuseums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState([]);

  useEffect(() => {
    // Fetch all museums
    fetch("http://localhost:8080/api/museums/getAll")
      .then((response) => response.json())
      .then((data) => {
        setMuseums(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching museums:", error);
        setLoading(false);
      });

    // Fetch user's ticket bookings
    const fetchUserBookings = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from storage
        const response = await fetch("http://localhost:8080/api/tickets/my-tickets", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!response.ok) throw new Error("Failed to fetch user bookings");
        const data = await response.json();
        console.log("ticket status 1",data);
        
        setUserBookings(data);
        console.log("ticket status 2",userBookings);
        
      } catch (error) {
        console.error("Error fetching user bookings:", error);
      }
    };

    fetchUserBookings();
  }, []);

  // Check if user can rate a museum
  // const canRateMuseum = (museumId) => {
  //   return userBookings.some((booking) => booking.museumId === museumId && booking.status === "USED");
  // };

  const canRateMuseum = (museumName) => {
    if (!userBookings || userBookings.length === 0) return false; // Ensure it's defined
    return userBookings.some((booking) => booking.museum === museumName && booking.status === "USED");
  };
  

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Explore Museums</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading museums...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {museums.map((museum) => (
            <MuseumCard key={museum.id} museum={museum} canRate={canRateMuseum(museum.id)} />
          ))} */}
          {museums.map((museum) => (
          <MuseumCard key={museum.id} museum={museum} canRate={canRateMuseum(museum.name)} />
          ))}

        </div>
      )}
    </div>
  );
};

export default MuseumList;
