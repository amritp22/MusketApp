import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRScanner = () => {
    const [qrResult, setQrResult] = useState(null);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [scanner, setScanner] = useState(null);

    useEffect(() => {
        if (isScanning) {
            if (!scanner) {
                const newScanner = new Html5QrcodeScanner(
                    "qr-reader",
                    { fps: 10, qrbox: { width: 250, height: 250 } },
                    false
                );

                newScanner.render(
                    async (decodedText) => {
                        setQrResult(decodedText);
                        newScanner.clear(); // Stop scanning after detecting QR code
                        setIsScanning(false);

                        try {
                            const response = await axios.post("http://localhost:8080/api/tickets/verify", { qrCode: decodedText });

                            // Ensure response is handled as JSON
                            if (response.data && response.data.status) {
                                setVerificationMessage(response.data.message);
                            } else {
                                setVerificationMessage("Invalid response from server");
                            }
                        } catch (error) {
                            console.error("Error verifying ticket:", error);

                            if (error.response) {
                                setVerificationMessage(error.response.data.message || "Verification failed");
                            } else {
                                setVerificationMessage("Network error. Please try again.");
                            }
                        }
                    },
                    (error) => {
                        console.error("QR Scanner Error:", error);
                    }
                );

                setScanner(newScanner);
            }
        } else {
            if (scanner) {
                scanner.clear();
                setScanner(null);
            }
        }

        return () => {
            if (scanner) {
                scanner.clear();
            }
        };
    }, [isScanning]); 

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Scan Ticket QR Code</h2>
            
            {isScanning && <div id="qr-reader" className="w-full max-w-md bg-white rounded-lg shadow-md p-4"></div>}

            {qrResult && (
                <p className="mt-4 text-lg font-semibold text-blue-600">
                    <strong>Scanned Code:</strong> {qrResult}
                </p>
            )}
            {verificationMessage && (
                <p className={`mt-2 text-lg font-semibold ${
                    verificationMessage.includes("valid") ? "text-green-600" : "text-red-600"
                }`}>
                    <strong>Verification:</strong> {verificationMessage}
                </p>
            )}

            <div className="mt-4 flex gap-4">
                <button 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
                    onClick={() => setIsScanning(true)}
                >
                    Start Scanning
                </button>
                <button 
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" 
                    onClick={() => setIsScanning(false)}
                >
                    Stop Scanning
                </button>
            </div>
        </div>
    );
};

export default QRScanner;
