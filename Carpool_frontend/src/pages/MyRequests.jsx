import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Navigation2,
  CheckCircle,
  XCircle,
  Loader,
  Calendar,
  User,
  Users,
  Car,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import axios from 'axios';

const MyRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.log('No user data found, redirecting to login');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);
      console.log('Fetching requests for user:', user._id);
      
      const response = await axios.get('http://localhost:7777/api/riderequest/viewrequest', {
        headers: {
          'user-id': user._id
        }
      });

      console.log('Received requests:', response.data);
      setRequests(response.data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
      console.error('Error response:', err.response);
      setError('Failed to load ride requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!confirm('Are you sure you want to cancel this ride request?')) return;

    try {
      setCancellingId(requestId);
      const userData = localStorage.getItem('user');
      const user = JSON.parse(userData);

      await axios.delete(`http://localhost:7777/api/riderequest/${requestId}`, {
        headers: {
          'user-id': user._id
        }
      });

      // Refresh the list
      fetchRequests();
    } catch (err) {
      console.error('Error cancelling request:', err);
      setError('Failed to cancel request');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Accepted' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle, label: 'Rejected' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-800', icon: XCircle, label: 'Cancelled' }
    };

    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center space-x-1 ${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        <Icon className="w-3 h-3" />
        <span>{badge.label}</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading your ride requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">My Ride Requests</h1>
              <p className="text-sm text-slate-600">{requests.length} request{requests.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No ride requests yet</h2>
            <p className="text-slate-600 mb-6">Start searching for rides to send your first request!</p>
            <Link
              to="/find-ride"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              <MapPin className="w-5 h-5" />
              <span>Find a Ride</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div 
                key={request._id} 
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {request.ride_id?.driver_id?.name || 'Driver'}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {request.ride_id?.driver_id?.email || 'N/A'}
                      </p>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-slate-600">
                        <Car className="w-4 h-4" />
                        <span>
                          {request.ride_id?.car_id?.company || 'N/A'} {request.ride_id?.car_id?.model || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                {/* Route Info */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-xl mb-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Pickup</p>
                      <p className="text-sm font-medium text-slate-900">
                        {request.pickup_location?.address || 'Pickup location'}
                      </p>
                    </div>
                  </div>
                  <div className="border-l-2 border-slate-300 ml-2 h-4"></div>
                  <div className="flex items-start space-x-2">
                    <Navigation2 className="w-4 h-4 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-500">Drop-off</p>
                      <p className="text-sm font-medium text-slate-900">
                        {request.drop_location?.address || 'Drop-off location'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="flex items-center justify-between text-sm mb-3">
                  <div className="flex items-center space-x-4 text-slate-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Requested: {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {/* Ride Details */}
                {request.ride_id && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-4 text-sm text-blue-900">
                      {request.ride_id.start_time && (
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Departure: {request.ride_id.start_time}</span>
                        </div>
                      )}
                      {request.ride_id.available_seats !== undefined && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{request.ride_id.available_seats} seats available</span>
                        </div>
                      )}
                      {request.ride_id.base_fare && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>₹{request.ride_id.base_fare}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {request.status === 'pending' && (
                  <button
                    onClick={() => handleCancelRequest(request._id)}
                    disabled={cancellingId === request._id}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {cancellingId === request._id ? 'Cancelling...' : 'Cancel Request'}
                  </button>
                )}

                {/* Status Messages */}
                {request.status === 'accepted' && (
                  <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800">
                      ✓ Your request has been accepted! The driver will contact you soon.
                    </p>
                  </div>
                )}
                {request.status === 'rejected' && (
                  <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-sm text-red-800">
                      ✗ This request was rejected. Try finding another ride.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRequests;
