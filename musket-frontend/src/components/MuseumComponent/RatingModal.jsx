import { useState, useEffect } from "react";

const RatingModal = ({ museum, closeModal,updateRatings }) => {
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    // Fetch ratings for the selected museum
    fetch(`http://localhost:8080/api/museums/${museum.id}/ratings`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Ratings API Response:", data); // Log response
        setRatings(data)//update the state
      })
      .catch((error) => console.error("Error fetching ratings:", error));
  }, [museum.id]);

  // Submit Rating
  const submitRating = async () => {
    if (userRating < 1 || userRating > 5) {
      alert("Please select a valid rating (1-5).");
      return;
    }
    
    try {
      const token = localStorage.getItem("token"); // Get token from storage
      const response = await fetch(`http://localhost:8080/api/museums/${museum.id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: userRating }),
      });

      if (!response.ok) throw new Error("Failed to submit rating");

      // // Ensure ratings is not undefined
      // setRatings((prevRatings = []) => [...prevRatings, { userName: "You", rating: userRating }]);
      alert("Rating submitted successfully!");

      // Fetch updated ratings immediately
      fetch(`http://localhost:8080/api/museums/${museum.id}/ratings`)
        .then((response) => response.json())
        .then((data) => {
         setRatings(data); // Update the ratings state with the latest data
       })
       .catch((error) => console.error("Error fetching updated ratings:", error));

       // Call `updateRatings` to refresh the average rating in MuseumCard
        updateRatings();
      closeModal();
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">{museum.name} Ratings</h2>

        {/* Display Existing Ratings */}
        {ratings.length > 0 ? (
          <ul className="space-y-2">
            {ratings.map((rating, index) => (
              <li key={index} className="border-b pb-2">
                <p className="font-semibold">{rating.user?.fullName || "Anonymous"}</p>
                <p>⭐ {rating.rating}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No ratings available yet.</p>
        )}

        {/* Submit Rating */}
        <input
          type="number"
          min="1"
          max="5"
          value={userRating}
          onChange={(e) => setUserRating(e.target.value)}
          className="mt-3 border p-2 w-full"
        />
        <button onClick={submitRating} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Submit Rating
        </button>

        {/* Close Modal Button */}
        <button onClick={closeModal} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default RatingModal;
