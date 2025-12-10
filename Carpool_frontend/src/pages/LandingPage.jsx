import { Link } from 'react-router-dom';
import { Car, Users, MapPin, TrendingUp, Shield, Clock, BarChart3, Leaf, Building2, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-2 rounded-xl">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                SmartCarpool
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition">How It Works</a>
              <a href="#pricing" className="text-slate-600 hover:text-blue-600 transition">Pricing</a>
              <Link to="/login" className="text-slate-600 hover:text-blue-600 transition">Login</Link>
              <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg transition">
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-3">
              <a href="#features" className="block text-slate-600 hover:text-blue-600 transition">Features</a>
              <a href="#how-it-works" className="block text-slate-600 hover:text-blue-600 transition">How It Works</a>
              <a href="#pricing" className="block text-slate-600 hover:text-blue-600 transition">Pricing</a>
              <Link to="/login" className="block text-slate-600 hover:text-blue-600 transition">Login</Link>
              <Link to="/signup" className="block bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2.5 rounded-xl text-center">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>AI-Powered Smart Transport</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Smart Transport & <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Carpool Automation</span> System
              </h1>
              
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Optimize commutes with AI-powered ride matching, live tracking, and institutional transport automation. Perfect for corporates, universities, and large organizations.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition flex items-center justify-center space-x-2">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="bg-white text-slate-700 px-8 py-4 rounded-xl font-semibold border-2 border-slate-200 hover:border-blue-600 hover:text-blue-600 transition">
                  Schedule Demo
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12">
                <div>
                  <div className="text-3xl font-bold text-slate-900">50K+</div>
                  <div className="text-slate-600 text-sm">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">2M+</div>
                  <div className="text-slate-600 text-sm">Rides Completed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">45%</div>
                  <div className="text-slate-600 text-sm">Cost Savings</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-teal-100 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-teal-600/10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop" 
                  alt="Smart Carpool" 
                  className="rounded-2xl shadow-2xl relative z-10"
                />
                
                {/* Floating Cards */}
                <div className="absolute top-8 right-8 bg-white p-4 rounded-xl shadow-xl z-20">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Ride Matched!</div>
                      <div className="text-xs text-slate-600">3 mins away</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 bg-white p-4 rounded-xl shadow-xl z-20">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Leaf className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Carbon Saved</div>
                      <div className="text-xs text-slate-600">125 kg this month</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600">Get started in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">1. Match</h3>
              <p className="text-slate-600">AI matches you with compatible riders based on your route, schedule, and preferences.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">2. Ride</h3>
              <p className="text-slate-600">Connect with your carpool group and enjoy a comfortable, cost-effective commute.</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-600 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">3. Track</h3>
              <p className="text-slate-600">Real-time tracking, ETA updates, and seamless communication with your ride group.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Smart Features</h2>
            <p className="text-xl text-slate-600">Everything you need for intelligent transportation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: 'AI Route Optimization', desc: 'Smart algorithms find the most efficient routes for all passengers' },
              { icon: Clock, title: 'Real-Time Tracking', desc: 'Live location updates and accurate ETAs for peace of mind' },
              { icon: Shield, title: 'Verified Profiles', desc: 'All users are verified for a safe and secure carpooling experience' },
              { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Track savings, carbon footprint, and travel patterns' },
              { icon: Leaf, title: 'Eco-Friendly', desc: 'Monitor your environmental impact and carbon savings' },
              { icon: Building2, title: 'Enterprise Ready', desc: 'Built for universities, corporates, and large institutions' },
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-xl transition group">
                <div className="bg-gradient-to-br from-blue-100 to-teal-100 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Organizations */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Built for Organizations</h2>
              <p className="text-slate-300 text-lg mb-8">
                Empower your institution with enterprise-grade transport management. Perfect for universities, corporates, and large organizations.
              </p>
              
              <div className="space-y-4">
                {[
                  'Fleet management & bus tracking',
                  'Employee/student ride matching',
                  'Custom route optimization',
                  'Analytics & reporting dashboard',
                  'Integration with existing systems',
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-teal-400" />
                    <span className="text-slate-200">{item}</span>
                  </div>
                ))}
              </div>

              <button className="mt-8 bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition">
                Request Enterprise Demo
              </button>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop" 
                alt="Enterprise" 
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple Pricing</h2>
            <p className="text-xl text-slate-600">Choose the plan that fits your organization</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                name: 'Starter', 
                price: 'Free', 
                desc: 'For individual users',
                features: ['Up to 10 rides/month', 'Basic matching', 'Mobile app access', 'Community support']
              },
              { 
                name: 'Professional', 
                price: '$99', 
                period: '/month',
                desc: 'For small organizations',
                features: ['Up to 500 users', 'Advanced analytics', 'Priority support', 'Custom branding', 'API access'],
                popular: true
              },
              { 
                name: 'Enterprise', 
                price: 'Custom', 
                desc: 'For large institutions',
                features: ['Unlimited users', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'On-premise option']
              },
            ].map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl p-8 border-2 ${plan.popular ? 'border-blue-600 shadow-2xl scale-105' : 'border-slate-200'} relative`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <p className="text-slate-600 mb-6">{plan.desc}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                  {plan.period && <span className="text-slate-600">{plan.period}</span>}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                      <span className="text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3 rounded-xl font-semibold transition ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:shadow-lg' 
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}>
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-blue-600 to-teal-600 p-2 rounded-xl">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">SmartCarpool</span>
              </div>
              <p className="text-slate-400">Intelligent transport automation for the modern world.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Features</a></li>
                <li><a href="#" className="hover:text-white transition">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
                <li><a href="#" className="hover:text-white transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
                <li><a href="#" className="hover:text-white transition">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2025 SmartCarpool. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
