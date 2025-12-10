import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Car,
  MapPin,
  Clock,
  Star,
  User,
  Filter,
  Search,
  Navigation,
  DollarSign,
  Users,
  Calendar,
  Shield,
  ArrowRight,
  SlidersHorizontal,
  Zap,
  Leaf,
  TrendingUp,
  CheckCircle,
  Heart,
  X
} from 'lucide-react';

const SuggestedRides = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchFrom, setSearchFrom] = useState('Downtown');
  const [searchTo, setSearchTo] = useState('Tech Park');
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTime, setSelectedTime] = useState('morning');
  const [sortBy, setSortBy] = useState('match');

  const rides = [
    {
      id: 1,
      driver: {
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/100?img=1',
        rating: 4.9,
        totalRides: 156,
        verified: true
      },
      from: { name: 'Downtown Plaza', distance: '0.2 km from you' },
      to: { name: 'Tech Park Gate 3', distance: '0.1 km from destination' },
      time: '8:00 AM',
      date: 'Today',
      seatsAvailable: 2,
      totalSeats: 4,
      price: 50,
      matchPercentage: 98,
      car: { model: 'Toyota Camry', color: 'Silver', plate: 'MH 01 AB 1234' },
      amenities: ['AC', 'Music', 'WiFi'],
      recurring: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      preferences: { music: true, conversation: true, pets: false },
      savings: 85,
      carbonSaved: 2.5
    },
    {
      id: 2,
      driver: {
        name: 'Michael Chen',
        avatar: 'https://i.pravatar.cc/100?img=2',
        rating: 4.8,
        totalRides: 142,
        verified: true
      },
      from: { name: 'Central Station', distance: '0.5 km from you' },
      to: { name: 'Tech Park Main Entrance', distance: '0.3 km from destination' },
      time: '8:15 AM',
      date: 'Today',
      seatsAvailable: 3,
      totalSeats: 4,
      price: 60,
      matchPercentage: 95,
      car: { model: 'Honda Accord', color: 'Black', plate: 'MH 02 CD 5678' },
      amenities: ['AC', 'Music'],
      recurring: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      preferences: { music: true, conversation: false, pets: false },
      savings: 75,
      carbonSaved: 2.3
    },
    {
      id: 3,
      driver: {
        name: 'Emma Davis',
        avatar: 'https://i.pravatar.cc/100?img=3',
        rating: 5.0,
        totalRides: 89,
        verified: true
      },
      from: { name: 'West Side Mall', distance: '0.8 km from you' },
      to: { name: 'Tech Park Building A', distance: '0.2 km from destination' },
      time: '8:30 AM',
      date: 'Today',
      seatsAvailable: 1,
      totalSeats: 3,
      price: 45,
      matchPercentage: 92,
      car: { model: 'Hyundai Creta', color: 'White', plate: 'MH 03 EF 9012' },
      amenities: ['AC', 'Pet-friendly'],
      recurring: false,
      preferences: { music: false, conversation: true, pets: true },
      savings: 90,
      carbonSaved: 2.1
    },
    {
      id: 4,
      driver: {
        name: 'Robert Taylor',
        avatar: 'https://i.pravatar.cc/100?img=7',
        rating: 4.7,
        totalRides: 201,
        verified: true
      },
      from: { name: 'North Avenue', distance: '1.2 km from you' },
      to: { name: 'Tech Park South Wing', distance: '0.5 km from destination' },
      time: '7:45 AM',
      date: 'Today',
      seatsAvailable: 2,
      totalSeats: 4,
      price: 55,
      matchPercentage: 88,
      car: { model: 'Maruti Suzuki Ertiga', color: 'Grey', plate: 'MH 04 GH 3456' },
      amenities: ['AC', 'Music', 'Spacious'],
      recurring: true,
      days: ['Mon', 'Wed', 'Fri'],
      preferences: { music: true, conversation: true, pets: false },
      savings: 80,
      carbonSaved: 2.4
    },
  ];

  const [savedRides, setSavedRides] = useState([]);

  const toggleSaveRide = (rideId) => {
    setSavedRides(prev => 
      prev.includes(rideId) 
        ? prev.filter(id => id !== rideId)
        : [...prev, rideId]
    );
  };

  const sortedRides = [...rides].sort((a, b) => {
    if (sortBy === 'match') return b.matchPercentage - a.matchPercentage;
    if (sortBy === 'price') return a.price - b.price;
    if (sortBy === 'rating') return b.driver.rating - a.driver.rating;
    return 0;
  });

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
                  <Car className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Suggested Rides</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">{rides.length} rides match your route</p>
              </div>
            </div>

            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-slate-100 text-slate-700 px-3 sm:px-4 py-2 rounded-xl font-medium hover:bg-slate-200 transition flex items-center space-x-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* From */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-700 mb-1">From</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-600" />
                <input
                  type="text"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none text-sm"
                  placeholder="Pickup location"
                />
              </div>
            </div>

            {/* To */}
            <div className="relative">
              <label className="block text-xs font-medium text-slate-700 mb-1">To</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-600" />
                <input
                  type="text"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none text-sm"
                  placeholder="Drop location"
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none text-sm"
              >
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="custom">Custom Date</option>
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Time</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none text-sm"
              >
                <option value="morning">Morning (6-10 AM)</option>
                <option value="afternoon">Afternoon (12-4 PM)</option>
                <option value="evening">Evening (5-9 PM)</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex items-end">
              <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Filters</h3>
              <button 
                onClick={() => setShowFilters(false)}
                className="text-slate-600 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm">Verified Only</span>
              </label>
              <label className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm">AC Available</span>
              </label>
              <label className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm">Pet Friendly</span>
              </label>
              <label className="flex items-center space-x-2 p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-sm">Recurring Rides</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Rides List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sort Options */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{sortedRides.length} Rides Available</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 border-2 border-slate-200 rounded-lg text-sm focus:border-blue-600 focus:outline-none"
                >
                  <option value="match">Best Match</option>
                  <option value="price">Lowest Price</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>

            {/* Ride Cards */}
            {sortedRides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Driver Avatar */}
                      <div className="relative">
                        <img 
                          src={ride.driver.avatar} 
                          alt={ride.driver.name}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-slate-100"
                        />
                        {ride.driver.verified && (
                          <div className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Driver Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-slate-900 text-lg">{ride.driver.name}</h3>
                            <div className="flex items-center space-x-3 text-sm text-slate-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-semibold">{ride.driver.rating}</span>
                              </div>
                              <span>•</span>
                              <span>{ride.driver.totalRides} rides</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => toggleSaveRide(ride.id)}
                              className={`p-2 rounded-lg transition ${
                                savedRides.includes(ride.id)
                                  ? 'bg-red-100 text-red-600'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              <Heart className={`w-5 h-5 ${savedRides.includes(ride.id) ? 'fill-red-600' : ''}`} />
                            </button>
                            <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                              {ride.matchPercentage}% Match
                            </span>
                          </div>
                        </div>

                        {/* Car Info */}
                        <div className="mt-2 text-sm text-slate-600">
                          <Car className="w-4 h-4 inline mr-1" />
                          {ride.car.model} • {ride.car.color} • {ride.car.plate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex items-start space-x-2">
                        <div className="bg-blue-600 p-1.5 rounded-full mt-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">Pickup</div>
                          <div className="font-semibold text-slate-900">{ride.from.name}</div>
                          <div className="text-xs text-blue-600">{ride.from.distance}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <Clock className="w-5 h-5 text-slate-600 mx-auto mb-1" />
                          <div className="font-bold text-slate-900">{ride.time}</div>
                          <div className="text-xs text-slate-600">{ride.date}</div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <div className="bg-teal-600 p-1.5 rounded-full mt-1">
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 mb-1">Drop-off</div>
                          <div className="font-semibold text-slate-900">{ride.to.name}</div>
                          <div className="text-xs text-teal-600">{ride.to.distance}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <Users className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="font-bold text-slate-900">{ride.seatsAvailable}/{ride.totalSeats}</div>
                      <div className="text-xs text-slate-600">Seats</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="font-bold text-green-600">₹{ride.price}</div>
                      <div className="text-xs text-slate-600">Per Seat</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                      <div className="font-bold text-purple-600">{ride.savings}%</div>
                      <div className="text-xs text-slate-600">Savings</div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 text-center">
                      <Leaf className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="font-bold text-green-600">{ride.carbonSaved}kg</div>
                      <div className="text-xs text-slate-600">CO₂ Saved</div>
                    </div>
                  </div>

                  {/* Amenities & Preferences */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {ride.amenities.map((amenity) => (
                      <span key={amenity} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        {amenity}
                      </span>
                    ))}
                    {ride.recurring && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>Recurring</span>
                      </span>
                    )}
                  </div>

                  {/* Recurring Days */}
                  {ride.recurring && (
                    <div className="flex items-center space-x-2 mb-4">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      <span className="text-sm text-slate-600">Repeats:</span>
                      {ride.days.map((day) => (
                        <span key={day} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                          {day}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2">
                      <span>Request Ride</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    <button className="bg-slate-100 text-slate-700 px-4 py-3 rounded-xl font-semibold hover:bg-slate-200 transition">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Avg. Match</span>
                  <span className="font-bold text-teal-600">93%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Avg. Price</span>
                  <span className="font-bold text-green-600">₹52</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 text-sm">Total Savings</span>
                  <span className="font-bold text-purple-600">83%</span>
                </div>
              </div>
            </div>

            {/* Saved Rides */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900">Saved Rides</h3>
                <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                  {savedRides.length}
                </span>
              </div>
              {savedRides.length === 0 ? (
                <p className="text-sm text-slate-600">No saved rides yet</p>
              ) : (
                <p className="text-sm text-slate-600">You have {savedRides.length} saved ride(s)</p>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-6 text-white">
              <Shield className="w-8 h-8 mb-3" />
              <h3 className="font-bold mb-2">Safety First</h3>
              <p className="text-sm text-blue-100">
                Always verify driver details and share your trip with a friend or family member.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestedRides;
