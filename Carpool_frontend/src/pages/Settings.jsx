import { useState } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Moon, 
  Car, 
  MapPin, 
  CreditCard,
  Lock,
  Trash2,
  Save,
  ArrowLeft,
  Camera,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    rideReminders: true,
    promotions: false
  });

  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Regular commuter, prefer quiet rides'
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'vehicle', label: 'Vehicle Info', icon: Car },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-sm text-slate-600">Manage your account and preferences</p>
              </div>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-6">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Profile Information</h2>
                    <p className="text-slate-600">Update your personal information and profile picture</p>
                  </div>

                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img 
                        src="https://i.pravatar.cc/150?img=4" 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full border-4 border-slate-100"
                      />
                      <button className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-2 rounded-full hover:shadow-lg transition">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Profile Photo</h3>
                      <p className="text-sm text-slate-600 mb-3">Upload a new profile picture</p>
                      <div className="flex space-x-2">
                        <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition">
                          Upload New
                        </button>
                        <button className="text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 transition">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Location
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="City, State"
                          className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition resize-none"
                      placeholder="Tell others about yourself..."
                    />
                    <p className="text-sm text-slate-500 mt-2">Brief description for your profile. Max 200 characters.</p>
                  </div>

                  {/* Verification Status */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-1">Verified Account</h4>
                        <p className="text-sm text-blue-700">Your email and phone number are verified. This helps build trust with other users.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Notification Preferences</h2>
                    <p className="text-slate-600">Manage how you receive notifications</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Email Notifications</h4>
                          <p className="text-sm text-slate-600">Receive updates via email</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-teal-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="bg-teal-100 p-2 rounded-lg">
                          <Bell className="w-5 h-5 text-teal-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">Push Notifications</h4>
                          <p className="text-sm text-slate-600">Receive notifications on your device</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.push}
                          onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-teal-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="bg-purple-100 p-2 rounded-lg">
                          <Phone className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">SMS Notifications</h4>
                          <p className="text-sm text-slate-600">Receive text messages for important updates</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.sms}
                          onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-teal-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Notification Types</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                        <span className="text-slate-700">Ride reminders and updates</span>
                        <input
                          type="checkbox"
                          checked={notifications.rideReminders}
                          onChange={(e) => setNotifications({...notifications, rideReminders: e.target.checked})}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                        <span className="text-slate-700">New ride matches</span>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                        <span className="text-slate-700">Payment confirmations</span>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                        <span className="text-slate-700">Promotions and offers</span>
                        <input
                          type="checkbox"
                          checked={notifications.promotions}
                          onChange={(e) => setNotifications({...notifications, promotions: e.target.checked})}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy & Security */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Privacy & Security</h2>
                    <p className="text-slate-600">Manage your privacy settings and account security</p>
                  </div>

                  {/* Change Password */}
                  <div className="border border-slate-200 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                      <Lock className="w-5 h-5" />
                      <span>Change Password</span>
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <button className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Privacy Options */}
                  <div className="border border-slate-200 rounded-xl p-6">
                    <h3 className="font-semibold text-slate-900 mb-4">Privacy Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                        <div>
                          <div className="font-medium text-slate-900">Show profile to other users</div>
                          <div className="text-sm text-slate-600">Allow others to see your profile information</div>
                        </div>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                        <div>
                          <div className="font-medium text-slate-900">Share location during rides</div>
                          <div className="text-sm text-slate-600">Allow real-time location sharing</div>
                        </div>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                          defaultChecked
                        />
                      </label>
                      <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                        <div>
                          <div className="font-medium text-slate-900">Show phone number to matches</div>
                          <div className="text-sm text-slate-600">Display your phone number to confirmed ride partners</div>
                        </div>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="w-6 h-6 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-green-900 mb-1">Two-Factor Authentication Enabled</h4>
                        <p className="text-sm text-green-700 mb-3">Your account is protected with 2FA. You'll be asked for a verification code when signing in.</p>
                        <button className="text-green-700 hover:text-green-800 font-medium text-sm">
                          Manage 2FA Settings →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Preferences</h2>
                    <p className="text-slate-600">Customize your experience</p>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-slate-200 rounded-xl p-6">
                      <h3 className="font-semibold text-slate-900 mb-4">Appearance</h3>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Moon className="w-5 h-5 text-slate-600" />
                          <div>
                            <h4 className="font-semibold text-slate-900">Dark Mode</h4>
                            <p className="text-sm text-slate-600">Use dark theme</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-teal-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-6">
                      <h3 className="font-semibold text-slate-900 mb-4">Language & Region</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Language</label>
                          <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition">
                            <option>English (US)</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                          <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition">
                            <option>Pacific Time (PT)</option>
                            <option>Mountain Time (MT)</option>
                            <option>Central Time (CT)</option>
                            <option>Eastern Time (ET)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-6">
                      <h3 className="font-semibold text-slate-900 mb-4">Ride Preferences</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <span className="text-slate-700">Music allowed during rides</span>
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <span className="text-slate-700">Conversation welcome</span>
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <span className="text-slate-700">Pet-friendly rides</span>
                          <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Vehicle Info */}
              {activeTab === 'vehicle' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Vehicle Information</h2>
                    <p className="text-slate-600">Manage your vehicle details (for drivers)</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="bg-white p-3 rounded-xl">
                          <Car className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 mb-1">2022 Toyota Camry</h3>
                          <p className="text-sm text-slate-600 mb-2">License Plate: ABC-1234</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-slate-600">Color: Silver</span>
                            <span className="text-slate-600">• 4 Seats</span>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Verified</span>
                          </div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Edit</button>
                    </div>
                  </div>

                  <button className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-600 hover:bg-blue-50 transition text-center">
                    <Plus className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-slate-600 font-medium">Add Another Vehicle</span>
                  </button>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-yellow-900 mb-1">Vehicle Verification Required</h4>
                        <p className="text-sm text-yellow-700">Please upload your vehicle registration and insurance documents for verification.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              {activeTab === 'payment' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Payment Methods</h2>
                    <p className="text-slate-600">Manage your payment options</p>
                  </div>

                  <div className="space-y-4">
                    <div className="border-2 border-blue-600 bg-blue-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl text-white">
                            <CreditCard className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 mb-1">Visa •••• 4242</h3>
                            <p className="text-sm text-slate-600">Expires 12/2025</p>
                          </div>
                        </div>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Default</span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Edit</button>
                        <span className="text-slate-300">•</span>
                        <button className="text-red-600 hover:text-red-700 font-medium text-sm">Remove</button>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="bg-slate-100 p-3 rounded-xl">
                            <CreditCard className="w-6 h-6 text-slate-600" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 mb-1">Mastercard •••• 8888</h3>
                            <p className="text-sm text-slate-600">Expires 08/2026</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Set as Default</button>
                      </div>
                    </div>
                  </div>

                  <button className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 hover:border-blue-600 hover:bg-blue-50 transition text-center">
                    <Plus className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <span className="text-slate-600 font-medium">Add Payment Method</span>
                  </button>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            {activeTab === 'privacy' && (
              <div className="bg-white rounded-2xl border-2 border-red-200 p-8 mt-6">
                <div className="flex items-start space-x-3 mb-4">
                  <Trash2 className="w-6 h-6 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-slate-600 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
