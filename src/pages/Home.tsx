import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users, Clock, Heart, ArrowRight,  Star} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';


export const Home: React.FC = () => {
  const { user, logout } = useAuth();


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Time Tuner</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-5">
            <Link to="/pricing" className="text-slate-300 hover:text-white transition-colors duration-300">Pricing</Link>
            <Link to="/features" className="text-slate-300 hover:text-white transition-colors duration-300">Features</Link>
            <Link to="/support" className="text-slate-300 hover:text-white transition-colors duration-300">Support</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-slate-300">Welcome, {user.name || user.email}</span>
                <button
                  onClick={logout}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/registration"
                  className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-blue-600 hover:to-teal-600 transition-all duration-300 font-semibold"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 px-6 pt-12 pb-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="transform transition-all duration-1000 translate-y-0 opacity-100">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6 backdrop-blur-sm">
              <Star className="w-4 h-4 mr-2" />
              Trusted by 500+ Healthcare Organizations
            </div>
            
            <h1 className="text-6xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Healthcare
              <span className="block bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Workforce Management
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Streamline your healthcare organization's scheduling, roster management, and compliance with our enterprise-grade platform. 
              Join thousands of healthcare professionals who trust MedRoster Pro.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link 
                to="/registration"
                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold px-8 py-4 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/plans"
                className="bg-white/10 backdrop-blur-xl text-white font-semibold px-8 py-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
              >
                View Pricing
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { number: "500K+", label: "Healthcare Professionals" },
                { number: "99.9%", label: "Uptime Guarantee" },
                { number: "24/7", label: "Support Available" },
                { number: "HIPAA", label: "Compliant" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">
            Everything You Need to Manage Healthcare Teams
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "HIPAA Compliant Security",
                description: "Enterprise-grade security with end-to-end encryption and audit trails"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Smart Team Scheduling",
                description: "AI-powered scheduling that considers skills, availability, and compliance"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Real-time Updates",
                description: "Instant notifications and live roster synchronization across all devices"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 group">
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};