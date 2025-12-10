import { Link } from 'react-router-dom';
import { Car, Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import { useState } from 'react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login:', formData);
    // For now, redirect to dashboard
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
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h1>
              <p className="text-slate-600">Sign in to your account to continue</p>
            </div>

            {/* OAuth Buttons */}
            <button className="w-full bg-white border-2 border-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center space-x-2 mb-6">
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">Or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => setFormData({...formData, remember: e.target.checked})}
                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 text-center text-sm text-slate-500">
            <p>Protected by enterprise-grade security</p>
          </div>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-teal-600 p-12 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
        
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold text-white mb-6">
            Join 50,000+ users optimizing their daily commute
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Save money, reduce carbon footprint, and connect with your community through intelligent carpooling.
          </p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src="https://i.pravatar.cc/100?img=1" 
                alt="User" 
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <div>
                <div className="text-white font-semibold">Sarah Johnson</div>
                <div className="text-blue-100 text-sm">Product Manager</div>
              </div>
            </div>
            <p className="text-white/90 italic">
              "SmartCarpool has transformed our company's commute. We've saved over ₹50,00,000 and reduced our carbon footprint by 40%."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
