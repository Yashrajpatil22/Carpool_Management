import { useState } from 'react';
import { Link } from 'react-router-dom';
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
  const [activeTab, setActiveTab] = useState('active'); // active, completed, cancelled

  const carpools = [
    {
      id: 1,
      status: 'active',
      type: 'driver',
      title: 'Daily Tech Park Commute',
      route: 'Downtown → Tech Park',
      schedule: 'Mon-Fri, 8:00 AM',
      passengers: [
        { id: 1, name: 'Sarah Johnson', avatar: 'https://i.pravatar.cc/100?img=1', rating: 4.9, phone: '+91 98765 43210' },
        { id: 2, name: 'Michael Chen', avatar: 'https://i.pravatar.cc/100?img=2', rating: 4.8, phone: '+91 98765 43211' },
        { id: 3, name: 'Emma Davis', avatar: 'https://i.pravatar.cc/100?img=3', rating: 5.0, phone: '+91 98765 43212' },
      ],
      totalRides: 45,
      nextRide: 'Tomorrow, 8:00 AM',
      earnings: '₹6,750',
      rating: 4.9,
      isRecurring: true,
      car: { model: 'Toyota Camry', plate: 'MH 01 AB 1234' }
    },
    {
      id: 2,
      status: 'active',
      type: 'passenger',
      title: 'Evening Return Commute',
      route: 'Tech Park → Downtown',
      schedule: 'Mon-Fri, 5:30 PM',
      driver: {
        id: 1,
        name: 'John Smith',
        avatar: 'https://i.pravatar.cc/100?img=4',
        rating: 4.8,
        phone: '+91 98765 43213',
        car: { model: 'Honda Accord', plate: 'MH 02 CD 5678' }
      },
      coPassengers: [
        { id: 1, name: 'Lisa Anderson', avatar: 'https://i.pravatar.cc/100?img=5' },
        { id: 2, name: 'David Wilson', avatar: 'https://i.pravatar.cc/100?img=6' },
      ],
      totalRides: 42,
      nextRide: 'Today, 5:30 PM',
      spent: '₹4,200',
      rating: 4.9,
      isRecurring: true
    },
    {
      id: 3,
      status: 'active',
      type: 'driver',
      title: 'Weekend Airport Run',
      route: 'City Center → Airport',
      schedule: 'Sat, 2:00 PM',
      passengers: [
        { id: 1, name: 'Robert Taylor', avatar: 'https://i.pravatar.cc/100?img=7', rating: 4.7, phone: '+91 98765 43214' },
      ],
      totalRides: 1,
      nextRide: 'Dec 14, 2:00 PM',
      earnings: '₹500',
      rating: 5.0,
      isRecurring: false,
      car: { model: 'Toyota Camry', plate: 'MH 01 AB 1234' }
    },
    {
      id: 4,
      status: 'completed',
      type: 'passenger',
      title: 'Morning Shopping Trip',
      route: 'Home → Mall District',
      completedDate: 'Dec 8, 2025',
      driver: {
        id: 2,
        name: 'Sarah Johnson',
        avatar: 'https://i.pravatar.cc/100?img=1',
        rating: 4.9
      },
      totalRides: 1,
      spent: '₹150',
      rating: 5.0
    },
  ];

  const filteredCarpools = carpools.filter(c => c.status === activeTab);

  const stats = [
    { label: 'Active Carpools', value: carpools.filter(c => c.status === 'active').length, icon: Users, color: 'blue' },
    { label: 'Total Rides', value: '88', icon: Car, color: 'teal' },
    { label: 'Money Saved', value: '₹10,950', icon: DollarSign, color: 'green' },
    { label: 'Avg Rating', value: '4.9', icon: Star, color: 'yellow' },
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
          {filteredCarpools.length === 0 ? (
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
