import { Link } from 'react-router-dom';
import { Car, Mail, Lock, User, Phone, MapPin, ArrowRight, Chrome, Home, Briefcase, Navigation, Map, Camera, X, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

const Signup = () => {
  const [step, setStep] = useState(1);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapLocationType, setMapLocationType] = useState(''); // 'home' or 'work'
  const [tempMarkerPosition, setTempMarkerPosition] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    profilePhoto: '',
    // Location fields
    homeAddress: '',
    workAddress: '',
    homeCoords: null,
    workCoords: null,
    // Time and schedule fields
    toOfficeTime: '',
    fromOfficeTime: '',
    workingDays: [],
    // Vehicle fields (for drivers)
    vehicleMake: '',
    vehicleModel: '',
    vehicleYear: '',
    vehicleColor: '',
    vehiclePlate: '',
    vehicleSeats: 4
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  const validatePassword = (password) => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
  };

  const validatePlateNumber = (plate) => {
    // Basic validation for Indian plate format
    const plateRegex = /^[A-Z]{2}\s?[0-9]{1,2}\s?[A-Z]{1,2}\s?[0-9]{1,4}$/i;
    return plateRegex.test(plate.replace(/\s/g, ''));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size should be less than 2MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({...formData, profilePhoto: reader.result});
        setProfilePhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData({...formData, profilePhoto: ''});
    setProfilePhotoPreview(null);
  };

  const roles = [
    { 
      id: 'driver', 
      title: 'Driver', 
      desc: 'I want to offer rides and share my commute',
      icon: Car
    },
    { 
      id: 'passenger', 
      title: 'Passenger', 
      desc: 'I want to find rides for my commute',
      icon: User
    },
    { 
      id: 'admin', 
      title: 'Institution Admin', 
      desc: 'I manage transport for an organization',
      icon: MapPin
    }
  ];

  const handleRoleSelect = (roleId) => {
    setFormData({...formData, role: roleId});
    setStep(2);
  };

  const handleNextToStep3 = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Validate name
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate phone
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setStep(3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // Validate addresses
    if (!formData.homeAddress || formData.homeAddress.trim().length < 5) {
      newErrors.homeAddress = 'Please enter a valid home address';
    }
    
    if (!formData.workAddress || formData.workAddress.trim().length < 5) {
      newErrors.workAddress = 'Please enter a valid work address';
    }
    
    // Validate times
    if (!formData.toOfficeTime) {
      newErrors.toOfficeTime = 'To office time is required';
    }
    
    if (!formData.fromOfficeTime) {
      newErrors.fromOfficeTime = 'From office time is required';
    }
    
    // Validate working days
    if (formData.workingDays.length === 0) {
      newErrors.workingDays = 'Please select at least one working day';
    }
    
    // Validate vehicle details for drivers
    if (formData.role === 'driver') {
      if (!formData.vehicleMake || formData.vehicleMake.trim().length < 2) {
        newErrors.vehicleMake = 'Vehicle make is required';
      }
      
      if (!formData.vehicleModel || formData.vehicleModel.trim().length < 2) {
        newErrors.vehicleModel = 'Vehicle model is required';
      }
      
      if (!formData.vehicleYear) {
        newErrors.vehicleYear = 'Vehicle year is required';
      } else {
        const year = parseInt(formData.vehicleYear);
        const currentYear = new Date().getFullYear();
        if (year < 1990 || year > currentYear + 1) {
          newErrors.vehicleYear = `Year must be between 1990 and ${currentYear + 1}`;
        }
      }
      
      if (!formData.vehiclePlate) {
        newErrors.vehiclePlate = 'License plate is required';
      } else if (!validatePlateNumber(formData.vehiclePlate)) {
        newErrors.vehiclePlate = 'Please enter a valid license plate (e.g., MH 01 AB 1234)';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert('Please fix all validation errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});
    
    try {
      // Step 1: Register user
      const userPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        profilePhoto: formData.profilePhoto,
        homeAddress: {
          address: formData.homeAddress,
          lat: formData.homeCoords?.lat || 0,
          lng: formData.homeCoords?.lng || 0,
        },
        workAddress: {
          address: formData.workAddress,
          lat: formData.workCoords?.lat || 0,
          lng: formData.workCoords?.lng || 0,
        },
        toOfficeTime: formData.toOfficeTime,
        fromOfficeTime: formData.fromOfficeTime,
        workingDays: formData.workingDays,
        type: formData.role,
      };

      const registerResponse = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:7777'}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload),
      });

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        throw new Error(registerData.message || 'Registration failed');
      }

      console.log('User registered:', registerData);
      const userId = registerData.userId;

      // Step 2: Register vehicle (only for drivers)
      if (formData.role === 'driver') {
        const vehiclePayload = {
          user_id: userId,
          model: formData.vehicleModel,
          company: formData.vehicleMake,
          plate_number: formData.vehiclePlate,
          color: formData.vehicleColor || 'Not specified',
          number_of_seats: formData.vehicleSeats,
          year_of_manufacture: parseInt(formData.vehicleYear),
        };

        const vehicleResponse = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:7777'}/api/car/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vehiclePayload),
        });

        const vehicleData = await vehicleResponse.json();

        if (!vehicleResponse.ok) {
          console.error('Vehicle registration failed:', vehicleData);
          alert('User registered but vehicle registration failed. You can add vehicle later in settings.');
        } else {
          console.log('Vehicle registered:', vehicleData);
        }
      }

      // Store user data in localStorage
      localStorage.setItem('user', JSON.stringify(registerData.user));
      
      // Success - redirect to login
      alert('Registration successful! Please login.');
      window.location.href = '/login';
      
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const searchLocation = async (query, type) => {
    // Mock geocoding - in production, use Google Maps Geocoding API or similar
    console.log(`Searching for ${type}:`, query);
    // Simulated coordinates for Mumbai
    const mockCoords = {
      lat: 19.0760 + Math.random() * 0.1,
      lng: 72.8777 + Math.random() * 0.1
    };
    
    if (type === 'home') {
      setFormData({...formData, homeAddress: query, homeCoords: mockCoords});
    } else {
      setFormData({...formData, workAddress: query, workCoords: mockCoords});
    }
  };

  const openMapPicker = (type) => {
    setMapLocationType(type);
    // Set initial position based on existing coords or default Mumbai location
    const initialPos = type === 'home' 
      ? (formData.homeCoords || { lat: 19.0760, lng: 72.8777 })
      : (formData.workCoords || { lat: 19.0760, lng: 72.8777 });
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
      
      if (mapLocationType === 'home') {
        setFormData({...formData, homeAddress: address, homeCoords: coords});
      } else {
        setFormData({...formData, workAddress: address, workCoords: coords});
      }
    }
    setShowMapModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 mb-8">
            <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-2 rounded-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              SmartCarpool
            </span>
          </Link>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-200">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {step === 1 ? 'Choose your role' : step === 2 ? 'Create your account' : 'Complete your profile'}
              </h1>
              <p className="text-slate-600">
                {step === 1 
                  ? 'Select how you plan to use SmartCarpool' 
                  : step === 2
                  ? 'Fill in your details to get started'
                  : formData.role === 'driver' 
                  ? 'Add your vehicle and location details'
                  : 'Set your home and work locations'}
              </p>
            </div>

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <div className="space-y-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition text-left group"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-blue-100 to-teal-100 p-3 rounded-xl group-hover:scale-110 transition">
                        <role.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-1">{role.title}</h3>
                        <p className="text-sm text-slate-600">{role.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                  </button>
                ))}

                <div className="mt-6 text-center">
                  <p className="text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Details Form */}
            {step === 2 && (
              <>
                {/* OAuth Button */}
                <button className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center space-x-2 mb-6">
                  <Chrome className="w-5 h-5" />
                  <span>Continue with Google</span>
                </button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500">Or sign up with email</span>
                  </div>
                </div>

                <form onSubmit={handleNextToStep3} className="space-y-4">
                  {/* Profile Photo Upload */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      {profilePhotoPreview ? (
                        <img 
                          src={profilePhotoPreview} 
                          alt="Profile Preview" 
                          className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center">
                          <User className="w-12 h-12 text-blue-600" />
                        </div>
                      )}
                      <input
                        type="file"
                        id="photoUpload"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                      <label
                        htmlFor="photoUpload"
                        className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white p-2 rounded-full cursor-pointer hover:shadow-lg transition"
                      >
                        <Camera className="w-4 h-4" />
                      </label>
                      {profilePhotoPreview && (
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
                          title="Remove photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                          errors.name ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-blue-600'
                        }`}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                          errors.email ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-blue-600'
                        }`}
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition ${
                          errors.phone ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-blue-600'
                        }`}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition ${
                          errors.password ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-blue-600'
                        }`}
                        placeholder="Create a strong password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition ${
                          errors.confirmPassword ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-blue-600'
                        }`}
                        placeholder="Confirm your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-1"
                        required
                      />
                      <span className="text-sm text-slate-600">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>
                        {' '}and{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
                      </span>
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
                    >
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}

            {/* Step 3: Location & Vehicle Details */}
            {step === 3 && (
              <>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Location Section */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span>Your Locations</span>
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      Help us find the best carpool matches for your daily commute
                    </p>

                    <div className="space-y-4">
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
                            onBlur={(e) => searchLocation(e.target.value, 'home')}
                            className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                            placeholder="Enter your home address"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => openMapPicker('home')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-lg transition"
                            title="Pick location on map"
                          >
                            <Map className="w-5 h-5" />
                          </button>
                        </div>
                        {formData.homeCoords && (
                          <p className="text-xs text-green-600 mt-1 flex items-center space-x-1">
                            <span>✓</span>
                            <span>Location verified</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Work/Destination Address *
                        </label>
                        <div className="relative">
                          <Briefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <input
                            type="text"
                            value={formData.workAddress}
                            onChange={(e) => setFormData({...formData, workAddress: e.target.value})}
                            onBlur={(e) => searchLocation(e.target.value, 'work')}
                            className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                            placeholder="Enter your work/destination address"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => openMapPicker('work')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-lg transition"
                            title="Pick location on map"
                          >
                            <Map className="w-5 h-5" />
                          </button>
                        </div>
                        {formData.workCoords && (
                          <p className="text-xs text-green-600 mt-1 flex items-center space-x-1">
                            <span>✓</span>
                            <span>Location verified</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Schedule Section - For All Users */}
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                    <h3 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-teal-600" />
                      <span>Commute Schedule</span>
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      When do you usually travel for work?
                    </p>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            To Office Time *
                          </label>
                          <input
                            type="time"
                            value={formData.toOfficeTime}
                            onChange={(e) => setFormData({...formData, toOfficeTime: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-600 focus:outline-none transition"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            From Office Time *
                          </label>
                          <input
                            type="time"
                            value={formData.fromOfficeTime}
                            onChange={(e) => setFormData({...formData, fromOfficeTime: e.target.value})}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-teal-600 focus:outline-none transition"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Working Days *
                        </label>
                        <div className="grid grid-cols-7 gap-2">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                            const fullDay = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index];
                            const isSelected = formData.workingDays.includes(fullDay);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => {
                                  const updatedDays = isSelected
                                    ? formData.workingDays.filter(d => d !== fullDay)
                                    : [...formData.workingDays, fullDay];
                                  setFormData({...formData, workingDays: updatedDays});
                                }}
                                className={`py-2 px-1 rounded-lg text-sm font-medium transition ${
                                  isSelected
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-white border-2 border-slate-200 text-slate-700 hover:border-teal-600'
                                }`}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                        {formData.workingDays.length === 0 && (
                          <p className="text-xs text-red-500 mt-2">Please select at least one working day</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Vehicle Section - Only for Drivers */}
                  {formData.role === 'driver' && (
                    <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-xl p-4">
                      <h3 className="font-semibold text-slate-900 mb-3 flex items-center space-x-2">
                        <Car className="w-5 h-5 text-blue-600" />
                        <span>Your Vehicle Details</span>
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Add your vehicle information to start offering rides
                      </p>

                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Make *
                            </label>
                            <input
                              type="text"
                              value={formData.vehicleMake}
                              onChange={(e) => setFormData({...formData, vehicleMake: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                              placeholder="Toyota"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Model *
                            </label>
                            <input
                              type="text"
                              value={formData.vehicleModel}
                              onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                              placeholder="Camry"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Year *
                            </label>
                            <input
                              type="number"
                              value={formData.vehicleYear}
                              onChange={(e) => setFormData({...formData, vehicleYear: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                              placeholder="2022"
                              min="1990"
                              max="2025"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Color
                            </label>
                            <select
                              value={formData.vehicleColor}
                              onChange={(e) => setFormData({...formData, vehicleColor: e.target.value})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                            >
                              <option value="">Select</option>
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

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              License Plate *
                            </label>
                            <input
                              type="text"
                              value={formData.vehiclePlate}
                              onChange={(e) => setFormData({...formData, vehiclePlate: e.target.value.toUpperCase()})}
                              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                              placeholder="MH 01 AB 1234"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                              Available Seats *
                            </label>
                            <select
                              value={formData.vehicleSeats}
                              onChange={(e) => setFormData({...formData, vehicleSeats: parseInt(e.target.value)})}
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
                      </div>
                    </div>
                  )}

                  {/* Submit Buttons */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-200 transition"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
                    >
                      <span>Complete Signup</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-slate-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
                      Sign in
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">
                  Select {mapLocationType === 'home' ? 'Home' : 'Work'} Location
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  Click anywhere on the map to set your location
                </p>
              </div>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <ArrowRight className="w-6 h-6 rotate-45" />
              </button>
            </div>

            {/* Map Container */}
            <div className="h-[500px] relative">
              <MapContainer
                center={tempMarkerPosition || [19.0760, 72.8777]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationPicker onLocationSelect={handleMapLocationSelect} />
                {tempMarkerPosition && (
                  <Marker position={tempMarkerPosition} />
                )}
              </MapContainer>

              {/* Floating Info Card */}
              {tempMarkerPosition && (
                <div className="absolute top-4 left-4 right-4 bg-white rounded-xl shadow-lg p-4 z-[1000] border-2 border-blue-200">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">Selected Location</h4>
                      <p className="text-sm text-slate-600">
                        Latitude: {tempMarkerPosition[0].toFixed(6)}<br />
                        Longitude: {tempMarkerPosition[1].toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
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

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-teal-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start your smart commute journey today
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of drivers and passengers who are saving money and reducing their environmental impact.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">45%</div>
              <div className="text-blue-100 text-sm">Average Cost Savings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="text-3xl font-bold text-white mb-2">2M+</div>
              <div className="text-blue-100 text-sm">Rides Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
