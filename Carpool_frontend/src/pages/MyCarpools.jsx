import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getShortAddress } from '../utils/geocode';
import { 
  ArrowLeft, 
  Users,
  Car,
  MapPin,
  Clock,
  Star,
  Phone,
  Mail,
  MessageCircle,
  MoreVertical,
  Navigation,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  Settings,
  TrendingUp,
  Zap
} from 'lucide-react';

const MyCarpools = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // active, completed, cancelled
  const [carpools, setCarpools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Active Carpools', value: '0', icon: Users, color: 'blue' },
    { label: 'Total Rides', value: '0', icon: Car, color: 'teal' },
    { label: 'Money Saved', value: '₹0', icon: DollarSign, color: 'green' },
    { label: 'Avg Rating', value: '0', icon: Star, color: 'yellow' },
  ]);

  useEffect(() => {
    fetchCarpools();
  }, []);

  // Helper function to format date/time to IST
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString || dateTimeString === 'N/A') return dateTimeString;
    
    // If it's just a time (HH:MM format), return as is
    if (/^\d{1,2}:\d{2}(\s?[AP]M)?$/i.test(dateTimeString)) {
      return dateTimeString;
    }
    
    try {
      const date = new Date(dateTimeString);
      if (isNaN(date.getTime())) return dateTimeString;
      
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      return dateTimeString;
    }
  };

  const fetchCarpools = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      const userId = user._id;

      // Fetch offered rides (as driver)
      const offeredRes = await axios.get(`http://localhost:7777/api/rides/getrides/my/${userId}`);
      const offeredRides = offeredRes.data || [];

      // Fetch ride requests (as passenger)
      const requestsRes = await axios.get('http://localhost:7777/api/riderequest/viewrequest', {
        headers: { 'user-id': userId }
      });
      const rideRequests = requestsRes.data || [];

      // Transform offered rides to carpool format (as driver)
      const driverCarpools = await Promise.all(offeredRides.map(async (ride) => {
        let startLoc = 'Start';
        let destLoc = 'End';

        if (ride.start_location) {
          if (ride.start_location.address && 
              !ride.start_location.address.startsWith('Location:') && 
              !ride.start_location.address.match(/^\d+\.\d+,\s*\d+\.\d+$/)) {
            startLoc = ride.start_location.address;
          } else if (ride.start_location.lat && ride.start_location.lng) {
            try {
              startLoc = await getShortAddress(ride.start_location.lat, ride.start_location.lng);
            } catch (err) {
              startLoc = `${ride.start_location.lat.toFixed(4)}, ${ride.start_location.lng.toFixed(4)}`;
            }
          }
        }

        if (ride.destination_location) {
          if (ride.destination_location.address && 
              !ride.destination_location.address.startsWith('Location:') && 
              !ride.destination_location.address.match(/^\d+\.\d+,\s*\d+\.\d+$/)) {
            destLoc = ride.destination_location.address;
          } else if (ride.destination_location.lat && ride.destination_location.lng) {
            try {
              destLoc = await getShortAddress(ride.destination_location.lat, ride.destination_location.lng);
            } catch (err) {
              destLoc = `${ride.destination_location.lat.toFixed(4)}, ${ride.destination_location.lng.toFixed(4)}`;
            }
          }
        }

        // Fetch passengers for this ride
        let passengers = [];
        try {
          const passengersRes = await axios.get(`http://localhost:7777/api/riderequest/ride/${ride._id}`, {
            headers: { 'user-id': userId }
          });
          const requests = passengersRes.data || [];
          passengers = requests
            .filter(req => req.status === 'accepted')
            .map(req => ({
              id: req.user_id?._id || req._id,
              name: req.user_id?.name || 'Passenger',
              avatar: req.user_id?.profilePhoto || `https://ui-avatars.com/api/?name=${req.user_id?.name || 'P'}&background=random`,
              rating: 4.8,
              phone: req.user_id?.phone || 'N/A'
            }));
        } catch (err) {
          console.error('Error fetching passengers:', err);
        }

        return {
          id: ride._id,
          status: ride.status || 'active',
          type: 'driver',
          title: `${ride.ride_type || 'Carpool'} ${ride.ride_type === 'office' ? 'Commute' : 'Trip'}`,
          route: `${startLoc} → ${destLoc}`,
          schedule: `${ride.start_time || 'N/A'}`,
          passengers: passengers,
          totalRides: 1,
          nextRide: ride.createdAt ? new Date(ride.createdAt).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) : ride.start_time || 'N/A',
          earnings: `₹${ride.base_fare || 0}`,
          rating: 4.9,
          isRecurring: ride.ride_type === 'office',
          car: { model: ride.vehicle_id?.model || 'Car', plate: ride.vehicle_id?.plateNumber || 'N/A' }
        };
      }));

      // Transform ride requests to carpool format (as passenger)
      const passengerCarpools = await Promise.all(rideRequests.filter(req => req.ride_id).map(async (req) => {
        let pickupLoc = 'Pickup';
        let dropLoc = 'Drop';

        if (req.pickup_location) {
          if (req.pickup_location.address && !req.pickup_location.address.startsWith('Location:')) {
            pickupLoc = req.pickup_location.address;
          } else if (req.pickup_location.lat && req.pickup_location.lng) {
            try {
              pickupLoc = await getShortAddress(req.pickup_location.lat, req.pickup_location.lng);
            } catch (err) {
              pickupLoc = `${req.pickup_location.lat.toFixed(4)}, ${req.pickup_location.lng.toFixed(4)}`;
            }
          }
        }

        if (req.drop_location) {
          if (req.drop_location.address && !req.drop_location.address.startsWith('Location:')) {
            dropLoc = req.drop_location.address;
          } else if (req.drop_location.lat && req.drop_location.lng) {
            try {
              dropLoc = await getShortAddress(req.drop_location.lat, req.drop_location.lng);
            } catch (err) {
              dropLoc = `${req.drop_location.lat.toFixed(4)}, ${req.drop_location.lng.toFixed(4)}`;
            }
          }
        }

        return {
          id: req._id,
          status: req.status === 'accepted' ? 'active' : req.status === 'rejected' ? 'cancelled' : 'active',
          type: 'passenger',
          title: `${req.ride_id.ride_type || 'Carpool'} ${req.ride_id.ride_type === 'office' ? 'Commute' : 'Trip'}`,
          route: `${pickupLoc} → ${dropLoc}`,
          schedule: `${req.ride_id.start_time || 'N/A'}`,
          driver: {
            id: req.ride_id.driver_id?._id,
            name: req.ride_id.driver_id?.name || 'Driver',
            avatar: req.ride_id.driver_id?.profilePhoto || `https://ui-avatars.com/api/?name=${req.ride_id.driver_id?.name || 'D'}&background=random`,
            rating: 4.8,
            phone: req.ride_id.driver_id?.phone || 'N/A',
            car: { 
              model: req.ride_id.vehicle_id?.model || 'Car', 
              plate: req.ride_id.vehicle_id?.plateNumber || 'N/A' 
            }
          },
          coPassengers: [],
          totalRides: 1,
          nextRide: req.createdAt ? new Date(req.createdAt).toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }) : req.ride_id.start_time || 'N/A',
          spent: `₹${req.ride_id.base_fare || 0}`,
          rating: 4.9,
          isRecurring: req.ride_id.ride_type === 'office'
        };
      }));

      const allCarpools = [...driverCarpools, ...passengerCarpools];
      setCarpools(allCarpools);

      // Calculate stats
      const activeCarpools = allCarpools.filter(c => c.status === 'active').length;
      const totalRides = allCarpools.reduce((sum, c) => sum + c.totalRides, 0);
      const totalMoney = allCarpools
        .filter(c => c.type === 'passenger')
        .reduce((sum, c) => sum + parseInt(c.spent.replace('₹', '') || 0), 0);
      
      setStats([
        { label: 'Active Carpools', value: activeCarpools.toString(), icon: Users, color: 'blue' },
        { label: 'Total Rides', value: totalRides.toString(), icon: Car, color: 'teal' },
        { label: 'Money Saved', value: `₹${totalMoney}`, icon: DollarSign, color: 'green' },
        { label: 'Avg Rating', value: '4.9', icon: Star, color: 'yellow' },
      ]);
    } catch (error) {
      console.error('Error fetching carpools:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCarpools = carpools.filter(c => c.status === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center space-x-2">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>My Carpools</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">Manage your carpool groups</p>
              </div>
            </div>

            <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold hover:shadow-lg transition flex items-center space-x-2">
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">New Carpool</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-3">
                <div className={`bg-${stat.color}-100 p-2 sm:p-3 rounded-xl`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}-600`} />
                </div>
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 mb-6">
          <div className="flex space-x-2">
            {[
              { id: 'active', label: 'Active', count: carpools.filter(c => c.status === 'active').length },
              { id: 'completed', label: 'Completed', count: carpools.filter(c => c.status === 'completed').length },
              { id: 'cancelled', label: 'Cancelled', count: 0 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 3)}</span>
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-slate-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Carpools List */}
        <div className="space-y-4 sm:space-y-6">
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-slate-600">Loading carpools...</p>
            </div>
          ) : filteredCarpools.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No {activeTab} carpools</h3>
              <p className="text-slate-600 mb-4">
                {activeTab === 'active' 
                  ? "Start a new carpool or join an existing one to get started." 
                  : `You don't have any ${activeTab} carpools.`}
              </p>
              {activeTab === 'active' && (
                <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
                  Find Carpools
                </button>
              )}
            </div>
          ) : (
            filteredCarpools.map((carpool) => (
              <div
                key={carpool.id}
                className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:shadow-xl transition"
              >
                {/* Header */}
                <div className={`p-4 sm:p-6 ${
                  carpool.type === 'driver' 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100' 
                    : 'bg-gradient-to-r from-teal-50 to-teal-100'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`${
                        carpool.type === 'driver' 
                          ? 'bg-blue-600' 
                          : 'bg-teal-600'
                      } p-3 rounded-xl text-white`}>
                        {carpool.type === 'driver' ? (
                          <Car className="w-6 h-6" />
                        ) : (
                          <Users className="w-6 h-6" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900">{carpool.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                            carpool.type === 'driver' 
                              ? 'bg-blue-600 text-white' 
                              : 'bg-teal-600 text-white'
                          }`}>
                            {carpool.type === 'driver' ? 'Driver' : 'Passenger'}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-slate-700 mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{carpool.route}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{carpool.schedule || carpool.completedDate}</span>
                          </div>
                        </div>

                        {carpool.isRecurring && (
                          <span className="inline-flex items-center space-x-1 text-xs bg-white/60 px-2 py-1 rounded-full">
                            <Zap className="w-3 h-3" />
                            <span>Recurring</span>
                          </span>
                        )}
                      </div>
                    </div>

                    <button className="p-2 hover:bg-white/50 rounded-lg transition ml-2">
                      <MoreVertical className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  {/* Driver Section (if passenger) */}
                  {carpool.type === 'passenger' && carpool.driver && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Your Driver</h4>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={carpool.driver.avatar} 
                            alt={carpool.driver.name}
                            className="w-12 h-12 rounded-full border-2 border-white"
                          />
                          <div>
                            <div className="font-semibold text-slate-900">{carpool.driver.name}</div>
                            <div className="flex items-center space-x-2 text-sm text-slate-600">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span>{carpool.driver.rating}</span>
                              {carpool.driver.car && (
                                <>
                                  <span>•</span>
                                  <span>{carpool.driver.car.model}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition">
                            <Phone className="w-4 h-4 text-blue-600" />
                          </button>
                          <button className="p-2 bg-teal-100 hover:bg-teal-200 rounded-lg transition">
                            <MessageCircle className="w-4 h-4 text-teal-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Passengers Section (if driver) */}
                  {carpool.type === 'driver' && carpool.passengers && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">
                        Passengers ({carpool.passengers.length})
                      </h4>
                      <div className="space-y-3">
                        {carpool.passengers.map((passenger) => (
                          <div key={passenger.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={passenger.avatar} 
                                alt={passenger.name}
                                className="w-10 h-10 rounded-full border-2 border-white"
                              />
                              <div>
                                <div className="font-semibold text-slate-900 text-sm">{passenger.name}</div>
                                <div className="flex items-center space-x-1 text-xs text-slate-600">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  <span>{passenger.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg transition">
                                <Phone className="w-3 h-3 text-blue-600" />
                              </button>
                              <button className="p-2 bg-teal-100 hover:bg-teal-200 rounded-lg transition">
                                <MessageCircle className="w-3 h-3 text-teal-600" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Co-passengers (if passenger) */}
                  {carpool.type === 'passenger' && carpool.coPassengers && carpool.coPassengers.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-700 mb-3">Co-passengers</h4>
                      <div className="flex items-center space-x-2">
                        {carpool.coPassengers.map((coPassenger) => (
                          <img 
                            key={coPassenger.id}
                            src={coPassenger.avatar} 
                            alt={coPassenger.name}
                            className="w-10 h-10 rounded-full border-2 border-white"
                            title={coPassenger.name}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className="text-lg sm:text-xl font-bold text-slate-900">{carpool.totalRides}</div>
                      <div className="text-xs text-slate-600">Total Rides</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-lg sm:text-xl font-bold text-slate-900">{carpool.rating}</span>
                      </div>
                      <div className="text-xs text-slate-600">Rating</div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <div className="text-lg sm:text-xl font-bold text-green-600">
                        {carpool.earnings || carpool.spent}
                      </div>
                      <div className="text-xs text-slate-600">
                        {carpool.type === 'driver' ? 'Earned' : 'Spent'}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <div className="text-xs text-slate-600">Verified</div>
                    </div>
                  </div>

                  {/* Actions */}
                  {carpool.status === 'active' && (
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2">
                        <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Start Trip</span>
                      </button>
                      <button className="flex-1 bg-slate-100 text-slate-700 py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center space-x-2">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>Schedule</span>
                      </button>
                      <button className="bg-slate-100 text-slate-700 p-2.5 sm:p-3 rounded-xl hover:bg-slate-200 transition">
                        <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  )}

                  {/* Next Ride Info */}
                  {carpool.nextRide && carpool.status === 'active' && (
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                      <div className="flex items-center space-x-2 text-sm text-blue-700">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">Next ride: {carpool.nextRide}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCarpools;
