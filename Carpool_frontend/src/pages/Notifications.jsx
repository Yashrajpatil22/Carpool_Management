import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bell, 
  CheckCheck, 
  Trash2, 
  Car, 
  Users, 
  DollarSign, 
  MapPin, 
  AlertCircle,
  CheckCircle,
  Info,
  Gift,
  TrendingUp,
  Settings,
  Filter
} from 'lucide-react';

const Notifications = () => {
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'ride_match',
      title: 'New Ride Match Found!',
      message: 'Sarah Johnson\'s route matches yours 95%. Check it out!',
      time: '5 minutes ago',
      read: false,
      icon: Car,
      color: 'blue',
      action: 'View Match'
    },
    {
      id: 2,
      type: 'ride_request',
      title: 'Ride Request Received',
      message: 'Michael Chen wants to join your carpool to Tech Park',
      time: '15 minutes ago',
      read: false,
      icon: Users,
      color: 'teal',
      action: 'Review Request'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      message: 'You received ₹150.00 from Emma Davis for yesterday\'s ride',
      time: '1 hour ago',
      read: false,
      icon: DollarSign,
      color: 'green',
      action: 'View Details'
    },
    {
      id: 4,
      type: 'reminder',
      title: 'Upcoming Ride Reminder',
      message: 'Your ride with John Smith starts in 30 minutes at Downtown',
      time: '2 hours ago',
      read: true,
      icon: MapPin,
      color: 'purple',
      action: 'View Route'
    },
    {
      id: 5,
      type: 'system',
      title: 'Profile Verification Complete',
      message: 'Your profile has been verified! You can now offer rides.',
      time: '3 hours ago',
      read: true,
      icon: CheckCircle,
      color: 'green',
      action: null
    },
    {
      id: 6,
      type: 'promo',
      title: 'Special Offer: 20% Off',
      message: 'Refer 3 friends and get 20% off your next 10 rides!',
      time: '5 hours ago',
      read: true,
      icon: Gift,
      color: 'pink',
      action: 'Refer Now'
    },
    {
      id: 7,
      type: 'update',
      title: 'Ride Status Update',
      message: 'Your driver is 2 minutes away from your pickup location',
      time: 'Yesterday',
      read: true,
      icon: TrendingUp,
      color: 'blue',
      action: null
    },
    {
      id: 8,
      type: 'alert',
      title: 'Route Change Alert',
      message: 'Traffic detected on your usual route. Alternative suggested.',
      time: 'Yesterday',
      read: true,
      icon: AlertCircle,
      color: 'yellow',
      action: 'View Route'
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.type === filter);

  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'ride_match', label: 'Matches', icon: Car },
    { id: 'ride_request', label: 'Requests', icon: Users },
    { id: 'payment', label: 'Payments', icon: DollarSign },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    teal: 'bg-teal-100 text-teal-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    pink: 'bg-pink-100 text-pink-600',
    yellow: 'bg-yellow-100 text-yellow-600',
  };

  const colorBorders = {
    blue: 'border-blue-200',
    teal: 'border-teal-200',
    green: 'border-green-200',
    purple: 'border-purple-200',
    pink: 'border-pink-200',
    yellow: 'border-yellow-200',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4">
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
                  <Bell className="w-6 h-6" />
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-sm text-slate-600">Stay updated with your carpool activity</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-medium hover:bg-slate-200 transition flex items-center space-x-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span className="hidden sm:inline">Mark All Read</span>
                </button>
              )}
              <Link
                to="/settings"
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <Settings className="w-5 h-5 text-slate-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
            <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
            {filters.map((filterItem) => (
              <button
                key={filterItem.id}
                onClick={() => setFilter(filterItem.id)}
                className={`px-4 py-2 rounded-xl font-medium transition whitespace-nowrap flex items-center space-x-2 ${
                  filter === filterItem.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filterItem.icon && <filterItem.icon className="w-4 h-4" />}
                <span>{filterItem.label}</span>
                {filterItem.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    filter === filterItem.id ? 'bg-white/20' : 'bg-slate-200'
                  }`}>
                    {filterItem.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Notifications</h3>
              <p className="text-slate-600">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl border-2 ${
                  notification.read ? 'border-slate-200' : colorBorders[notification.color]
                } p-4 sm:p-5 hover:shadow-lg transition ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`${colorClasses[notification.color]} p-3 rounded-xl flex-shrink-0`}>
                    <notification.icon className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1 flex items-center space-x-2">
                          <span>{notification.title}</span>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </h3>
                        <p className="text-slate-600 text-sm">{notification.message}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-1 sm:space-x-2 ml-2 sm:ml-4">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                            title="Mark as read"
                          >
                            <CheckCheck className="w-4 h-4 text-slate-400" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-slate-500">{notification.time}</span>
                      {notification.action && (
                        <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center space-x-1">
                          <span>{notification.action}</span>
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="mt-6 text-center">
            <button className="bg-white text-slate-600 px-6 py-3 rounded-xl font-semibold border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 transition">
              Load More Notifications
            </button>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">{unreadCount}</div>
                <div className="text-sm text-slate-600">Unread</div>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {notifications.filter(n => n.type === 'ride_match').length}
                </div>
                <div className="text-sm text-slate-600">New Matches</div>
              </div>
              <div className="bg-teal-100 p-3 rounded-xl">
                <Car className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-slate-900">
                  {notifications.filter(n => n.type === 'ride_request').length}
                </div>
                <div className="text-sm text-slate-600">Pending Requests</div>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
