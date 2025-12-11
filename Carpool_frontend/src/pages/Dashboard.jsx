import { 
  LayoutDashboard, 
  Car, 
  MapPin, 
  Calendar, 
  Bell, 
  Settings,
  Link as LinkIcon, 
  Search,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  Users,
  DollarSign,
  Leaf,
  Clock,
  Navigation,
  Plus,
  ArrowRight,
  FileText,
  User,
  Check
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getShortAddress } from '../utils/geocode';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([
    { label: 'Total Rides', value: '0', change: '+0%', icon: Car, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Money Saved', value: '₹0', change: '+0%', icon: DollarSign, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
    { label: 'CO₂ Reduced', value: '0 kg', change: '+0%', icon: Leaf, color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50' },
    { label: 'Hours Saved', value: '0 hrs', change: '+0%', icon: Clock, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
  ]);
  const [suggestedRides, setSuggestedRides] = useState([]);
  const [upcomingRides, setUpcomingRides] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [offeredRidesWithRequests, setOfferedRidesWithRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geocodingLoading, setGeocodingLoading] = useState(false);

  // Helper function to get readable location from coordinates
  const getLocationName = async (location) => {
    if (!location) return 'Unknown location';
    
    // If address is already available, use it
    if (location.address) {
      return location.address;
    }
    
    // Otherwise, geocode the coordinates
    if (location.lat && location.lng) {
      try {
        const address = await getShortAddress(location.lat, location.lng);
        return address;
      } catch (err) {
        console.error('Geocoding error:', err);
        return 'Unknown location';
      }
    }
    
    return 'Unknown location';
  };

  // Helper function to format date/time in IST
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString || dateTimeString === 'N/A') return 'N/A';
    
    try {
      // Check if it's an ISO datetime string (contains T)
      if (dateTimeString.includes('T')) {
        const date = new Date(dateTimeString);
        return date.toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });
      }
      
      // If it's just a time string (HH:MM format)
      return dateTimeString;
    } catch (err) {
      console.error('Date formatting error:', err);
      return dateTimeString;
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        fetchDashboardData(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const fetchDashboardData = async (userData) => {
    try {
      setLoading(true);
      const BASE_URL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:7777';
      
      // Fetch user's offered rides
      const offeredRidesRes = await axios.get(`${BASE_URL}/api/rides/getrides/my/${userData._id}`);
      const offeredRides = offeredRidesRes.data || [];
      
      // Fetch user's ride requests  
      const requestsRes = await axios.get(`${BASE_URL}/api/riderequest/viewrequest`, {
        headers: {
          'user-id': userData._id
        }
      });
      const rideRequests = requestsRes.data || [];
      console.log('My ride requests:', rideRequests);
      console.log('Offered rides:', offeredRides);
      
      // Calculate stats with proper validation
      // Count completed/active rides for driver (offered rides)
      const completedOfferedRides = offeredRides.filter(ride => 
        ride.status === 'completed' || ride.status === 'active'
      ).length;
      
      // Count accepted/completed rides for passenger (ride requests)
      const completedRideRequests = rideRequests.filter(req => 
        req.status === 'accepted' || req.status === 'completed'
      ).length;
      
      const totalRides = completedOfferedRides + completedRideRequests;
      
      const avgRideCost = 50;
      const moneySaved = totalRides * avgRideCost;
      const co2PerRide = 2.5;
      const co2Reduced = Math.round(totalRides * co2PerRide) || 0;
      const hoursPerRide = 0.5;
      const hoursSaved = Math.round(totalRides * hoursPerRide) || 0;
      
      // Get previous stats from localStorage to calculate percentage change
      const previousStats = JSON.parse(localStorage.getItem('previousStats') || '{}');
      
      const calculateChange = (current, previous) => {
        if (!previous || previous === 0) return current > 0 ? '+100%' : '+0%';
        const change = ((current - previous) / previous) * 100;
        const sign = change >= 0 ? '+' : '';
        return `${sign}${Math.round(change)}%`;
      };
      
      const ridesChange = calculateChange(totalRides, previousStats.totalRides || 0);
      const moneyChange = calculateChange(moneySaved, previousStats.moneySaved || 0);
      const co2Change = calculateChange(co2Reduced, previousStats.co2Reduced || 0);
      const hoursChange = calculateChange(hoursSaved, previousStats.hoursSaved || 0);
      
      // Store current stats for next comparison
      localStorage.setItem('previousStats', JSON.stringify({
        totalRides,
        moneySaved,
        co2Reduced,
        hoursSaved,
        timestamp: Date.now()
      }));
      
      setStats([
        { label: 'Total Rides', value: String(totalRides || 0), change: ridesChange, icon: Car, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Money Saved', value: `₹${moneySaved || 0}`, change: moneyChange, icon: DollarSign, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
        { label: 'CO₂ Reduced', value: `${co2Reduced} kg`, change: co2Change, icon: Leaf, color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50' },
        { label: 'Hours Saved', value: `${hoursSaved} hrs`, change: hoursChange, icon: Clock, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
      ]);
      
      // Fetch suggested rides based on current time and office route
      const currentHour = new Date().getHours();
      const isMorning = currentHour >= 6 && currentHour < 12;
      const isEvening = currentHour >= 16 && currentHour < 21;
      
      let searchLocation = null;
      let rideType = null;
      
      // Determine search criteria based on time of day
      if (isMorning && userData.home_address && userData.work_address) {
        // Morning: Search for rides TO office from home area
        searchLocation = userData.home_address;
        rideType = 'to_office';
      } else if (isEvening && userData.work_address && userData.home_address) {
        // Evening: Search for rides FROM office to home area
        searchLocation = userData.work_address;
        rideType = 'from_office';
      } else if (userData.home_address) {
        // Other times: Just show nearby rides
        searchLocation = userData.home_address;
      }
      
      if (searchLocation) {
        const suggestedRes = await axios.post(`${BASE_URL}/api/ridesuggestion/find`, {
          pickup_location: { lat: searchLocation.lat, lng: searchLocation.lng },
          radius: 5000
        });
        
        let ridesData = suggestedRes.data.rides || [];
        
        // Filter by ride type if it's office commute time
        if (rideType) {
          ridesData = ridesData.filter(ride => ride.ride_type === rideType);
        }
        
        // Filter out user's own rides (don't show rides where user is the driver)
        ridesData = ridesData.filter(ride => ride.driver_id?._id !== userData._id);
        
        const suggested = ridesData.slice(0, 3).map(ride => ({
          driver: ride.driver_id?.name || 'Unknown Driver',
          avatar: ride.driver_id?.profilePhoto || `https://ui-avatars.com/api/?name=${ride.driver_id?.name || 'D'}&background=random`,
          rating: 4.8,
          seats: ride.available_seats || 0,
          match: 95,
          time: ride.start_time || 'N/A',
          from: ride.start_location?.address || 'Start location',
          to: ride.destination_location?.address || 'Destination',
          price: `₹${ride.base_fare || 0}`,
          verified: true,
          rideId: ride._id
        }));
        setSuggestedRides(suggested);
      }
      
      // Set upcoming rides - combine user's offered rides and ride requests
      const upcomingArray = [];
      
      // Show geocoding loader
      setGeocodingLoading(true);
      
      // Add ALL user's offered rides (as driver) - show active rides
      const activeOfferedRides = await Promise.all((offeredRides || []).filter(ride => {
        // Show active and pending rides (not completed or cancelled)
        return ride.status === 'active' || !ride.status;
      }).map(async (ride) => {
        console.log('Processing ride:', ride);
        console.log('Start location:', ride.start_location);
        console.log('Destination location:', ride.destination_location);
        
        let startLoc = 'Start';
        let destLoc = 'End';
        
        // Try to get readable location names
        if (ride.start_location) {
          // Check if address exists and is NOT just coordinates
          if (ride.start_location.address && 
              !ride.start_location.address.startsWith('Location:') && 
              !ride.start_location.address.match(/^\d+\.\d+,\s*\d+\.\d+$/)) {
            startLoc = ride.start_location.address;
            console.log('Using existing start address:', startLoc);
          } else if (ride.start_location.lat && ride.start_location.lng) {
            console.log('Geocoding start location:', ride.start_location.lat, ride.start_location.lng);
            try {
              const geocodedAddress = await getShortAddress(ride.start_location.lat, ride.start_location.lng);
              console.log('Geocoded start address:', geocodedAddress);
              startLoc = geocodedAddress || `${ride.start_location.lat.toFixed(4)}, ${ride.start_location.lng.toFixed(4)}`;
            } catch (err) {
              console.error('Error geocoding start location:', err);
              startLoc = `${ride.start_location.lat.toFixed(4)}, ${ride.start_location.lng.toFixed(4)}`;
            }
          }
        }
        
        if (ride.destination_location) {
          // Check if address exists and is NOT just coordinates
          if (ride.destination_location.address && 
              !ride.destination_location.address.startsWith('Location:') && 
              !ride.destination_location.address.match(/^\d+\.\d+,\s*\d+\.\d+$/)) {
            destLoc = ride.destination_location.address;
            console.log('Using existing destination address:', destLoc);
          } else if (ride.destination_location.lat && ride.destination_location.lng) {
            console.log('Geocoding destination location:', ride.destination_location.lat, ride.destination_location.lng);
            try {
              const geocodedAddress = await getShortAddress(ride.destination_location.lat, ride.destination_location.lng);
              console.log('Geocoded destination address:', geocodedAddress);
              destLoc = geocodedAddress || `${ride.destination_location.lat.toFixed(4)}, ${ride.destination_location.lng.toFixed(4)}`;
            } catch (err) {
              console.error('Error geocoding destination location:', err);
              destLoc = `${ride.destination_location.lat.toFixed(4)}, ${ride.destination_location.lng.toFixed(4)}`;
            }
          }
        }
        
        return {
          type: 'Driving',
          driver: 'You',
          time: ride.start_time || 'N/A',
          location: `${startLoc} → ${destLoc}`,
          status: ride.status || 'active',
          role: 'driver',
          createdAt: ride.createdAt
        };
      }));
      
      // Add ALL ride requests (as passenger) - show all statuses
      const allRideRequests = await Promise.all((rideRequests || []).map(async (req) => {
        let pickupLoc = 'Pickup';
        let dropLoc = 'Drop';
        
        // Try to get readable location names
        if (req.pickup_location?.address) {
          pickupLoc = req.pickup_location.address;
        } else if (req.pickup_location?.lat && req.pickup_location?.lng) {
          try {
            pickupLoc = await getLocationName(req.pickup_location);
          } catch (err) {
            console.error('Error geocoding pickup location:', err);
            pickupLoc = `${req.pickup_location.lat}, ${req.pickup_location.lng}`;
          }
        }
        
        if (req.drop_location?.address) {
          dropLoc = req.drop_location.address;
        } else if (req.drop_location?.lat && req.drop_location?.lng) {
          try {
            dropLoc = await getLocationName(req.drop_location);
          } catch (err) {
            console.error('Error geocoding drop location:', err);
            dropLoc = `${req.drop_location.lat}, ${req.drop_location.lng}`;
          }
        }
        
        return {
          type: 'Passenger',
          driver: req.ride_id?.driver_id?.name || 'Driver',
          time: req.ride_id?.start_time || 'N/A',
          location: `${pickupLoc} → ${dropLoc}`,
          status: req.status || 'pending',
          role: 'passenger',
          createdAt: req.createdAt
        };
      }));
      
      upcomingArray.push(...activeOfferedRides, ...allRideRequests);
      
      // Sort by time
      upcomingArray.sort((a, b) => {
        const timeA = a.time === 'N/A' ? '23:59' : a.time;
        const timeB = b.time === 'N/A' ? '23:59' : b.time;
        return timeA.localeCompare(timeB);
      });
      
      setUpcomingRides(upcomingArray);
      
      // Set my ride requests with status
      setMyRequests(rideRequests || []);
      
      // Fetch requests for each offered ride
      const offeredWithReqs = [];
      for (const ride of offeredRides || []) {
        try {
          const reqsRes = await axios.get(`${BASE_URL}/api/riderequest/ride/${ride._id}`, {
            headers: {
              'user-id': userData._id
            }
          });
          const requests = reqsRes.data || [];
          console.log(`Requests for ride ${ride._id}:`, requests);
          
          // Only show rides with pending requests
          const pendingRequests = requests.filter(r => r.status === 'pending');
          if (pendingRequests.length > 0) {
            offeredWithReqs.push({
              ride,
              requests: pendingRequests
            });
          }
        } catch (err) {
          console.error(`Error fetching requests for ride ${ride._id}:`, err);
        }
      }
      console.log('Offered rides with requests:', offeredWithReqs);
      setOfferedRidesWithRequests(offeredWithReqs);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values on error
      setStats([
        { label: 'Total Rides', value: '0', change: '+0%', icon: Car, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
        { label: 'Money Saved', value: '₹0', change: '+0%', icon: DollarSign, color: 'from-green-500 to-green-600', bgColor: 'bg-green-50' },
        { label: 'CO₂ Reduced', value: '0 kg', change: '+0%', icon: Leaf, color: 'from-teal-500 to-teal-600', bgColor: 'bg-teal-50' },
        { label: 'Hours Saved', value: '0 hrs', change: '+0%', icon: Clock, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50' },
      ]);
    } finally {
      setLoading(false);
      setGeocodingLoading(false);
    }
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true, path: '/dashboard' },
    { icon: Car, label: 'Suggested Rides', badge: '12', path: '/suggested-rides' },
    { icon: Users, label: 'My Carpools', badge: '3', path: '/carpools' },
    { icon: MapPin, label: 'Live Tracking', path: '/tracking' },
    { icon: Calendar, label: 'Schedules', path: '/schedules' },
    { icon: FileText, label: 'My Requests', path: '/my-requests' },
    { icon: Bell, label: 'Notifications', badge: '5', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        alert('Please login again');
        return;
      }
      const user = JSON.parse(userData);
      const BASE_URL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:7777';
      
      await axios.put(`${BASE_URL}/api/riderequest/${requestId}/accept`, {}, {
        headers: {
          'user-id': user._id
        }
      });
      
      // Refresh dashboard data
      fetchDashboardData(user);
    } catch (err) {
      console.error('Error accepting request:', err);
      alert(err.response?.data?.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        alert('Please login again');
        return;
      }
      const user = JSON.parse(userData);
      const BASE_URL = import.meta.env.VITE_BASE_URL || import.meta.env.VITE_BASE_URL || 'http://localhost:7777';
      
      await axios.put(`${BASE_URL}/api/riderequest/${requestId}/reject`, {}, {
        headers: {
          'user-id': user._id
        }
      });
      
      // Refresh dashboard data
      fetchDashboardData(user);
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert(err.response?.data?.message || 'Failed to reject request');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-64 lg:w-20'
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-2 rounded-xl">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  SmartCarpool
                </span>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition ${
                      item.active 
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                    </div>
                    {sidebarOpen && item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.active ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t border-slate-200 p-4">
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
              {user?.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
              {sidebarOpen && (
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">{user?.name || 'User'}</div>
                  <div className="text-xs text-slate-500">{user?.email || 'user@example.com'}</div>
                </div>
              )}
              {sidebarOpen && (
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600 text-xs font-medium"
                  title="Logout"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Navigation */}
        <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-20">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search rides, locations..."
                  className="pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 w-64 lg:w-96 transition"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link to="/notifications" className="relative p-2 hover:bg-slate-100 rounded-lg transition">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Link>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'User'}! 👋
              </h2>
              <p className="text-blue-100 mb-6">You have 2 upcoming rides today. Ready to start your commute?</p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/offer-ride"
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Offer a Ride</span>
                </Link>
                <Link 
                  to="/find-ride"
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition border border-white/30 flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Find a Ride</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center text-green-600 text-sm font-semibold">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Offered Rides with Requests */}
          {offeredRidesWithRequests.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Ride Requests for Your Offers</h3>
                <Link to="/notifications" className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-6">
                {offeredRidesWithRequests.slice(0, 2).map((item) => (
                  <div key={item.ride._id} className="border-2 border-slate-200 rounded-xl p-4">
                    <div className="mb-4 pb-4 border-b border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-2">Your Ride Offer</h4>
                      <div className="text-sm text-slate-600 flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>Departure: {item.ride.start_time || 'Not set'}</span>
                      </div>
                      <div className="text-sm text-slate-600 flex items-center space-x-2 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span>{item.ride.start_location?.address || 'Start'} → {item.ride.destination_location?.address || 'End'}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {item.requests.length} pending request{item.requests.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="space-y-3">
                      {item.requests.slice(0, 2).map((request) => (
                        <div key={request._id} className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <User className="w-4 h-4 text-blue-600" />
                              <span className="font-semibold text-slate-900">{request.passenger_id?.name || 'Passenger'}</span>
                            </div>
                            <span className="text-xs text-slate-500">{new Date(request.request_time).toLocaleTimeString()}</span>
                          </div>
                          <div className="text-xs text-slate-600 mb-3">
                            {request.pickup_location?.address} → {request.drop_location?.address}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleAcceptRequest(request._id)}
                              className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center justify-center space-x-1"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request._id)}
                              className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-1"
                            >
                              <X className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Suggested Rides */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Suggested Rides for You</h3>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {suggestedRides.map((ride, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl p-4 hover:border-blue-600 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img src={ride.avatar} alt={ride.driver} className="w-12 h-12 rounded-full" />
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center space-x-2">
                            <span>{ride.driver}</span>
                            {ride.verified && (
                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 flex items-center space-x-3">
                            <span>⭐ {ride.rating}</span>
                            <span>•</span>
                            <span>{ride.seats} seats left</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{ride.price}</div>
                        <div className="text-xs text-slate-500">per ride</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{ride.time}</span>
                      <span className="mx-2">•</span>
                      <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {ride.match}% Match
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-slate-900 font-medium">{ride.from}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                          <span className="text-slate-900 font-medium">{ride.to}</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition">
                      Request Ride
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Rides */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">My Rides</h3>
                
                {geocodingLoading && (
                  <div className="flex items-center justify-center py-3 mb-4 bg-blue-50 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm text-blue-700 font-medium">Loading locations...</span>
                  </div>
                )}
                
                {upcomingRides.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 text-sm">No active rides</p>
                    <p className="text-slate-400 text-xs mt-1">Offer or find a ride to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingRides.map((ride, index) => {
                      // Determine status badge color
                      const getStatusColor = (status) => {
                        switch(status?.toLowerCase()) {
                          case 'completed':
                            return 'bg-gray-100 text-gray-700 border border-gray-300';
                          case 'cancelled':
                          case 'canceled':
                            return 'bg-red-100 text-red-700 border border-red-300';
                          case 'accepted':
                            return 'bg-green-100 text-green-700 border border-green-300';
                          case 'pending':
                            return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
                          case 'rejected':
                            return 'bg-red-100 text-red-700 border border-red-300';
                          case 'active':
                            return 'bg-blue-100 text-blue-700 border border-blue-300';
                          default:
                            return 'bg-slate-100 text-slate-700 border border-slate-300';
                        }
                      };

                      const getBorderColor = (status) => {
                        switch(status?.toLowerCase()) {
                          case 'completed':
                            return 'border-gray-400';
                          case 'cancelled':
                          case 'canceled':
                            return 'border-red-500';
                          case 'accepted':
                            return 'border-green-500';
                          case 'pending':
                            return 'border-yellow-500';
                          case 'rejected':
                            return 'border-red-500';
                          case 'active':
                            return 'border-blue-500';
                          default:
                            return 'border-blue-600';
                        }
                      };

                      return (
                        <div key={index} className={`border-l-4 ${getBorderColor(ride.status)} pl-4 py-2 bg-slate-50 rounded-r-lg`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-slate-900">{ride.type}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(ride.status)}`}>
                              {ride.status}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600 mb-1">
                            {ride.role === 'driver' ? '🚗 Driving' : '👤 Riding with'} {ride.driver}
                          </div>
                          <div className="text-sm text-slate-600 mb-1 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatDateTime(ride.time)}</span>
                          </div>
                          <div className="text-sm text-slate-500 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{ride.location}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
