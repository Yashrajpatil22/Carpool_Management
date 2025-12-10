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
  Calendar,
  Home,
  Briefcase,
  Map,
  Search,
  Filter,
  CheckCircle
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

const FindRide = () => {
  const navigate = useNavigate();
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocationType, setMapLocationType] = useState('');
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);

  const [searchData, setSearchData] = useState({
    source: '',
    destination: '',
    sourceCoords: null,
    destCoords: null,
    date: '',
    time: '',
    passengers: 1,
    filters: {
      verifiedOnly: false,
      instantBook: false,
      acAvailable: false,
      petFriendly: false
    }
  });

  const openMapPicker = (type) => {
    setMapLocationType(type);
    const initialPos = type === 'source' 
      ? (searchData.sourceCoords || { lat: 19.0760, lng: 72.8777 })
      : (searchData.destCoords || { lat: 19.0760, lng: 72.8777 });
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
        setSearchData({...searchData, source: address, sourceCoords: coords});
      } else {
        setSearchData({...searchData, destination: address, destCoords: coords});
      }
    }
    setShowMapModal(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Search Data:', searchData);
    // Navigate to suggested rides with search params
    navigate('/suggested-rides', { state: searchData });
  };

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
                <Search className="w-6 h-6 text-blue-600" />
                <span>Find a Ride</span>
              </h1>
              <p className="text-sm text-slate-600">Search for available rides matching your route</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSearch} className="space-y-6">
          {/* Route Section */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Where do you want to go?</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Pickup Location *
                </label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchData.source}
                    onChange={(e) => setSearchData({...searchData, source: e.target.value})}
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    placeholder="Enter your pickup location"
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
                {searchData.sourceCoords && (
                  <p className="text-xs text-green-600 mt-1 flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>Location verified</span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Drop-off Location *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchData.destination}
                    onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
                    className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    placeholder="Enter your destination"
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
                {searchData.destCoords && (
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
              <span>When do you need a ride?</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="date"
                    value={searchData.date}
                    onChange={(e) => setSearchData({...searchData, date: e.target.value})}
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
                    value={searchData.time}
                    onChange={(e) => setSearchData({...searchData, time: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Passengers *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <select
                    value={searchData.passengers}
                    onChange={(e) => setSearchData({...searchData, passengers: parseInt(e.target.value)})}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition appearance-none"
                  >
                    <option value="1">1 Passenger</option>
                    <option value="2">2 Passengers</option>
                    <option value="3">3 Passengers</option>
                    <option value="4">4 Passengers</option>
                    <option value="5">5 Passengers</option>
                    <option value="6">6 Passengers</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center space-x-2">
              <Filter className="w-5 h-5 text-blue-600" />
              <span>Search Filters (Optional)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-600 transition">
                <span className="text-slate-700">Verified Drivers Only</span>
                <input
                  type="checkbox"
                  checked={searchData.filters.verifiedOnly}
                  onChange={(e) => setSearchData({...searchData, filters: {...searchData.filters, verifiedOnly: e.target.checked}})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-600 transition">
                <span className="text-slate-700">Instant Booking</span>
                <input
                  type="checkbox"
                  checked={searchData.filters.instantBook}
                  onChange={(e) => setSearchData({...searchData, filters: {...searchData.filters, instantBook: e.target.checked}})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-600 transition">
                <span className="text-slate-700">AC Available</span>
                <input
                  type="checkbox"
                  checked={searchData.filters.acAvailable}
                  onChange={(e) => setSearchData({...searchData, filters: {...searchData.filters, acAvailable: e.target.checked}})}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl cursor-pointer hover:border-blue-600 transition">
                <span className="text-slate-700">Pet Friendly</span>
                <input
                  type="checkbox"
                  checked={searchData.filters.petFriendly}
                  onChange={(e) => setSearchData({...searchData, filters: {...searchData.filters, petFriendly: e.target.checked}})}
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
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
            >
              <Search className="w-5 h-5" />
              <span>Search Rides</span>
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

export default FindRide;
