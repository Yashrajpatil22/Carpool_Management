import { Link } from 'react-router-dom';
import { Car, Mail, Lock, User, Phone, MapPin, ArrowRight, Chrome } from 'lucide-react';
import { useState } from 'react';

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup:', formData);
    // Redirect to dashboard
    window.location.href = '/dashboard';
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
                {step === 1 ? 'Choose your role' : 'Create your account'}
              </h1>
              <p className="text-slate-600">
                {step === 1 
                  ? 'Select how you plan to use SmartCarpool' 
                  : 'Fill in your details to get started'}
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

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                        placeholder="John Doe"
                        required
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
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                        placeholder="you@example.com"
                        required
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
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                        placeholder="+1 (555) 000-0000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                        placeholder="Create a strong password"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
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
                      <span>Create Account</span>
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
