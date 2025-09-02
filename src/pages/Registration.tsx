import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight, CheckCircle, Building, MapPin, Phone, CreditCard, Star, Check, X, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { organizationAPI } from '../api/organizations';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../contexts/AuthContext';

export const Registration: React.FC = () => {
    const [registrationStep, setRegistrationStep] = useState(1);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currentView, setCurrentView] = useState('registration');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        organization_name: '',
        organization_code: '',
        organization_type: '',
        address: '',
        city: '',
        country: '',
        contact_email: '',
        contact_phone: '',
        subscription_plan: '',
        user_role: 'admin' as UserRole,
        user_name: '',
        user_email: '',
        user_password: ''
    });

    //add UUID for organization_code
    useEffect(() => {
        setFormData(prev => ({ ...prev, organization_code: uuidv4() }));
    }, []);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const validateStep = (step: number): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (step === 1) {
            if (!formData.organization_name.trim()) newErrors.organization_name = 'Organization name is required';
            if (!formData.organization_code.trim()) newErrors.organization_code = 'Organization code is required';
            if (!formData.organization_type) newErrors.organization_type = 'Organization type is required';
        } else if (step === 2) {
            if (!formData.address.trim()) newErrors.address = 'Street address is required';
            if (!formData.city.trim()) newErrors.city = 'City is required';
            if (!formData.country) newErrors.country = 'Country is required';
        } else if (step === 3) {
            if (!formData.contact_email.trim()) {
                newErrors.contact_email = 'Contact email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
                newErrors.contact_email = 'Please enter a valid email address';
            }
            if (!formData.contact_phone.trim()) newErrors.contact_phone = 'Contact phone is required';
        } else if (step === 4) {
            if (!selectedPlan) newErrors.selectedPlan = 'Subscription plan must be selected';
        } else if (step === 5) {
            if (!formData.user_name.trim()) newErrors.user_name = 'Full name is required';
            if (!formData.user_email.trim()) {
                newErrors.user_email = 'Email is required';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.user_email)) {
                newErrors.user_email = 'Please enter a valid email address';
            }
            if (!formData.user_password) {
                newErrors.user_password = 'Password is required';
            } else if (formData.user_password.length < 6) {
                newErrors.user_password = 'Password must be at least 6 characters';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const organizationTypes = [
        'Hospital',
        'Clinic',
        'Medical Center',
        'Nursing Home',
        'Rehabilitation Center',
        'Mental Health Facility',
        'Diagnostic Center',
        'Pharmacy',
        'Home Healthcare',
        'Telemedicine Provider'
    ];

    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 
        'France', 'Japan', 'Singapore', 'Netherlands', 'Sweden', 'Switzerland'
    ];

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

    const handleInputChange = (field:any, value:any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handlePlanSelect = (planId:any) => {
        setSelectedPlan(planId);
        setFormData(prev => ({ ...prev, subscription_plan: planId }));
        setCurrentView('registration');
    };

    const nextStep = () => {
        if (validateStep(registrationStep)) {
            if (registrationStep < 5) {
                setRegistrationStep(registrationStep + 1);
            }
        }
    };

    const prevStep = () => {
        if (registrationStep > 1) {
            setRegistrationStep(registrationStep - 1);
            // Clear errors when going back
            setErrors({});
        }
    };

    const handleRegistration = async () => {
        if (!validateStep(registrationStep)) return;

        try {

            console.log('Form Data:', formData);
            // First create the organization
            const orgResponse = await organizationAPI.create({
                organizationName: formData.organization_name,
                organizationCode: formData.organization_code,
                organizationType: formData.organization_type,
                address: formData.address,
                city: formData.city,
                country: formData.country,
                contactEmail: formData.contact_email,
                contactPhone: formData.contact_phone,
                subscriptionPlan: formData.subscription_plan
            });

            console.log('Organization created:', orgResponse);

            // Then create the user account
            const userSuccess = await signup(
                formData.user_email,
                formData.user_password,
                formData.user_name,
                formData.user_role
            );

            if (userSuccess) {
                console.log('Registration successful:', orgResponse);
                alert('Registration successful! Welcome to Time Tuner.');
                navigate('/dashboard');
            } else {
                alert('User account creation failed. Please try again.');
            }

        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again.');
        }
    }

    const renderPlanSelection = () => {
        return (
            <div className="space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
                    <p className="text-xl text-slate-300">Select the perfect plan for your healthcare organization</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {subscriptionPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border transition-all duration-300 hover:transform hover:scale-105 cursor-pointer ${
                                selectedPlan === plan.id 
                                    ? 'border-blue-500 ring-2 ring-blue-500/50' 
                                    : 'border-white/20 hover:border-white/40'
                            }`}
                            onClick={() => handlePlanSelect(plan.id)}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                                        <Star className="w-4 h-4 mr-1" />
                                        Most Popular
                                    </div>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                                <div className="mb-4">
                                    <span className="text-3xl font-bold text-white">{plan.price}</span>
                                    <span className="text-slate-400">{plan.period}</span>
                                </div>
                                <p className="text-slate-300 text-sm">{plan.description}</p>
                            </div>

                            <div className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <div key={index} className="flex items-start">
                                        <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                                    selectedPlan === plan.id
                                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                }`}
                            >
                                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button
                        onClick={() => setCurrentView('registration')}
                        className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all duration-300 flex items-center mx-auto"
                        disabled={!selectedPlan}
                    >
                        Continue with {selectedPlan ? subscriptionPlans.find(p => p.id === selectedPlan)?.name : ''} Plan
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </button>
                </div>
            </div>
        );
    };

    const renderRegistrationStep = () => {
        switch (registrationStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-white mb-6">Organization Details</h3>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Organization Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.organization_name}
                                    onChange={(e) => handleInputChange('organization_name', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                        errors.organization_name ? 'border-red-500' : 'border-white/20'
                                    }`}
                                    placeholder="Enter organization name"
                                />
                                {errors.organization_name && <p className="text-red-400 text-sm mt-1">{errors.organization_name}</p>}
                            </div>

                            {/* <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Organization Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.organization_code}
                                    onChange={(e) => handleInputChange('organization_code', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                        errors.organization_code ? 'border-red-500' : 'border-white/20'
                                    }`}
                                    placeholder="e.g., MGH001, SFGH002"
                                />
                                {errors.organization_code && <p className="text-red-400 text-sm mt-1">{errors.organization_code}</p>}
                            </div> */}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Organization Type *
                            </label>
                            <select
                                value={formData.organization_type}
                                onChange={(e) => handleInputChange('organization_type', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                    errors.organization_type ? 'border-red-500' : 'border-white/20'
                                }`}
                            >
                                <option value="" className="bg-slate-800">Select organization type</option>
                                {organizationTypes.map(type => (
                                    <option key={type} value={type} className="bg-slate-800">{type}</option>
                                ))}
                            </select>
                            {errors.organization_type && <p className="text-red-400 text-sm mt-1">{errors.organization_type}</p>}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-end pt-6">
                            <button
                                onClick={nextStep}
                                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all duration-300 flex items-center"
                            >
                                Next
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-white mb-6">Location Information</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                    errors.address ? 'border-red-500' : 'border-white/20'
                                }`}
                                placeholder="Enter complete address"
                            />
                            {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                        errors.city ? 'border-red-500' : 'border-white/20'
                                    }`}
                                    placeholder="Enter city"
                                />
                                {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Country *
                                </label>
                                <select
                                    value={formData.country}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                        errors.country ? 'border-red-500' : 'border-white/20'
                                    }`}
                                >
                                    <option value="" className="bg-slate-800">Select country</option>
                                    {countries.map(country => (
                                        <option key={country} value={country} className="bg-slate-800">{country}</option>
                                    ))}
                                </select>
                                {errors.country && <p className="text-red-400 text-sm mt-1">{errors.country}</p>}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={nextStep}
                                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all duration-300 flex items-center"
                            >
                                Next
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-white mb-6">Contact Information</h3>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Contact Email *
                            </label>
                            <input
                                type="email"
                                value={formData.contact_email}
                                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                    errors.contact_email ? 'border-red-500' : 'border-white/20'
                                }`}
                                placeholder="admin@organization.com"
                            />
                            {errors.contact_email && <p className="text-red-400 text-sm mt-1">{errors.contact_email}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Contact Phone *
                            </label>
                            <input
                                type="tel"
                                value={formData.contact_phone}
                                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                                    errors.contact_phone ? 'border-red-500' : 'border-white/20'
                                }`}
                                placeholder="+1 (555) 123-4567"
                            />
                            {errors.contact_phone && <p className="text-red-400 text-sm mt-1">{errors.contact_phone}</p>}
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={nextStep}
                                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all duration-300 flex items-center"
                            >
                                Next
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                );

            case 4:
                const selectedPlanDetails = subscriptionPlans.find(plan => plan.id === selectedPlan);
                return (
                    <div className="space-y-6">
                        <h3 className="text-2xl font-semibold text-white mb-6">Subscription Plan</h3>
                        
                        {selectedPlanDetails ? (
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-xl font-semibold text-white">{selectedPlanDetails.name} Plan</h4>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-white">{selectedPlanDetails.price}<span className="text-sm text-slate-400">{selectedPlanDetails.period}</span></div>
                                        <div className="text-sm text-green-400">30-day free trial</div>
                                    </div>
                                </div>
                                <p className="text-slate-300 mb-4">{selectedPlanDetails.description}</p>
                                <button
                                    onClick={() => setCurrentView('plans')}
                                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                                >
                                    Change Plan
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-300 mb-4">Please select a subscription plan to continue</p>
                                <button
                                    onClick={() => setCurrentView('plans')}
                                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-teal-600 transition-all duration-300"
                                >
                                    View Plans
                                </button>
                                {errors.selectedPlan && <p className="text-red-400 text-sm mt-2">{errors.selectedPlan}</p>}
                            </div>
                        )}

                        {selectedPlanDetails && (
                            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                                <h4 className="text-lg font-semibold text-white mb-4">Organization Summary</h4>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Organization:</span>
                                        <span className="text-white">{formData.organization_name || 'Not provided'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Type:</span>
                                        <span className="text-white">{formData.organization_type || 'Not provided'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Location:</span>
                                        <span className="text-white">{formData.city && formData.country ? `${formData.city}, ${formData.country}` : 'Not provided'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Email:</span>
                                        <span className="text-white">{formData.contact_email || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6">
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={nextStep}
                                disabled={!selectedPlan}
                                className={`px-8 py-3 rounded-xl transition-all duration-300 flex items-center ${
                                    selectedPlan
                                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:from-blue-600 hover:to-teal-600'
                                        : 'bg-white/10 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                Next
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-white mb-4">Create Your Account</h2>
                            <p className="text-xl text-slate-300">Set up your user account to get started</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={formData.user_name}
                                        onChange={(e) => handleInputChange('user_name', e.target.value)}
                                        className={`w-full px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.user_name ? 'border-red-500' : 'border-white/30'
                                        }`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.user_name && <p className="text-red-400 text-sm mt-1">{errors.user_name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        value={formData.user_email}
                                        onChange={(e) => handleInputChange('user_email', e.target.value)}
                                        className={`w-full px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.user_email ? 'border-red-500' : 'border-white/30'
                                        }`}
                                        placeholder="Enter your email"
                                    />
                                    {errors.user_email && <p className="text-red-400 text-sm mt-1">{errors.user_email}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Password *</label>
                                    <input
                                        type="password"
                                        value={formData.user_password}
                                        onChange={(e) => handleInputChange('user_password', e.target.value)}
                                        className={`w-full px-4 py-3 bg-white/20 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                            errors.user_password ? 'border-red-500' : 'border-white/30'
                                        }`}
                                        placeholder="Create a password"
                                    />
                                    {errors.user_password && <p className="text-red-400 text-sm mt-1">{errors.user_password}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-white mb-2">Role</label>
                                    <div className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white">
                                        Administrator
                                    </div>
                                    <p className="text-slate-400 text-sm mt-1">You will be created as the organization administrator</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button
                                onClick={prevStep}
                                className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={handleRegistration}
                                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2"
                            >
                                <span>Complete Registration</span>
                                <CheckCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (currentView === 'plans') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                </div>

                <header className="relative z-10 px-6 py-6">
                    <nav className="max-w-7xl mx-auto flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                                <Heart className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-white">MedRoster Pro</span>
                        </div>
                        
                        <button
                            onClick={() => setCurrentView('registration')}
                            className="flex items-center text-slate-300 hover:text-white transition-colors duration-300"
                        >
                            <X className="w-5 h-5 mr-2" />
                            Back to Registration
                        </button>
                    </nav>
                </header>

                <div className="relative z-10 px-6 py-8">
                    <div className="max-w-7xl mx-auto">
                        {renderPlanSelection()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
            </div>

            <header className="relative z-10 px-6 py-6">
                <nav className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                            <Heart className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">MedRoster Pro</span>
                    </div>
                    
                    <div className="hidden md:flex items-center space-x-8">
                        <button 
                            onClick={() => setCurrentView('plans')}
                            className="text-slate-300 hover:text-white transition-colors duration-300"
                        >
                            Pricing
                        </button>
                        <Link to="/" className="text-slate-300 hover:text-white transition-colors duration-300">
                                Home
                        </Link>                    
                    </div>
                </nav>
            </header>

            <div className="relative z-10 px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-white mb-4">Register Your Organization</h1>
                        <p className="text-xl text-slate-300">
                            Join thousands of healthcare organizations using MedRoster Pro
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-center mb-12">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div key={step} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                                    step <= registrationStep 
                                        ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' 
                                        : 'bg-white/10 text-slate-400'
                                }`}>
                                    {step}
                                </div>
                                {step < 5 && (
                                    <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
                                        step < registrationStep ? 'bg-gradient-to-r from-blue-500 to-teal-500' : 'bg-white/10'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                        {renderRegistrationStep()}

                        {/* Step Descriptions */}
                        <div className="mt-8 text-center">
                            <div className="grid md:grid-cols-5 gap-4 max-w-3xl mx-auto">
                                <div className={`p-4 rounded-xl transition-all duration-300 ${registrationStep === 1 ? 'bg-white/10' : 'bg-white/5'}`}>
                                    <Building className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                                    <h4 className="font-semibold text-white text-sm">Organization</h4>
                                    <p className="text-xs text-slate-400 mt-1">Basic details</p>
                                </div>
                                <div className={`p-4 rounded-xl transition-all duration-300 ${registrationStep === 2 ? 'bg-white/10' : 'bg-white/5'}`}>
                                    <MapPin className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                                    <h4 className="font-semibold text-white text-sm">Location</h4>
                                    <p className="text-xs text-slate-400 mt-1">Address info</p>
                                </div>
                                <div className={`p-4 rounded-xl transition-all duration-300 ${registrationStep === 3 ? 'bg-white/10' : 'bg-white/5'}`}>
                                    <Phone className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                                    <h4 className="font-semibold text-white text-sm">Contact</h4>
                                    <p className="text-xs text-slate-400 mt-1">Communication</p>
                                </div>
                                <div className={`p-4 rounded-xl transition-all duration-300 ${registrationStep === 4 ? 'bg-white/10' : 'bg-white/5'}`}>
                                    <CreditCard className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                                    <h4 className="font-semibold text-white text-sm">Subscription</h4>
                                    <p className="text-xs text-slate-400 mt-1">Plan selection</p>
                                </div>
                                <div className={`p-4 rounded-xl transition-all duration-300 ${registrationStep === 5 ? 'bg-white/10' : 'bg-white/5'}`}>
                                    <User className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                                    <h4 className="font-semibold text-white text-sm">User Account</h4>
                                    <p className="text-xs text-slate-400 mt-1">Account details</p>
                                </div>
                            </div>
                        </div>

                        {/* Help Text */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-400 text-sm">
                                Need help? Contact our support team at{' '}
                                <a href="mailto:support@medroster.com" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    support@medroster.com
                                </a>
                                {' '}or call{' '}
                                <a href="tel:+1-800-MEDROST" className="text-blue-400 hover:text-blue-300 transition-colors">
                                    +1-800-MEDROST
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}