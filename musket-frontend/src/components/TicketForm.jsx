import React, { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
const TicketForm = () => {
  const location = useLocation();
  const {museumName}=location.state || ""
  const [formData, setFormData] = useState({
    fullName: "",
    museum: museumName,
    contact: "",
    date: "",
    noPerson: "",
    time: "",
  });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const token = localStorage.getItem("token"); // Get token from localStorage
    console.log("token sendingt to backend",token);
    
    try {
      const response = await fetch("http://localhost:8080/api/tickets/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Data from backend:", data);
        
        navigate(`/ticket/${data.ticketId}`, { 
          state: { 
            qrCode: data.qrCode, 
            user: formData.fullName, 
            museum: formData.museum 
          } 
        });
      } else {
        alert("Failed to create ticket");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
};


  return (
    <div className="container px-5 py-24 mx-auto">
        
      <div className="flex flex-col text-center w-full mb-12">
        <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
          Book Your Ticket
        </h1>
        <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
          Enter The Following Details.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="lg:w-1/2 md:w-2/3 mx-auto">
        <div className="flex flex-wrap -m-2">
          <div className="p-2 w-1/2">
            <label className="leading-7 text-sm text-gray-600">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          {/* <div className="p-2 w-1/2">
            <label className="leading-7 text-sm text-gray-600">User ID</label>
            <input
              type="email"
              name="user_id"
              value={formData.user_id}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div> */}
          <div className="p-2 w-1/2">
            <label className="leading-7 text-sm text-gray-600">
              Name of Museum/Monument
            </label>
            <input
              type="text"
              name="museum"
              value={formData.museum}
              readOnly
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="p-2 w-1/2">
            <label className="leading-7 text-sm text-gray-600">Phone No</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="p-2 w-1/2">
            <label className="leading-7 text-sm text-gray-600">Choose Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
          <div className="p-2 w-1/2">
            <label className="leading-7 text-sm text-gray-600">No Of Persons</label>
            <select
              name="noPerson"
              value={formData.noPerson}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            >
              {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <div className="p-2 w-1/2">
            <label className="leading-7 text-sm text-gray-600">
              Choose Time Slot
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            >
              <option value="10:00-12:00">10:00-12:00</option>
              <option value="01:00-03:00">01:00-02:00</option>
              <option value="04:00-06:00">04:00-06:00</option>
            </select>
          </div>
          <div className="p-2 w-full pt-8 mt-8 border-t border-gray-200 text-center">
            <button
              type="submit"
              className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
            >
              Get Ticket
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
