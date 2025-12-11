import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  DollarSign,
  Calendar,
  Home,
  Briefcase,
  Map,
  Navigation,
  Car,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';

// Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map Click Handler Component
function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

const OfferRide = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [step, setStep] = useState(1);
  
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocationType, setMapLocationType] = useState('');
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);

  const [formData, setFormData] = useState({
    car_id: '',
    ride_type: 'to_office',
    start_location: {
      lat: 0,
      lng: 0,
      address: ''
    },
    destination_location: {
      lat: 0,
      lng: 0,
      address: ''
    },
    departure_time: '',
    arrival_time: '',
    date: '',
    available_seats: 1,
    base_fare: 0
  });

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        
        // Pre-fill locations and times based on user's addresses
        if (userData.home_address && userData.work_address) {
          setFormData(prev => ({
            ...prev,
            date: today,
            start_location: {
              lat: userData.home_address.lat || 18.5204,
              lng: userData.home_address.lng || 73.8567,
              address: userData.home_address.address || ''
            },
            destination_location: {
              lat: userData.work_address.lat || 18.5204,
              lng: userData.work_address.lng || 73.8567,
              address: userData.work_address.address || ''
            },
            departure_time: userData.toOfficeTime || '',
            arrival_time: '' // Can be calculated or left empty
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            date: today
          }));
        }

        // Fetch user's vehicles
        fetchVehicles(userData.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setLoading(false);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchVehicles = async (userId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:7777'}/api/car/my?user_id=${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setVehicles(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, car_id: data[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRideTypeChange = (type) => {
    setFormData(prev => {
      const newData = { ...prev, ride_type: type };
      
      // Swap start and destination based on ride type and set appropriate times
      if (user) {
        if (type === 'to_office') {
          newData.start_location = {
            lat: user.home_address?.lat || 18.5204,
            lng: user.home_address?.lng || 73.8567,
            address: user.home_address?.address || ''
          };
          newData.destination_location = {
            lat: user.work_address?.lat || 18.5204,
            lng: user.work_address?.lng || 73.8567,
            address: user.work_address?.address || ''
          };
          // Set departure time from user's toOfficeTime
          newData.departure_time = user.toOfficeTime || '';
          newData.arrival_time = '';
        } else if (type === 'from_office') {
          newData.start_location = {
            lat: user.work_address?.lat || 18.5204,
            lng: user.work_address?.lng || 73.8567,
            address: user.work_address?.address || ''
          };
          newData.destination_location = {
            lat: user.home_address?.lat || 18.5204,
            lng: user.home_address?.lng || 73.8567,
            address: user.home_address?.address || ''
          };
          // Set departure time from user's fromOfficeTime
          newData.departure_time = user.fromOfficeTime || '';
          newData.arrival_time = '';
        } else {
          // For other ride types, clear times and locations
          newData.departure_time = '';
          newData.arrival_time = '';
          newData.start_location = { lat: 18.5204, lng: 73.8567, address: '' };
          newData.destination_location = { lat: 18.5204, lng: 73.8567, address: '' };
        }
      }
      
      return newData;
    });
  };

  const openMapPicker = (type) => {
    setMapLocationType(type);
    const initialPos = type === 'start' 
      ? formData.start_location
      : formData.destination_location;
    setTempMarkerPosition([initialPos.lat, initialPos.lng]);
    setShowMapModal(true);
  };

  const handleMapLocationSelect = (latlng) => {
    setTempMarkerPosition([latlng.lat, latlng.lng]);
  };

  const confirmMapLocation = () => {
    if (tempMarkerPosition) {
      const coords = { lat: tempMarkerPosition[0], lng: tempMarkerPosition[1] };
      const address = `Location: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
      
      if (mapLocationType === 'start') {
        setFormData({...formData, start_location: { ...coords, address }});
      } else {
        setFormData({...formData, destination_location: { ...coords, address }});
      }
    }
    setShowMapModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.car_id) {
      setMessage({ type: 'error', text: 'Please select a vehicle' });
      return;
    }
    
    if (!formData.departure_time || !formData.date) {
      setMessage({ type: 'error', text: 'Please select date and departure time' });
      return;
    }
    
    if (formData.available_seats < 1) {
      setMessage({ type: 'error', text: 'Available seats must be at least 1' });
      return;
    }

    if (formData.base_fare < 0) {
      setMessage({ type: 'error', text: 'Base fare cannot be negative' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Combine date and times
      const departureDateTime = `${formData.date}T${formData.departure_time}`;
      const arrivalDateTime = formData.arrival_time ? `${formData.date}T${formData.arrival_time}` : '';

      const payload = {
        userId: user.id,
        carId: formData.car_id,
        ride_type: formData.ride_type,
        startLocation: formData.start_location,
        destinationLocation: formData.destination_location,
        startTime: departureDateTime,
        arrivalTime: arrivalDateTime,
        availableSeats: parseInt(formData.available_seats),
        baseFare: parseFloat(formData.base_fare)
      };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:7777'}/api/rides/createride`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.ride) {
        setMessage({ type: 'success', text: 'Ride offered successfully!' });
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to create ride');
      }
    } catch (error) {
      console.error('Error creating ride:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to offer ride. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-12 h-12 text-blue-600 animate-bounce mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                  <Car className="w-6 h-6 text-blue-600" />
                  <span>Offer a Ride</span>
                </h1>
                <p className="text-sm text-slate-600">Share your commute and help others</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
              <Car className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Step {step} of 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-xl flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-700' 
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* No Vehicles Warning */}
        {vehicles.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-2">No Vehicle Found</h3>
                <p className="text-sm text-yellow-700 mb-4">
                  You need to add a vehicle before offering a ride. Please add your vehicle details in Settings.
                </p>
                <Link 
                  to="/settings" 
                  className="inline-flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Vehicle</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Vehicle & Ride Type */}
          {step === 1 && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Select Vehicle & Ride Type</h2>
                <p className="text-slate-600">Choose your vehicle and commute direction</p>
              </div>

              {/* Vehicle Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Select Vehicle *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {vehicles.map((vehicle) => (
                    <div
                      key={vehicle._id}
                      onClick={() => setFormData({...formData, car_id: vehicle._id})}
                      className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                        formData.car_id === vehicle._id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          formData.car_id === vehicle._id ? 'bg-blue-600' : 'bg-slate-100'
                        }`}>
                          <Car className={`w-5 h-5 ${
                            formData.car_id === vehicle._id ? 'text-white' : 'text-slate-600'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">
                            {vehicle.company} {vehicle.model}
                          </div>
                          <div className="text-sm text-slate-600">{vehicle.plate_number}</div>
                          <div className="text-sm text-slate-500 mt-1">
                            {vehicle.color} • {vehicle.number_of_seats} seats
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ride Type */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Ride Type *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div
                    onClick={() => handleRideTypeChange('to_office')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                      formData.ride_type === 'to_office'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        formData.ride_type === 'to_office' ? 'bg-blue-600' : 'bg-slate-100'
                      }`}>
                        <Briefcase className={`w-5 h-5 ${
                          formData.ride_type === 'to_office' ? 'text-white' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="font-semibold text-slate-900 text-sm">To Office</div>
                      <div className="text-xs text-slate-600 mt-1">Morning</div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleRideTypeChange('from_office')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                      formData.ride_type === 'from_office'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        formData.ride_type === 'from_office' ? 'bg-blue-600' : 'bg-slate-100'
                      }`}>
                        <Home className={`w-5 h-5 ${
                          formData.ride_type === 'from_office' ? 'text-white' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="font-semibold text-slate-900 text-sm">From Office</div>
                      <div className="text-xs text-slate-600 mt-1">Evening</div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleRideTypeChange('airport')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                      formData.ride_type === 'airport'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        formData.ride_type === 'airport' ? 'bg-blue-600' : 'bg-slate-100'
                      }`}>
                        <Navigation className={`w-5 h-5 ${
                          formData.ride_type === 'airport' ? 'text-white' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="font-semibold text-slate-900 text-sm">Airport</div>
                      <div className="text-xs text-slate-600 mt-1">Trip</div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleRideTypeChange('event')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                      formData.ride_type === 'event'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        formData.ride_type === 'event' ? 'bg-blue-600' : 'bg-slate-100'
                      }`}>
                        <Calendar className={`w-5 h-5 ${
                          formData.ride_type === 'event' ? 'text-white' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="font-semibold text-slate-900 text-sm">Event</div>
                      <div className="text-xs text-slate-600 mt-1">Occasion</div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleRideTypeChange('shopping')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                      formData.ride_type === 'shopping'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        formData.ride_type === 'shopping' ? 'bg-blue-600' : 'bg-slate-100'
                      }`}>
                        <MapPin className={`w-5 h-5 ${
                          formData.ride_type === 'shopping' ? 'text-white' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="font-semibold text-slate-900 text-sm">Shopping</div>
                      <div className="text-xs text-slate-600 mt-1">Mall/Store</div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleRideTypeChange('other')}
                    className={`border-2 rounded-xl p-4 cursor-pointer transition ${
                      formData.ride_type === 'other'
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        formData.ride_type === 'other' ? 'bg-blue-600' : 'bg-slate-100'
                      }`}>
                        <Car className={`w-5 h-5 ${
                          formData.ride_type === 'other' ? 'text-white' : 'text-slate-600'
                        }`} />
                      </div>
                      <div className="font-semibold text-slate-900 text-sm">Other</div>
                      <div className="text-xs text-slate-600 mt-1">Custom</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.car_id}
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Locations
              </button>
            </div>
          )}

          {/* Step 2: Locations */}
          {step === 2 && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Set Pickup & Drop Locations</h2>
                <p className="text-slate-600">Verify or update your route locations</p>
              </div>

              {/* Location Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Pickup Location *
                  </label>
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                    <input
                      type="text"
                      value={formData.start_location.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        start_location: { ...formData.start_location, address: e.target.value }
                      })}
                      className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                      placeholder="Enter pickup address"
                    />
                    <button
                      type="button"
                      onClick={() => openMapPicker('start')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-lg transition"
                      title="Pick location on map"
                    >
                      <Map className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Lat: {formData.start_location.lat.toFixed(4)}, Lng: {formData.start_location.lng.toFixed(4)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Drop Location *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="text"
                      value={formData.destination_location.address}
                      onChange={(e) => setFormData({
                        ...formData,
                        destination_location: { ...formData.destination_location, address: e.target.value }
                      })}
                      className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                      placeholder="Enter drop address"
                    />
                    <button
                      type="button"
                      onClick={() => openMapPicker('destination')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-lg transition"
                      title="Pick location on map"
                    >
                      <Map className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Lat: {formData.destination_location.lat.toFixed(4)}, Lng: {formData.destination_location.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                >
                  Continue to Details
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Time & Pricing */}
          {step === 3 && (
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Schedule & Pricing</h2>
                <p className="text-slate-600">Set your departure time and ride details</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Auto-filled with today's date (changeable)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Departure Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600" />
                    <input
                      type="time"
                      value={formData.departure_time}
                      onChange={(e) => setFormData({...formData, departure_time: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {(formData.ride_type === 'to_office' || formData.ride_type === 'from_office') ? 
                      'Auto-filled from profile (changeable)' : 'When you start the ride'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expected Arrival Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-600" />
                    <input
                      type="time"
                      value={formData.arrival_time}
                      onChange={(e) => setFormData({...formData, arrival_time: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Optional - When you expect to reach
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Available Seats *
                  </label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      value={formData.available_seats}
                      onChange={(e) => setFormData({...formData, available_seats: e.target.value})}
                      min="1"
                      max={vehicles.find(v => v._id === formData.car_id)?.number_of_seats || 4}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Max seats: {vehicles.find(v => v._id === formData.car_id)?.number_of_seats || 4}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Base Fare (₹) *
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      value={formData.base_fare}
                      onChange={(e) => setFormData({...formData, base_fare: e.target.value})}
                      min="0"
                      step="10"
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                      placeholder="0"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Per passenger fare
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">Time Information</p>
                    <p>For office rides, times are auto-filled from your profile settings. You can change them if needed for this specific ride.</p>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-semibold text-slate-900 mb-4">Ride Summary</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Vehicle:</span>
                    <span className="font-medium text-slate-900">
                      {vehicles.find(v => v._id === formData.car_id)?.company} {vehicles.find(v => v._id === formData.car_id)?.model}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Type:</span>
                    <span className="font-medium text-slate-900">
                      {formData.ride_type === 'to_office' ? 'To Office' : 'From Office'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date & Time:</span>
                    <span className="font-medium text-slate-900">
                      {formData.date} at {formData.start_time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Available Seats:</span>
                    <span className="font-medium text-slate-900">{formData.available_seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Base Fare:</span>
                    <span className="font-medium text-slate-900">₹{formData.base_fare}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting || vehicles.length === 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Offering Ride...' : 'Offer Ride'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  Select {mapLocationType === 'source' ? 'Pickup' : 'Drop-off'} Location
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  Click anywhere on the map to set your location
                </p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <ArrowLeft className="w-6 h-6 rotate-45" />
              </button>
            </div>

            <div className="h-[500px] relative">
              <MapContainer
                center={tempMarkerPosition || [19.0760, 72.8777]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onLocationSelect={handleMapLocationSelect} />
                {tempMarkerPosition && <Marker position={tempMarkerPosition} />}
              </MapContainer>

              {tempMarkerPosition && (
                <div className="absolute top-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 z-[1000] border-2 border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Selected Location</h4>
                      <p className="text-sm text-slate-600">
                        {tempMarkerPosition[0].toFixed(6)}, {tempMarkerPosition[1].toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 p-6 flex gap-3">
              <button
                onClick={() => setShowMapModal(false)}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmMapLocation}
                disabled={!tempMarkerPosition}
                className={`flex-1 py-3 rounded-xl font-semibold transition ${
                  tempMarkerPosition
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                Confirm Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferRide;
