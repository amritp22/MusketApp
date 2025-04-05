import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TicketForm from './components/TicketForm';
import TicketPage from "./components/TicketPage";
import MuseumForm from "./components/MuseumForm";
import MuseumList from "./components/MuseumList";
import QRScanner from "./components/QRScanner";
import HomePage from "./components/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MyBookings from "./components/MyBookings";
import AllBookings from "./components/AllBookings";

function App() {
  return (
    <Router>
      <>
      <Header/>
      <div className="pt-16 min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bookTicket" element={<TicketForm />} />
        <Route path="/ticket/:id" element={<TicketPage />} />
        <Route path="/upload" element={<MuseumForm />} />
        <Route path="/getAll" element={<MuseumList />} />
        <Route path="/qr" element={<QRScanner />} />
        <Route path="/myBookings" element={<MyBookings />} />
        <Route path="/all-bookings" element={<AllBookings />} />

      </Routes>
      </div>
      <Footer/>
      </>
    </Router>
  );
}

export default App;
