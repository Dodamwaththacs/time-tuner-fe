import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Shield, Users, Clock, Heart, ArrowRight, CheckCircle, Star, Building, MapPin, Phone, Mail, CreditCard, Globe, Calendar, Check, X } from 'lucide-react';


export const Pricing: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [formData, setFormData] = useState({
    organization_name: '',
    organization_code: '',
    organization_type: '',
    address: '',
    city: '',
    country: '',
    contact_email: '',
    contact_phone: '',
    subscription_plan: ''
  });

    const subscriptionPlans = [
    {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Get started with essential features for small teams',
    features: [
      'Up to 5 healthcare professionals',
      'Basic scheduling',
      'Email support',
      'Community resources',
      '1GB cloud storage'
    ],
    color: 'from-gray-500 to-gray-600',
    popular: false
  },
    {
      id: 'starter',
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small clinics and practices',
      features: [
        'Up to 25 healthcare professionals',
        'Basic scheduling & roster management',
        'Email support',
        'Standard compliance reporting',
        'Mobile app access',
        '10GB cloud storage'
      ],
      color: 'from-blue-500 to-blue-600',
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      price: '$299',
      period: '/month',
      description: 'Ideal for medium-sized healthcare facilities',
      features: [
        'Up to 100 healthcare professionals',
        'Advanced scheduling & analytics',
        'Priority phone & email support',
        'Advanced compliance & audit tools',
        'Custom integrations (3)',
        '100GB cloud storage',
        'Real-time notifications',
        'Multi-location support'
      ],
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$899',
      period: '/month',
      description: 'Comprehensive solution for large healthcare systems',
      features: [
        'Unlimited healthcare professionals',
        'AI-powered scheduling optimization',
        '24/7 dedicated support',
        'Enterprise compliance suite',
        'Unlimited custom integrations',
        '1TB cloud storage',
        'Advanced analytics & reporting',
        'Multi-facility management',
        'Custom training & onboarding',
        'API access & white-labeling'
      ],
      color: 'from-emerald-500 to-emerald-600',
      popular: false
    }
  ];

  const handlePlanSelect = (planId:any) => {
    setSelectedPlan(planId);
    setFormData(prev => ({ ...prev, subscription_plan: planId }));
  };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MedRoster Pro</span>
        </Link>
          
          <div className="flex items-center space-x-4 ml-auto">
            <Link 
              to="/register"
              className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
            >
              Get Started
            </Link>
            <Link 
              to="/"
              className="text-slate-300 hover:text-white transition-colors duration-300"
            >
              Home
            </Link>
            <Link 
              to="/login"
              className="text-slate-300 hover:text-white transition-colors duration-300"
            >
              Login
            </Link>
          </div>
        </nav>
      </header>

      <div className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">Choose Your Plan</h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Select the perfect plan for your healthcare organization. All plans include a 30-day free trial.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {subscriptionPlans.map((plan, index) => (
              <div key={plan.id} className={`relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 ${plan.popular ? 'ring-2 ring-purple-500 scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <p className="text-slate-300">{plan.description}</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-slate-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    handlePlanSelect(plan.id);
                  }}
                  className={`w-full bg-gradient-to-r ${plan.color} text-white font-semibold py-4 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
                >
                  Start Free Trial
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    )
}