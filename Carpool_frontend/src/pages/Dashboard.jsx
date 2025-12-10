import { 
  LayoutDashboard, 
  Car, 
  MapPin, 
  Calendar, 
  Bell, 
  Settings,
  Link as LinkIcon, 
  Search,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  Users,
  DollarSign,
  Leaf,
  Clock,
  Navigation,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true, path: '/dashboard' },
    { icon: Car, label: 'Suggested Rides', badge: '12', path: '/suggested-rides' },
    { icon: Users, label: 'My Carpools', badge: '3', path: '/carpools' },
    { icon: MapPin, label: 'Live Tracking', path: '/tracking' },
    { icon: Calendar, label: 'Schedules', path: '/schedules' },
    { icon: Bell, label: 'Notifications', badge: '5', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const stats = [
    { 
      label: 'Total Rides', 
      value: '47', 
      change: '+12%', 
      icon: Car,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Money Saved', 
      value: '₹1,245', 
      change: '+8%', 
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'CO₂ Reduced', 
      value: '125 kg', 
      change: '+15%', 
      icon: Leaf,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50'
    },
    { 
      label: 'Hours Saved', 
      value: '34 hrs', 
      change: '+5%', 
      icon: Clock,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
  ];

  const suggestedRides = [
    {
      driver: 'Sarah Johnson',
      avatar: 'https://i.pravatar.cc/100?img=1',
      rating: 4.9,
      seats: 2,
      match: 95,
      time: '8:30 AM',
      from: 'Downtown',
      to: 'Tech Park',
      price: '₹50',
      verified: true
    },
    {
      driver: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/100?img=2',
      rating: 4.8,
      seats: 3,
      match: 92,
      time: '8:45 AM',
      from: 'Central Station',
      to: 'Business District',
      price: '₹60',
      verified: true
    },
    {
      driver: 'Emma Davis',
      avatar: 'https://i.pravatar.cc/100?img=3',
      rating: 5.0,
      seats: 1,
      match: 88,
      time: '9:00 AM',
      from: 'West Side',
      to: 'University Campus',
      price: '₹40',
      verified: true
    },
  ];

  const upcomingRides = [
    {
      type: 'Pickup',
      driver: 'John Smith',
      time: 'Today, 5:30 PM',
      location: 'Office Building A',
      status: 'confirmed'
    },
    {
      type: 'Drop-off',
      driver: 'John Smith',
      time: 'Today, 6:15 PM',
      location: 'Home - Downtown',
      status: 'scheduled'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-40 ${
        sidebarOpen ? 'w-64' : 'w-64 lg:w-20'
      } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
            {sidebarOpen && (
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-2 rounded-xl">
                  <Car className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                  SmartCarpool
                </span>
              </div>
            )}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link 
                    to={item.path}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition ${
                      item.active 
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white' 
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      {sidebarOpen && <span className="font-medium">{item.label}</span>}
                    </div>
                    {sidebarOpen && item.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        item.active ? 'bg-white/20' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Profile */}
          <div className="border-t border-slate-200 p-4">
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'}`}>
              <img 
                src="https://i.pravatar.cc/100?img=4" 
                alt="User" 
                className="w-10 h-10 rounded-full"
              />
              {sidebarOpen && (
                <div className="flex-1">
                  <div className="font-semibold text-slate-900 text-sm">Alex Morgan</div>
                  <div className="text-xs text-slate-500">alex@example.com</div>
                </div>
              )}
              {sidebarOpen && <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Navigation */}
        <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-20">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search rides, locations..."
                  className="pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600 w-64 lg:w-96 transition"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="relative p-2 hover:bg-slate-100 rounded-lg transition">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition">
                <Plus className="w-4 h-4" />
                <span className="font-medium">Request Ride</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Welcome back, Alex! 👋</h2>
              <p className="text-blue-100 mb-6">You have 2 upcoming rides today. Ready to start your commute?</p>
              
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/offer-ride"
                  className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition flex items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Offer a Ride</span>
                </Link>
                <Link 
                  to="/find-ride"
                  className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition border border-white/30 flex items-center space-x-2"
                >
                  <Search className="w-5 h-5" />
                  <span>Find a Ride</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-xl`}>
                    <stat.icon className={`w-6 h-6 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{WebkitTextFillColor: 'transparent'}} />
                  </div>
                  <div className="flex items-center text-green-600 text-sm font-semibold">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Suggested Rides */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Suggested Rides for You</h3>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {suggestedRides.map((ride, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl p-4 hover:border-blue-600 hover:shadow-md transition">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <img src={ride.avatar} alt={ride.driver} className="w-12 h-12 rounded-full" />
                        <div>
                          <div className="font-semibold text-slate-900 flex items-center space-x-2">
                            <span>{ride.driver}</span>
                            {ride.verified && (
                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          <div className="text-sm text-slate-600 flex items-center space-x-3">
                            <span>⭐ {ride.rating}</span>
                            <span>•</span>
                            <span>{ride.seats} seats left</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-slate-900">{ride.price}</div>
                        <div className="text-xs text-slate-500">per ride</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-slate-600 mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{ride.time}</span>
                      <span className="mx-2">•</span>
                      <span className="bg-teal-100 text-teal-700 px-2 py-1 rounded-full text-xs font-semibold">
                        {ride.match}% Match
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-sm mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <span className="text-slate-900 font-medium">{ride.from}</span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-teal-600 rounded-full"></div>
                          <span className="text-slate-900 font-medium">{ride.to}</span>
                        </div>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition">
                      Request Ride
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Rides */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Today's Schedule</h3>
                
                <div className="space-y-4">
                  {upcomingRides.map((ride, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-slate-900">{ride.type}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          ride.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {ride.status}
                        </span>
                      </div>
                      <div className="text-sm text-slate-600 mb-1">{ride.time}</div>
                      <div className="text-sm text-slate-500 flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{ride.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
