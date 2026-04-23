import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/basic/Home';
import { Login } from './pages/basic/Login';
import { Register } from './pages/basic/Register';
import { Bookings } from './pages/basic/Bookings';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/bookings" element={<Bookings />} />
        </Routes>
      </div>
    </Router>
  );
}
