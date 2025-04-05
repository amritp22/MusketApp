import { useState, useEffect } from "react";
import RatingModal from "./RatingModal";
import { useNavigate } from "react-router-dom";

const MuseumCard = ({ museum, canRate }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [ratings, setRatings] = useState([]); // Store ratings
  const [averageRating, setAverageRating] = useState(null); // Store calculated avg rating
  const [userHasRated, setUserHasRated] = useState(false); // Track if user has rated

  // Function to fetch ratings and update the state
  const fetchRatings = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/museums/${museum.id}/ratings`);
      if (!response.ok) throw new Error("Failed to fetch ratings");
      const data = await response.json();
      setRatings(data);

      // Calculate and update the average rating
      if (data.length > 0) {
        const avg = data.reduce((sum, rating) => sum + rating.rating, 0) / data.length;
        setAverageRating(avg.toFixed(1)); 
      } else {
        setAverageRating(null);
      }
       
      // Get user from localStorage
      const storedUser = JSON.parse(localStorage.getItem("user")); 
      const userEmail = storedUser?.email; // Extract email

      console.log("Logged-in User Email:", userEmail);

      // Check if the user has already rated based on email
      const hasUserRated = data.some(rating => rating.user?.email === userEmail);
      setUserHasRated(hasUserRated);
    } catch (error) {
      console.error("Error fetching ratings:", error);
    }
  };
  // Fetch ratings when component mounts
  useEffect(() => {
    fetchRatings();
  }, [museum.id]); // Runs when `museum.id` changes

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img src={museum.imageUrl} alt={museum.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold">{museum.name}</h3>
        <p className="text-gray-600 text-sm mt-2">{museum.description}</p>
        <p className="text-gray-700 font-semibold mt-2">Timings: {museum.timings}</p>

        {/* Show Calculated Average Rating */}
        <p className="text-indigo-600 font-bold cursor-pointer mt-3" onClick={() => setShowModal(true)}>
          ⭐ {averageRating !== null ? averageRating : "No ratings"} (View Ratings)
        </p>

        {/* Show Rate Museum Button */}
        {/* {canRate && (
          <button onClick={() => setShowModal(true)} className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
            Rate Museum
          </button>
        )} */}
        {canRate && (
          <button 
            onClick={() => setShowModal(true)} 
            className={`mt-2 px-4 py-2 rounded ${userHasRated ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white"}`}
            disabled={userHasRated}
          >
            {userHasRated ? "Rating Submitted" : "Rate Museum"}
          </button>
        )}
        {/* Buy Ticket Button */}
        <button
          onClick={() => navigate("/bookTicket", { state: { museumName: museum.name } })}
          className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Buy Tickets
        </button>

        {/* Rating Modal */}
        {showModal && <RatingModal museum={museum} closeModal={() => setShowModal(false)} updateRatings={fetchRatings} />}
      </div>
    </div>
  );
};

export default MuseumCard;
