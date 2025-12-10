import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Schedules from './pages/Schedules';
import MyCarpools from './pages/MyCarpools';
import SuggestedRides from './pages/SuggestedRides';
import LiveTracking from './pages/LiveTracking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/schedules" element={<Schedules />} />
        <Route path="/carpools" element={<MyCarpools />} />
        <Route path="/suggested-rides" element={<SuggestedRides />} />
        <Route path="/tracking" element={<LiveTracking />} />
      </Routes>
    </Router>
  );
}

export default App
