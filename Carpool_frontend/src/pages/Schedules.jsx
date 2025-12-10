import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit,
  Trash2,
  MapPin,
  User,
  Car,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

const Schedules = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // week, day, month
  const [filterType, setFilterType] = useState('all'); // all, driver, passenger

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const schedules = [
    {
      id: 1,
      type: 'driver',
      title: 'Morning Commute - Tech Park',
      time: '08:00 AM',
      endTime: '09:00 AM',
      passengers: 3,
      route: 'Downtown → Tech Park',
      status: 'confirmed',
      recurring: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      date: '2025-12-10'
    },
    {
      id: 2,
      type: 'passenger',
      title: 'Evening Return',
      time: '05:30 PM',
      endTime: '06:30 PM',
      driver: 'John Smith',
      route: 'Tech Park → Downtown',
      status: 'confirmed',
      recurring: true,
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      date: '2025-12-10'
    },
    {
      id: 3,
      type: 'driver',
      title: 'Weekend Trip - Airport',
      time: '02:00 PM',
      endTime: '03:30 PM',
      passengers: 2,
      route: 'City Center → Airport',
      status: 'pending',
      recurring: false,
      date: '2025-12-14'
    },
    {
      id: 4,
      type: 'passenger',
      title: 'Shopping Mall',
      time: '11:00 AM',
      endTime: '12:00 PM',
      driver: 'Sarah Johnson',
      route: 'Home → Mall District',
      status: 'confirmed',
      recurring: false,
      date: '2025-12-11'
    },
  ];

  const getWeekDates = () => {
    const curr = new Date(selectedDate);
    const first = curr.getDate() - curr.getDay();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(curr.setDate(first + i));
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const getSchedulesForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter(s => {
      if (s.recurring && s.days) {
        const dayName = daysOfWeek[date.getDay()].slice(0, 3);
        return s.days.includes(dayName);
      }
      return s.date === dateStr;
    });
  };

  const filteredSchedules = filterType === 'all' 
    ? schedules 
    : schedules.filter(s => s.type === filterType);

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
                  <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Schedules</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">Manage your carpool schedule</p>
              </div>
            </div>

            <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold hover:shadow-lg transition flex items-center space-x-2">
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Add Schedule</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Calendar & Filters */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Calendar Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                    {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                  </h2>
                  <p className="text-sm text-slate-600">Week View</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => navigateWeek(-1)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <button 
                    onClick={() => setSelectedDate(new Date())}
                    className="px-3 sm:px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition"
                  >
                    Today
                  </button>
                  <button 
                    onClick={() => navigateWeek(1)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition"
                  >
                    <ChevronRight className="w-5 h-5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* Week Calendar */}
              <div className="grid grid-cols-7 gap-2">
                {weekDates.map((date, index) => {
                  const daySchedules = getSchedulesForDate(date);
                  const today = isToday(date);
                  
                  return (
                    <div
                      key={index}
                      className={`border-2 rounded-xl p-2 sm:p-3 transition cursor-pointer ${
                        today 
                          ? 'border-blue-600 bg-blue-50' 
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-center mb-2">
                        <div className="text-xs text-slate-600 mb-1">
                          {daysOfWeek[date.getDay()]}
                        </div>
                        <div className={`text-base sm:text-lg font-bold ${
                          today ? 'text-blue-600' : 'text-slate-900'
                        }`}>
                          {date.getDate()}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        {daySchedules.slice(0, 2).map((schedule) => (
                          <div
                            key={schedule.id}
                            className={`w-full h-1.5 rounded-full ${
                              schedule.type === 'driver' 
                                ? 'bg-blue-600' 
                                : 'bg-teal-600'
                            }`}
                          ></div>
                        ))}
                        {daySchedules.length > 2 && (
                          <div className="text-xs text-slate-500 text-center">
                            +{daySchedules.length - 2}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
                <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
                {[
                  { id: 'all', label: 'All Rides' },
                  { id: 'driver', label: 'As Driver', icon: Car },
                  { id: 'passenger', label: 'As Passenger', icon: User },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setFilterType(filter.id)}
                    className={`px-4 py-2 rounded-xl font-medium transition whitespace-nowrap flex items-center space-x-2 ${
                      filterType === filter.id
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter.icon && <filter.icon className="w-4 h-4" />}
                    <span>{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule List */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-900">Upcoming Rides</h3>
              
              {filteredSchedules.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center">
                  <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Schedules</h3>
                  <p className="text-slate-600 mb-4">You don't have any scheduled rides yet.</p>
                  <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
                    Create Schedule
                  </button>
                </div>
              ) : (
                filteredSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="bg-white rounded-2xl border-2 border-slate-200 p-4 sm:p-5 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`${
                          schedule.type === 'driver' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-teal-100 text-teal-600'
                        } p-3 rounded-xl flex-shrink-0`}>
                          {schedule.type === 'driver' ? (
                            <Car className="w-5 h-5 sm:w-6 sm:h-6" />
                          ) : (
                            <User className="w-5 h-5 sm:w-6 sm:h-6" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-slate-900 mb-1">{schedule.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                              schedule.status === 'confirmed' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {schedule.status}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600 mb-2">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{schedule.time} - {schedule.endTime}</span>
                            </div>
                            {schedule.passengers && (
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>{schedule.passengers} passengers</span>
                              </div>
                            )}
                            {schedule.driver && (
                              <div className="flex items-center space-x-1">
                                <User className="w-4 h-4" />
                                <span>Driver: {schedule.driver}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center space-x-2 text-sm mb-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-600">{schedule.route}</span>
                          </div>

                          {schedule.recurring && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-slate-500">Repeats:</span>
                              <div className="flex items-center space-x-1">
                                {schedule.days.map((day) => (
                                  <span
                                    key={day}
                                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold"
                                  >
                                    {day}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        {schedule.status === 'confirmed' ? (
                          <div className="flex items-center space-x-1 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Confirmed</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-yellow-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Pending confirmation</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 hover:bg-blue-50 rounded-lg transition text-blue-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar - Quick Stats & Actions */}
          <div className="space-y-4 sm:space-y-6">
            {/* Today's Summary */}
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">Total Rides</span>
                  <span className="text-2xl font-bold">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">As Driver</span>
                  <span className="text-2xl font-bold">1</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-100">As Passenger</span>
                  <span className="text-2xl font-bold">1</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create New Schedule</span>
                </button>
                <button className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition">
                  View All Schedules
                </button>
                <button className="w-full bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition">
                  Recurring Rides
                </button>
              </div>
            </div>

            {/* Weekly Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-slate-700">Rides Completed</span>
                  </div>
                  <span className="font-bold text-slate-900">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-slate-700">On-time Rate</span>
                  </div>
                  <span className="font-bold text-slate-900">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-slate-700">Hours Saved</span>
                  </div>
                  <span className="font-bold text-slate-900">6.5h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
