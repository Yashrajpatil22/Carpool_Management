import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle as LeafletCircle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowLeft, 
  MapPin,
  Navigation,
  Phone,
  MessageCircle,
  Clock,
  Car,
  User,
  AlertCircle,
  CheckCircle,
  Circle,
  Route,
  Zap,
  Shield,
  Star,
  ChevronRight,
  Radio,
  TrendingUp,
  Users
} from 'lucide-react';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different markers
const createCustomIcon = (color, icon) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="transform: rotate(45deg); color: white; font-size: 18px;">
          ${icon}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const driverIcon = createCustomIcon('#10b981', '🚗');
const pickupIcon = createCustomIcon('#3b82f6', '📍');
const dropoffIcon = createCustomIcon('#14b8a6', '🎯');

const LiveTracking = () => {
  const [driverLocation, setDriverLocation] = useState({ lat: 19.0760, lng: 72.8777 });
  const [eta, setEta] = useState(8);
  const [currentSpeed, setCurrentSpeed] = useState(45);

  const pickupLocation = { lat: 19.0896, lng: 72.8656 };
  const dropoffLocation = { lat: 19.1150, lng: 72.8697 };

  // Route path
  const routePath = [
    [19.0760, 72.8777], // Driver current location
    [19.0820, 72.8700],
    [19.0860, 72.8680],
    [19.0896, 72.8656], // Pickup
    [19.0950, 72.8670],
    [19.1020, 72.8685],
    [19.1150, 72.8697], // Dropoff
  ];

  // Simulate real-time driver movement
  useEffect(() => {
    let step = 0;
    const interval = setInterval(() => {
      setDriverLocation(prev => {
        step += 1;
        const progress = (step % 100) / 100;
        const nextLat = prev.lat + (pickupLocation.lat - prev.lat) * 0.01;
        const nextLng = prev.lng + (pickupLocation.lng - prev.lng) * 0.01;
        return { lat: nextLat, lng: nextLng };
      });
      setEta(prev => Math.max(1, prev - 0.05));
      setCurrentSpeed(prev => Math.max(20, Math.min(80, prev + (Math.random() - 0.5) * 5)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const ride = {
    driver: {
      name: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/100?img=1',
      rating: 4.9,
      phone: '+91 98765 43210',
      car: { model: 'Toyota Camry', color: 'Silver', plate: 'MH 01 AB 1234' }
    },
    pickup: { name: 'Downtown Plaza', address: 'MG Road, Mumbai', time: '8:00 AM' },
    dropoff: { name: 'Tech Park Gate 3', address: 'Bandra Kurla Complex', time: '8:35 AM' },
    price: 50,
    passengers: [
      { name: 'You', avatar: 'https://i.pravatar.cc/100?img=10', status: 'waiting' },
      { name: 'Michael Chen', avatar: 'https://i.pravatar.cc/100?img=2', status: 'picked' }
    ],
    status: 'arriving',
    bookingId: 'RP-2025-00156'
  };

  const routeStops = [
    { name: 'Starting Point', address: 'Driver Location', status: 'completed', time: '7:45 AM' },
    { name: 'Michael Chen Pickup', address: 'Central Station', status: 'completed', time: '7:52 AM' },
    { name: 'Your Pickup', address: 'Downtown Plaza', status: 'current', time: '8:00 AM', eta: `${Math.floor(eta)} min` },
    { name: 'Tech Park', address: 'Bandra Kurla Complex', status: 'pending', time: '8:35 AM' }
  ];

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
                  <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  <span>Live Tracking</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">Booking ID: {ride.bookingId}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full flex items-center space-x-1 text-sm font-semibold">
                <Circle className="w-2 h-2 fill-green-600" />
                <span className="hidden sm:inline">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* Map Container */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
              <div className="h-[400px] sm:h-[500px] relative">
                <MapContainer
                  center={[driverLocation.lat, driverLocation.lng]}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Route Polyline */}
                  <Polyline
                    positions={routePath}
                    pathOptions={{
                      color: '#0ea5e9',
                      weight: 4,
                      opacity: 0.7,
                      dashArray: '10, 10',
                    }}
                  />

                  {/* Driver Marker */}
                  <Marker position={[driverLocation.lat, driverLocation.lng]} icon={driverIcon}>
                    <Popup>
                      <div className="text-center">
                        <strong>{ride.driver.name}</strong><br />
                        <span className="text-sm">{ride.driver.car.model}</span><br />
                        <span className="text-sm text-green-600">{Math.round(currentSpeed)} km/h</span>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Driver Location Circle */}
                  <LeafletCircle
                    center={[driverLocation.lat, driverLocation.lng]}
                    radius={100}
                    pathOptions={{
                      fillColor: '#10b981',
                      fillOpacity: 0.1,
                      color: '#10b981',
                      weight: 2,
                      opacity: 0.5,
                    }}
                  />

                  {/* Pickup Marker */}
                  <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={pickupIcon}>
                    <Popup>
                      <div className="text-center">
                        <strong>Your Pickup</strong><br />
                        <span className="text-sm">{ride.pickup.name}</span><br />
                        <span className="text-sm text-blue-600">ETA: {Math.floor(eta)} min</span>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Dropoff Marker */}
                  <Marker position={[dropoffLocation.lat, dropoffLocation.lng]} icon={dropoffIcon}>
                    <Popup>
                      <div className="text-center">
                        <strong>Destination</strong><br />
                        <span className="text-sm">{ride.dropoff.name}</span>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>

                {/* ETA Banner Overlay */}
                <div className="absolute bottom-4 left-4 right-4 z-[1000]">
                  <div className="bg-white rounded-xl shadow-2xl p-4 border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Clock className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-600">Estimated Arrival</div>
                          <div className="text-2xl font-bold text-green-600">{Math.floor(eta)} min</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-600">Distance</div>
                        <div className="text-lg font-bold text-slate-900">2.3 km</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-600">Speed</div>
                        <div className="text-lg font-bold text-slate-900">{Math.round(currentSpeed)} km/h</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Route Timeline */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <Route className="w-5 h-5 text-blue-600" />
                <span>Route Timeline</span>
              </h3>
              <div className="space-y-4">
                {routeStops.map((stop, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="relative">
                      {index !== routeStops.length - 1 && (
                        <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-full ${
                          stop.status === 'completed' ? 'bg-green-500' : 'bg-slate-200'
                        }`}></div>
                      )}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                        stop.status === 'completed' 
                          ? 'bg-green-100 text-green-600' 
                          : stop.status === 'current'
                          ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-200'
                          : 'bg-slate-100 text-slate-400'
                      }`}>
                        {stop.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : stop.status === 'current' ? (
                          <Radio className="w-5 h-5 animate-pulse" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className={`font-semibold ${
                            stop.status === 'current' ? 'text-blue-600' : 'text-slate-900'
                          }`}>{stop.name}</h4>
                          <p className="text-sm text-slate-600">{stop.address}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-slate-900">{stop.time}</div>
                          {stop.eta && (
                            <div className="text-xs text-green-600 font-semibold">{stop.eta}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Driver Info */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Driver Details</h3>
              <div className="flex items-start space-x-4 mb-4">
                <div className="relative">
                  <img 
                    src={ride.driver.avatar} 
                    alt={ride.driver.name}
                    className="w-16 h-16 rounded-full border-4 border-slate-100"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-green-600 rounded-full p-1">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-900">{ride.driver.name}</h4>
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-slate-700">{ride.driver.rating}</span>
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    <Car className="w-4 h-4 inline mr-1" />
                    {ride.driver.car.model}
                  </div>
                  <div className="text-sm text-slate-600">
                    {ride.driver.car.color} • {ride.driver.car.plate}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button className="bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center space-x-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat</span>
                </button>
              </div>
            </div>

            {/* Passengers */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Co-Passengers</span>
              </h3>
              <div className="space-y-3">
                {ride.passengers.map((passenger, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={passenger.avatar} 
                        alt={passenger.name}
                        className="w-10 h-10 rounded-full border-2 border-slate-100"
                      />
                      <span className="font-semibold text-slate-900">{passenger.name}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      passenger.status === 'picked' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {passenger.status === 'picked' ? 'Picked Up' : 'Waiting'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ride Details */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Ride Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Fare</span>
                  <span className="font-bold text-green-600">₹{ride.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Status</span>
                  <span className="font-semibold text-blue-600">Driver Arriving</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Payment</span>
                  <span className="font-semibold text-slate-900">Online</span>
                </div>
              </div>
            </div>

            {/* Safety Info */}
            <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-6 text-white">
              <Shield className="w-8 h-8 mb-3" />
              <h3 className="font-bold mb-2">Emergency SOS</h3>
              <p className="text-sm text-red-50 mb-4">
                Tap the button below if you need immediate assistance
              </p>
              <button className="w-full bg-white text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition">
                Emergency Help
              </button>
            </div>

            {/* Share Trip */}
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-6 text-white">
              <Navigation className="w-8 h-8 mb-3" />
              <h3 className="font-bold mb-2">Share Your Trip</h3>
              <p className="text-sm text-blue-100 mb-4">
                Let friends & family track your ride in real-time
              </p>
              <button className="w-full bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition flex items-center justify-center space-x-2">
                <span>Share Live Location</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
