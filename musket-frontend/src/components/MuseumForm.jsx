import { useState } from "react";

const MuseumForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    timings: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Preview Image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    const token = localStorage.getItem("token"); // Retrieve JWT from localStorage
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append(
      "museum",
      new Blob([JSON.stringify(formData)], { type: "application/json" })
    );
    formDataToSend.append("image", image);

    try {
      const response = await fetch("http://localhost:8080/api/museums/upload", {
        method: "POST",
        body: formDataToSend,
      });
      // try {
      //   const response = await fetch("http://localhost:8080/api/museums/upload", {
      //     method: "POST",
      //     headers: {
      //       "Authorization": `Bearer ${token}`,  // ✅ Send JWT token for authentication
      //     },
      //     body: formDataToSend, 
      //   });
      if (!response.ok) throw new Error("Failed to upload museum");

      const data = await response.json();
      setMessage("Museum uploaded successfully!");
      console.log("Response:", data);

      // Reset Form
      setFormData({ name: "", timings: "", description: "" });
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Error:", error);
      alert("Upload failed! Make sure you're logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Add a Museum</h2>

      {message && (
        <p className={`text-sm p-2 rounded ${message.includes("Error") ? "bg-red-200 text-red-700" : "bg-green-200 text-green-700"}`}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Museum Name */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Museum Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter museum name"
            className="w-full p-2 border rounded bg-gray-100 focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Timings */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Timings</label>
          <input
            type="text"
            name="timings"
            value={formData.timings}
            onChange={handleChange}
            placeholder="e.g., 09:00 AM - 06:00 PM"
            className="w-full p-2 border rounded bg-gray-100 focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Write a short description..."
            rows="3"
            className="w-full p-2 border rounded bg-gray-100 focus:ring-2 focus:ring-indigo-400"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-600 text-sm mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded bg-gray-100"
            required
          />
          {preview && (
            <img src={preview} alt="Preview" className="mt-2 w-full h-40 object-cover rounded-lg shadow-sm" />
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition duration-300"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MuseumForm;