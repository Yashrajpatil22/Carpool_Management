import { useState } from 'react';
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
  AlertCircle
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
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocationType, setMapLocationType] = useState('');
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);

  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    sourceCoords: null,
    destCoords: null,
    date: '',
    time: '',
    availableSeats: 4,
    pricePerSeat: '',
    recurring: false,
    recurringDays: [],
    preferences: {
      music: true,
      conversation: true,
      pets: false,
      smoking: false
    }
  });

  const openMapPicker = (type) => {
    setMapLocationType(type);
    const initialPos = type === 'source' 
      ? (formData.sourceCoords || { lat: 19.0760, lng: 72.8777 })
      : (formData.destCoords || { lat: 19.0760, lng: 72.8777 });
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
      
      if (mapLocationType === 'source') {
        setFormData({...formData, source: address, sourceCoords: coords});
      } else {
        setFormData({...formData, destination: address, destCoords: coords});
      }
    }
    setShowMapModal(false);
  };

  const toggleRecurringDay = (day) => {
    const days = formData.recurringDays.includes(day)
      ? formData.recurringDays.filter(d => d !== day)
      : [...formData.recurringDays, day];
    setFormData({...formData, recurringDays: days});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Ride Offer:', formData);
    // Navigate to dashboard or confirmation page
    navigate('/dashboard');
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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
              <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
                <Car className="w-6 h-6 text-blue-600" />
                <span>Offer a Ride</span>
              </h1>
              <p className="text-sm text-slate-600">Share your commute and earn while helping others</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Route Section */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Route Details</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pickup Location (Source) *
                </label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData({...formData, source: e.target.value})}
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    placeholder="Enter pickup location"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => openMapPicker('source')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-lg transition"
                    title="Pick location on map"
                  >
                    <Map className="w-5 h-5" />
                  </button>
                </div>
                {formData.sourceCoords && (
                  <p className="text-xs text-green-600 mt-1 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Location verified</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Drop-off Location (Destination) *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={formData.destination}
                    onChange={(e) => setFormData({...formData, destination: e.target.value})}
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    placeholder="Enter drop-off location"
                    required
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
                {formData.destCoords && (
                  <p className="text-xs text-green-600 mt-1 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Location verified</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>Schedule</span>
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({...formData, time: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Recurring Option */}
              <div className="border-2 border-slate-200 rounded-xl p-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.recurring}
                    onChange={(e) => setFormData({...formData, recurring: e.target.checked})}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-900">Make this a recurring ride</span>
                    <p className="text-sm text-slate-600">Offer this ride on multiple days</p>
                  </div>
                </label>

                {formData.recurring && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Select Days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleRecurringDay(day)}
                          className={`px-4 py-2 rounded-lg font-semibold transition ${
                            formData.recurringDays.includes(day)
                              ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Ride Details Section */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Ride Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Available Seats *
                </label>
                <select
                  value={formData.availableSeats}
                  onChange={(e) => setFormData({...formData, availableSeats: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4 Passengers</option>
                  <option value="5">5 Passengers</option>
                  <option value="6">6 Passengers</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Price Per Seat (₹) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="number"
                    value={formData.pricePerSeat}
                    onChange={(e) => setFormData({...formData, pricePerSeat: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    placeholder="50"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4">Ride Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-600 transition">
                <span className="text-slate-700">Music Allowed</span>
                <input
                  type="checkbox"
                  checked={formData.preferences.music}
                  onChange={(e) => setFormData({...formData, preferences: {...formData.preferences, music: e.target.checked}})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-600 transition">
                <span className="text-slate-700">Conversation Welcome</span>
                <input
                  type="checkbox"
                  checked={formData.preferences.conversation}
                  onChange={(e) => setFormData({...formData, preferences: {...formData.preferences, conversation: e.target.checked}})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-600 transition">
                <span className="text-slate-700">Pet Friendly</span>
                <input
                  type="checkbox"
                  checked={formData.preferences.pets}
                  onChange={(e) => setFormData({...formData, preferences: {...formData.preferences, pets: e.target.checked}})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-600 transition">
                <span className="text-slate-700">No Smoking</span>
                <input
                  type="checkbox"
                  checked={!formData.preferences.smoking}
                  onChange={(e) => setFormData({...formData, preferences: {...formData.preferences, smoking: !e.target.checked}})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Link
              to="/dashboard"
              className="flex-1 bg-slate-100 text-slate-700 py-4 rounded-xl font-semibold hover:bg-slate-200 transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Publish Ride Offer
            </button>
          </div>
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
