import { useState, useEffect } from 'react';
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
  AlertCircle,
  Plus,
  Edit,
  Upload,
  X,
  Clock,
  Briefcase,
  Home
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    rideReminders: true,
    promotions: false
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    homeAddress: '',
    workAddress: '',
    toOfficeTime: '',
    fromOfficeTime: '',
    workingDays: [],
    profilePhoto: ''
  });

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setFormData({
            name: userData.name || '',
            phone: userData.phone || '',
            homeAddress: userData.home_address?.address || '',
            workAddress: userData.work_address?.address || '',
            toOfficeTime: userData.toOfficeTime || '',
            fromOfficeTime: userData.fromOfficeTime || '',
            workingDays: userData.workingDays || [],
            profilePhoto: userData.profilePhoto || ''
          });
          // Set initial profile photo preview
          if (userData.profilePhoto) {
            setProfilePhotoPreview(userData.profilePhoto);
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      setLoading(false);
    };
    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    if (!user?.id) {
      setMessage({ type: 'error', text: 'User not found. Please login again.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const updatePayload = {
        name: formData.name,
        phone: formData.phone,
        home_address: {
          address: formData.homeAddress,
          lat: user.home_address?.lat || 0,
          lng: user.home_address?.lng || 0
        },
        work_address: {
          address: formData.workAddress,
          lat: user.work_address?.lat || 0,
          lng: user.work_address?.lng || 0
        },
        toOfficeTime: formData.toOfficeTime,
        fromOfficeTime: formData.fromOfficeTime,
        workingDays: formData.workingDays,
        profilePhoto: formData.profilePhoto
      };

      const response = await fetch(`http://localhost:7777/api/user/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      // Update localStorage with new user data
      const updatedUser = { ...user, ...data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // Update profile photo preview if changed
      if (data.user.profilePhoto) {
        setProfilePhotoPreview(data.user.profilePhoto);
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);

    } catch (error) {
      console.error('Update profile error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to update profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleWorkingDayToggle = (day) => {
    const updatedDays = formData.workingDays.includes(day)
      ? formData.workingDays.filter(d => d !== day)
      : [...formData.workingDays, day];
    setFormData({...formData, workingDays: updatedDays});
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 2MB' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select a valid image file' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({...formData, profilePhoto: base64String});
        setProfilePhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({...formData, profilePhoto: ''});
    setProfilePhotoPreview(null);
  };

  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      color: 'Silver',
      plate: 'MH 01 AB 1234',
      seats: 4,
      verified: true,
      images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=400'],
      insurance: { valid: true, expiryDate: '2025-12-31' },
      registration: { valid: true, expiryDate: '2026-06-30' }
    }
  ]);

  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    plate: '',
    seats: 4,
    images: []
  });

  const handleAddVehicle = () => {
    if (newVehicle.make && newVehicle.model && newVehicle.plate) {
      setVehicles([...vehicles, { ...newVehicle, id: vehicles.length + 1, verified: false }]);
      setNewVehicle({ make: '', model: '', year: '', color: '', plate: '', seats: 4, images: [] });
      setShowAddVehicle(false);
    }
  };

  const handleDeleteVehicle = (id) => {
    setVehicles(vehicles.filter(v => v.id !== id));
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 lg:sticky lg:top-6">
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
                    <p className="text-slate-600">Update your personal information and commute details</p>
                  </div>

                  {/* Success/Error Message */}
                  {message.text && (
                    <div className={`px-4 py-3 rounded-xl flex items-center space-x-2 ${
                      message.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-700' 
                        : 'bg-red-50 border border-red-200 text-red-700'
                    }`}>
                      {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                      <span>{message.text}</span>
                    </div>
                  )}

                  {/* Profile Picture */}
                  <div className="flex items-center space-x-6 pb-6 border-b border-slate-200">
                    <div className="relative">
                      {profilePhotoPreview ? (
                        <img 
                          src={profilePhotoPreview} 
                          alt="Profile" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                      )}
                      <input
                        type="file"
                        id="profilePhotoUpload"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <label 
                        htmlFor="profilePhotoUpload"
                        className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-2 rounded-full hover:shadow-lg transition cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Profile Photo</h3>
                      <p className="text-sm text-slate-600 mb-3">Upload a new profile picture (Max 2MB)</p>
                      <div className="flex space-x-2">
                        <label
                          htmlFor="profilePhotoUpload"
                          className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition cursor-pointer"
                        >
                          Upload New
                        </label>
                        {profilePhotoPreview && (
                          <button 
                            onClick={removePhoto}
                            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition flex items-center space-x-1"
                          >
                            <X className="w-4 h-4" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                            placeholder="Enter your full name"
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
                            value={user?.email || ''}
                            disabled
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          User Type
                        </label>
                        <div className="relative">
                          <Car className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={user?.type ? user.type.charAt(0).toUpperCase() + user.type.slice(1) : ''}
                            disabled
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Commute Locations</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Home Address *
                        </label>
                        <div className="relative">
                          <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={formData.homeAddress}
                            onChange={(e) => setFormData({...formData, homeAddress: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                            placeholder="Enter your home address"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Work Address *
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={formData.workAddress}
                            onChange={(e) => setFormData({...formData, workAddress: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                            placeholder="Enter your work address"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Info */}
                  <div className="pt-6 border-t border-slate-200">
                    <h3 className="font-semibold text-slate-900 mb-4">Commute Schedule</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          To Office Time *
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="time"
                            value={formData.toOfficeTime}
                            onChange={(e) => setFormData({...formData, toOfficeTime: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          From Office Time *
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="time"
                            value={formData.fromOfficeTime}
                            onChange={(e) => setFormData({...formData, fromOfficeTime: e.target.value})}
                            className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Working Days *
                      </label>
                      <div className="grid grid-cols-7 gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                          const shortDay = day.substring(0, 3);
                          const isSelected = formData.workingDays.includes(day);
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => handleWorkingDayToggle(day)}
                              className={`py-2 px-1 rounded-lg text-sm font-medium transition ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-blue-600'
                              }`}
                            >
                              {shortDay}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6 border-t border-slate-200">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className={`bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center space-x-2 ${
                        saving ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Save className="w-5 h-5" />
                      <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
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
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-2">Vehicle Information</h2>
                      <p className="text-slate-600">Manage your vehicle details for driver mode</p>
                    </div>
                    <button
                      onClick={() => setShowAddVehicle(true)}
                      className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Vehicle</span>
                    </button>
                  </div>

                  {/* Vehicle Cards */}
                  <div className="space-y-4">
                    {vehicles.map((vehicle) => (
                      <div key={vehicle.id} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition">
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start space-x-4">
                              {/* Vehicle Image */}
                              {vehicle.images && vehicle.images.length > 0 ? (
                                <img 
                                  src={vehicle.images[0]} 
                                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                                  className="w-24 h-24 rounded-xl object-cover border-2 border-slate-100"
                                />
                              ) : (
                                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-xl flex items-center justify-center">
                                  <Car className="w-12 h-12 text-blue-600" />
                                </div>
                              )}

                              {/* Vehicle Info */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-4">
                                  <div>
                                    <h3 className="text-xl font-bold text-slate-900">
                                      {vehicle.year} {vehicle.make} {vehicle.model}
                                    </h3>
                                    <p className="text-slate-600 text-sm mt-1">
                                      License Plate: <span className="font-semibold">{vehicle.plate}</span>
                                    </p>
                                  </div>
                                  {vehicle.verified && (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                                      <CheckCircle className="w-3 h-3" />
                                      <span>Verified</span>
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                                  <div>
                                    <div className="text-xs text-slate-600 mb-1">Color</div>
                                    <div className="font-semibold text-slate-900">{vehicle.color}</div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-slate-600 mb-1">Seats</div>
                                    <div className="font-semibold text-slate-900">{vehicle.seats} Passengers</div>
                                  </div>
                                  {vehicle.insurance && (
                                    <div>
                                      <div className="text-xs text-slate-600 mb-1">Insurance</div>
                                      <div className={`font-semibold ${vehicle.insurance.valid ? 'text-green-600' : 'text-red-600'}`}>
                                        {vehicle.insurance.valid ? 'Valid' : 'Expired'}
                                      </div>
                                    </div>
                                  )}
                                  {vehicle.registration && (
                                    <div>
                                      <div className="text-xs text-slate-600 mb-1">Registration</div>
                                      <div className={`font-semibold ${vehicle.registration.valid ? 'text-green-600' : 'text-red-600'}`}>
                                        {vehicle.registration.valid ? 'Valid' : 'Expired'}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Document Expiry Info */}
                          {vehicle.insurance && vehicle.registration && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">Insurance Expiry:</span>
                                  <span className="font-semibold text-slate-900">{vehicle.insurance.expiryDate}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-600">Registration Expiry:</span>
                                  <span className="font-semibold text-slate-900">{vehicle.registration.expiryDate}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-3">
                            <button className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center space-x-2">
                              <Edit className="w-4 h-4" />
                              <span>Edit Details</span>
                            </button>
                            <button className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-semibold hover:bg-slate-200 transition flex items-center justify-center space-x-2">
                              <Upload className="w-4 h-4" />
                              <span>Upload Documents</span>
                            </button>
                            <button
                              onClick={() => handleDeleteVehicle(vehicle.id)}
                              className="bg-red-100 text-red-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-red-200 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Vehicle Modal/Form */}
                  {showAddVehicle && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                          <h3 className="text-xl font-bold text-slate-900">Add New Vehicle</h3>
                          <button
                            onClick={() => setShowAddVehicle(false)}
                            className="p-2 hover:bg-slate-100 rounded-lg transition"
                          >
                            <X className="w-5 h-5 text-slate-600" />
                          </button>
                        </div>

                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Make *</label>
                              <input
                                type="text"
                                value={newVehicle.make}
                                onChange={(e) => setNewVehicle({...newVehicle, make: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                                placeholder="e.g., Toyota, Honda"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Model *</label>
                              <input
                                type="text"
                                value={newVehicle.model}
                                onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                                placeholder="e.g., Camry, Civic"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Year *</label>
                              <input
                                type="number"
                                value={newVehicle.year}
                                onChange={(e) => setNewVehicle({...newVehicle, year: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                                placeholder="2022"
                                min="1990"
                                max="2025"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
                              <select
                                value={newVehicle.color}
                                onChange={(e) => setNewVehicle({...newVehicle, color: e.target.value})}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                              >
                                <option value="">Select color</option>
                                <option value="White">White</option>
                                <option value="Black">Black</option>
                                <option value="Silver">Silver</option>
                                <option value="Grey">Grey</option>
                                <option value="Red">Red</option>
                                <option value="Blue">Blue</option>
                                <option value="Other">Other</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">License Plate *</label>
                              <input
                                type="text"
                                value={newVehicle.plate}
                                onChange={(e) => setNewVehicle({...newVehicle, plate: e.target.value.toUpperCase()})}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                                placeholder="MH 01 AB 1234"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Number of Seats</label>
                              <select
                                value={newVehicle.seats}
                                onChange={(e) => setNewVehicle({...newVehicle, seats: parseInt(e.target.value)})}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                              >
                                <option value="2">2 Passengers</option>
                                <option value="3">3 Passengers</option>
                                <option value="4">4 Passengers</option>
                                <option value="5">5 Passengers</option>
                                <option value="6">6 Passengers</option>
                                <option value="7">7 Passengers</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Vehicle Photos</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-600 hover:bg-blue-50 transition cursor-pointer">
                              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                              <p className="text-slate-600 text-sm">Click to upload vehicle photos</p>
                              <p className="text-slate-500 text-xs mt-1">PNG, JPG up to 5MB</p>
                            </div>
                          </div>

                          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                              <div className="text-sm text-slate-700">
                                <strong className="font-semibold">Verification Required:</strong>
                                <p className="mt-1">After adding your vehicle, you'll need to upload insurance and registration documents for verification before you can start offering rides.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6 flex gap-3">
                          <button
                            onClick={() => setShowAddVehicle(false)}
                            className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddVehicle}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition"
                          >
                            Add Vehicle
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Info Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="text-sm">
                          <strong className="font-semibold text-slate-900">Verification Benefits</strong>
                          <p className="text-slate-600 mt-1">Verified vehicles get higher visibility in search results and build passenger trust.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="text-sm">
                          <strong className="font-semibold text-slate-900">Safety First</strong>
                          <p className="text-slate-600 mt-1">Keep your insurance and registration up to date for a safe riding experience.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty State */}
                  {vehicles.length === 0 && (
                    <div className="text-center py-12">
                      <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">No Vehicles Added</h3>
                      <p className="text-slate-600 mb-4">Add your vehicle details to start offering rides as a driver</p>
                      <button
                        onClick={() => setShowAddVehicle(true)}
                        className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-flex items-center space-x-2"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add Your First Vehicle</span>
                      </button>
                    </div>
                  )}
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
