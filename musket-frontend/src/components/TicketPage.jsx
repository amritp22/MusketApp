import { useLocation, useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";

const TicketPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { qrCode, user, museum } = location.state || {};

  const downloadPDF = () => {
    if (!qrCode) return;

    const doc = new jsPDF();
    doc.text(`Hello ${user},`, 20, 20);
    doc.text(`Below is your ticket for ${museum}.`, 20, 30);
    doc.addImage(`data:image/png;base64,${qrCode}`, "PNG", 20, 40, 100, 100);
    doc.save(`${user}ticket.pdf`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Ticket</h2>

        {/* {userName && monumentName && ( */}
          <p className="text-lg text-gray-700 font-medium mb-4">
            Hello <span className="text-indigo-600">{user}</span>, below is your ticket for{" "}
            <span className="text-indigo-600">{museum}</span>.
          </p>


        {qrCode ? (
          <>
            <img
              src={`data:image/png;base64,${qrCode}`}
              alt="QR Code"
              className="mx-auto w-48 h-48 border border-gray-300 rounded-md shadow-sm"
            />
            <button
              onClick={downloadPDF}
              className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300"
            >
              Download as PDF
            </button>
          </>
        ) : (
          <p className="text-gray-600">Loading QR Code...</p>
        )}

        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default TicketPage;
