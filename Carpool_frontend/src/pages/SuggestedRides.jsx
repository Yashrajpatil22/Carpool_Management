import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Car,
  MapPin,
  Clock,
  Star,
  User,
  Search,
  Navigation2,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';

const SuggestedRides = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { rides, searchData } = location.state || { rides: [], searchData: {} };
  
  const [requestingRideId, setRequestingRideId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRequestRide = async (rideId) => {
    setRequestingRideId(rideId);
    setError('');
    setSuccess('');

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);

      // Validate pickup and drop locations
      if (!searchData?.sourceCoords || !searchData?.destCoords) {
        setError('Missing location data. Please search for rides again.');
        setRequestingRideId(null);
        return;
      }
      
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL || 'http://localhost:7777'}/api/riderequest/createrequest`, {
        ride_id: rideId,
        pickup_location: {
          lat: searchData.sourceCoords.lat,
          lng: searchData.sourceCoords.lng,
          address: searchData.source || ''
        },
        drop_location: {
          lat: searchData.destCoords.lat,
          lng: searchData.destCoords.lng,
          address: searchData.destination || ''
        },
        fare_offered: null // Optional: passenger can offer a fare
      }, {
        headers: {
          'user-id': user._id
        }
      });

      setSuccess(response.data.message || 'Ride request sent successfully! Waiting for driver approval.');
      setTimeout(() => {
        setSuccess('');
        // Optionally navigate to requests page
        // navigate('/my-requests');
      }, 3000);
    } catch (err) {
      console.error('Request ride error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      const errorMsg = err.response?.data?.message 
        || (typeof err.response?.data === 'string' ? err.response?.data : '')
        || err.message 
        || 'Failed to request ride. Please try again.';
      setError(errorMsg);
    } finally {
      setRequestingRideId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getRideTypeLabel = (type) => {
    const labels = {
      to_office: 'To Office',
      from_office: 'From Office',
      airport: 'Airport',
      event: 'Event',
      shopping: 'Shopping',
      other: 'Other'
    };
    return labels[type] || type;
  };

  if (!rides || rides.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
        <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center space-x-4">
              <Link 
                to="/find-ride" 
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">No Rides Found</h1>
                <p className="text-sm text-slate-600">Try adjusting your search criteria</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-12">
            <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No matching rides available</h2>
            <p className="text-slate-600 mb-6">
              We couldn't find any rides matching your search. Try expanding your search radius or adjusting your departure time.
            </p>
            <Link
              to="/find-ride"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Search</span>
            </Link>
          </div>
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
                to="/find-ride" 
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Available Rides</h1>
                <p className="text-sm text-slate-600">{rides.length} ride{rides.length !== 1 ? 's' : ''} found • Sorted by proximity</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-green-900">Success</h4>
              <p className="text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h4 className="font-semibold text-red-900">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Search Summary */}
        <div className="bg-white rounded-xl border-2 border-blue-200 p-4 mb-6">
          <h3 className="font-semibold text-slate-900 mb-2">Your Search</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-2 text-slate-600">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>From: {searchData.source || 'Selected location'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Navigation2 className="w-4 h-4 text-teal-600" />
              <span>To: {searchData.destination || 'Selected location'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>{searchData.date || 'N/A'} at {searchData.time || 'N/A'}</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Users className="w-4 h-4 text-orange-600" />
              <span>{searchData.passengers || 1} passenger{searchData.passengers !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>

        {/* Rides List */}
        <div className="space-y-4">
          {rides.map((ride, index) => (
            <div 
              key={ride._id} 
              className={`bg-white rounded-2xl border-2 p-6 transition hover:shadow-lg ${
                index === 0 ? 'border-green-300 bg-green-50/30' : 'border-slate-200'
              }`}
            >
              {/* Best Match Badge */}
              {index === 0 && (
                <div className="mb-3 inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                  <Star className="w-3 h-3 fill-green-600" />
                  <span>Best Match - Closest to You</span>
                </div>
              )}

              <div className="space-y-3">
                {/* Driver & Car Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {ride.driver_id?.name || 'Driver'}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {ride.driver_id?.email || 'N/A'}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="text-sm font-semibold text-slate-700">4.8</span>
                          <span className="text-xs text-slate-500">(24 rides)</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price Badge - Same line as driver */}
                    <div className="text-right">
                      <p className="text-xs text-slate-500 mb-1 whitespace-nowrap">Price per seat</p>
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl px-4 py-2 inline-block">
                        <p className="text-2xl font-bold text-green-600 whitespace-nowrap">
                          ₹{ride.base_fare || '0'}
                        </p>
                      </div>
                      {ride.distance && (
                        <p className="text-xs text-slate-500 mt-1 whitespace-nowrap">
                          {(ride.distance / 1000).toFixed(1)} km away
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm text-slate-600">
                    <Car className="w-5 h-5 text-slate-400" />
                    <span className="font-medium">
                      {ride.car_id?.company || 'N/A'} {ride.car_id?.model || 'N/A'} • {ride.car_id?.color || 'N/A'}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span>{ride.car_id?.plate_number || 'N/A'}</span>
                  </div>

                  {/* Route Info */}
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Pickup</p>
                        <p className="text-sm font-medium text-slate-900">
                          {ride.start_location?.address || 'Start location'}
                        </p>
                      </div>
                    </div>
                    <div className="border-l-2 border-slate-300 ml-2 h-4"></div>
                    <div className="flex items-start space-x-2">
                      <Navigation2 className="w-4 h-4 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-slate-500">Drop-off</p>
                        <p className="text-sm font-medium text-slate-900">
                          {ride.destination_location?.address || 'Destination'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Time & Details */}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1.5 rounded-lg">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-700">
                        {formatTime(ride.start_time)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 bg-purple-50 px-3 py-1.5 rounded-lg">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      <span className="text-slate-700">{getRideTypeLabel(ride.ride_type)}</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-orange-50 px-3 py-1.5 rounded-lg">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span className="text-slate-700">
                        {ride.available_seats} seat{ride.available_seats !== 1 ? 's' : ''} available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <button
                    onClick={() => handleRequestRide(ride._id)}
                    disabled={requestingRideId === ride._id}
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{requestingRideId === ride._id ? 'Requesting...' : 'Request Ride'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Search */}
        <div className="mt-8 text-center">
          <Link
            to="/find-ride"
            className="inline-flex items-center space-x-2 bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>New Search</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuggestedRides;
