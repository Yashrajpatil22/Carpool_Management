import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bell, 
  CheckCircle, 
  XCircle,
  Car, 
  Users, 
  MapPin, 
  Clock,
  User,
  Check,
  X,
  Loader
} from 'lucide-react';
import axios from 'axios';

const Notifications = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rideRequests, setRideRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRideRequests();
  }, []);

  const fetchRideRequests = async () => {
    try {
      setLoading(true);
      const userData = localStorage.getItem('user');
      if (!userData) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userData);

      // Fetch all rides offered by the user
      const ridesRes = await axios.get(`http://localhost:7777/api/rides/getrides/my/${user._id}`);
      const userRides = ridesRes.data || [];

      // Fetch requests for each ride
      const allRequests = [];
      for (const ride of userRides) {
        try {
          const requestsRes = await axios.get(`http://localhost:7777/api/riderequest/ride/${ride._id}`, {
            headers: {
              'user-id': user._id
            }
          });
          const requests = requestsRes.data || [];
          
          // Add ride info to each request
          requests.forEach(req => {
            allRequests.push({
              ...req,
              ride_info: ride
            });
          });
        } catch (err) {
          console.error(`Error fetching requests for ride ${ride._id}:`, err);
        }
      }

      // Sort by request time, newest first
      allRequests.sort((a, b) => new Date(b.request_time) - new Date(a.request_time));
      
      setRideRequests(allRequests);
    } catch (err) {
      console.error('Error fetching ride requests:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    setProcessingId(requestId);
    setError('');

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        setError('Please login again');
        return;
      }
      const user = JSON.parse(userData);
      
      await axios.put(`http://localhost:7777/api/riderequest/${requestId}/accept`, {}, {
        headers: {
          'user-id': user._id
        }
      });
      
      // Refresh the list
      await fetchRideRequests();
      
    } catch (err) {
      console.error('Error accepting request:', err);
      setError(err.response?.data?.message || 'Failed to accept request');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    setProcessingId(requestId);
    setError('');

    try {
      const userData = localStorage.getItem('user');
      if (!userData) {
        setError('Please login again');
        return;
      }
      const user = JSON.parse(userData);
      
      await axios.put(`http://localhost:7777/api/riderequest/${requestId}/reject`, {}, {
        headers: {
          'user-id': user._id
        }
      });
      
      // Refresh the list
      await fetchRideRequests();
      
    } catch (err) {
      console.error('Error rejecting request:', err);
      setError(err.response?.data?.message || 'Failed to reject request');
    } finally {
      setProcessingId(null);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Pending' },
      accepted: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Accepted' },
      rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Rejected' },
      cancelled: { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: XCircle, label: 'Cancelled' }
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
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
          <p className="text-slate-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link 
              to="/dashboard" 
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-500 to-teal-500 p-2 rounded-xl">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
                  <p className="text-sm text-slate-600">
                    {rideRequests.filter(r => r.status === 'pending').length} pending request{rideRequests.filter(r => r.status === 'pending').length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start space-x-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {rideRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
            <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Notifications</h2>
            <p className="text-slate-600 mb-6">
              You don't have any ride requests yet. Once passengers request to join your rides, they'll appear here.
            </p>
            <Link
              to="/offer-ride"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
            >
              <Car className="w-5 h-5" />
              <span>Offer a Ride</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rideRequests.map((request) => (
              <div 
                key={request._id}
                className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-gradient-to-br from-blue-100 to-teal-100 p-3 rounded-xl">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-bold text-slate-900">New Ride Request</h3>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-slate-600 mb-1">
                        <span className="font-semibold">{request.passenger_id?.name || 'Passenger'}</span> wants to join your ride
                      </p>
                      <p className="text-xs text-slate-500">{formatTime(request.request_time)}</p>
                    </div>
                  </div>
                </div>

                {/* Ride Details */}
                <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <Car className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Your Ride</p>
                      <p className="text-xs text-slate-600">
                        {new Date(request.ride_info?.date).toLocaleDateString()} at {request.ride_info?.start_time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Passenger Route</p>
                      <p className="text-xs text-slate-600">
                        From: {request.pickup_location?.address || 'Pickup location'}
                      </p>
                      <p className="text-xs text-slate-600">
                        To: {request.drop_location?.address || 'Drop location'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Passenger Info</p>
                      <p className="text-xs text-slate-600">
                        {request.passenger_id?.name || 'N/A'} • {request.passenger_id?.phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons - Only show for pending requests */}
                {request.status === 'pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleAccept(request._id)}
                      disabled={processingId === request._id}
                      className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {processingId === request._id ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Accept</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(request._id)}
                      disabled={processingId === request._id}
                      className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {processingId === request._id ? (
                        <Loader className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <X className="w-5 h-5" />
                          <span>Reject</span>
                        </>
                      )}
                    </button>
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

export default Notifications;
