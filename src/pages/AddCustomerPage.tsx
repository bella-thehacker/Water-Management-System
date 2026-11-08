import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { PipMascot } from '../components/PipMascot';
import {
  Check,
  ChevronRight,
  User,
  MapPin,
  GitFork,
  ArrowRight,
  ArrowLeft,
  X,
  Edit2,
  FileCheck2,
} from 'lucide-react';
import { ZONES } from '../data/mockData';
import { CustomerType, ConnectionStatus } from '../types';

export const AddCustomerPage: React.FC = () => {
  const { addCustomer, setActiveNavPage, setSelectedCustomerId } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // 4 is Review
  const [createdCustomer, setCreatedCustomer] = useState<{
    accountNumber: string;
    name: string;
    id: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '',
    phone: '',
    altPhone: '',
    email: '',
    customerType: 'Household' as CustomerType,
    idType: 'National ID' as 'National ID' | 'Passport' | 'Alien ID',
    idNumber: '',

    // Step 2: Address
    zone: ZONES[0],
    village: '',
    plotNumber: '',
    address: '',
    landmark: '',
    locationNotes: '',

    // Step 3: Water Connection
    connectionType: 'Standard Domestic' as 'Standard Domestic' | 'Commercial' | 'Institutional' | 'Agricultural',
    connectionStatus: 'active' as ConnectionStatus,
    tariffCategory: 'Household',
    meterInstalled: true,
    meterSerialNumber: '',
    installationDate: new Date().toISOString().split('T')[0],
    initialReading: 0,
    connectionNotes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Full name is required';
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!formData.phone.startsWith('+254') && !formData.phone.startsWith('07') && !formData.phone.startsWith('01')) {
        newErrors.phone = 'Please enter a valid Kenyan phone (e.g. +254 712 345 678)';
      }
    }

    if (currentStep === 2) {
      if (!formData.zone) newErrors.zone = 'Zone is required';
      if (!formData.village.trim()) newErrors.village = 'Village / neighbourhood is required';
      if (!formData.address.trim()) newErrors.address = 'Street / physical address is required';
    }

    if (currentStep === 3) {
      if (formData.meterInstalled) {
        if (!formData.meterSerialNumber.trim()) {
          newErrors.meterSerialNumber = 'Meter serial number is required when meter is installed';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => (prev + 1) as any);
    }
  };

  const handleBack = () => {
    setStep((prev) => (prev - 1) as any);
  };

  const handleFinalSubmit = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    const newCust = addCustomer({
      name: formData.name,
      phone: formData.phone,
      altPhone: formData.altPhone || undefined,
      email: formData.email || undefined,
      customerType: formData.customerType,
      idType: formData.idType,
      idNumber: formData.idNumber || undefined,
      zone: formData.zone,
      village: formData.village,
      plotNumber: formData.plotNumber || undefined,
      address: formData.address,
      landmark: formData.landmark || undefined,
      locationNotes: formData.locationNotes || undefined,
      connectionType: formData.connectionType,
      connectionStatus: formData.connectionStatus,
      tariffCategory: formData.tariffCategory,
      meterInstalled: formData.meterInstalled,
      meterSerialNumber: formData.meterSerialNumber || undefined,
      installationDate: formData.installationDate,
      initialReading: formData.initialReading,
      connectionNotes: formData.connectionNotes || undefined,
    });

    setCreatedCustomer({
      accountNumber: newCust.accountNumber,
      name: newCust.name,
      id: newCust.id,
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      altPhone: '',
      email: '',
      customerType: 'Household',
      idType: 'National ID',
      idNumber: '',
      zone: ZONES[0],
      village: '',
      plotNumber: '',
      address: '',
      landmark: '',
      locationNotes: '',
      connectionType: 'Standard Domestic',
      connectionStatus: 'active',
      tariffCategory: 'Household',
      meterInstalled: true,
      meterSerialNumber: '',
      installationDate: new Date().toISOString().split('T')[0],
      initialReading: 0,
      connectionNotes: '',
    });
    setErrors({});
    setStep(1);
    setCreatedCustomer(null);
  };

  // Success Screen
  if (createdCustomer) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E7E2D6] shadow-md text-center">
          <PipMascot state="jumping" size={130} className="mb-4" />

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#164E63] tracking-tight">
            Customer registered successfully!
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            A new water connection has been registered into the Kikuyu Community Water scheme database.
          </p>

          {/* Account Card Banner */}
          <div className="my-8 p-6 bg-[#FAF8F1] rounded-2xl border border-[#E7E2D6] max-w-sm mx-auto text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
              Assigned Account Number
            </span>
            <span className="text-3xl font-black font-mono text-[#399D9D] block mt-1 tracking-tight">
              {createdCustomer.accountNumber}
            </span>
            <span className="text-sm font-bold text-slate-800 block mt-2">
              {createdCustomer.name}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                setSelectedCustomerId(createdCustomer.id);
                setActiveNavPage('customer_detail');
              }}
              className="w-full sm:w-auto px-6 py-3 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-xl shadow-xs transition-colors min-h-[44px]"
            >
              View Customer Profile
            </button>

            <button
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-[#164E63] bg-white border border-[#CBD5E1] hover:bg-slate-50 rounded-xl transition-colors min-h-[44px]"
            >
              Register Another Customer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <PageHeader
        breadcrumbs={['Water Operations', 'Customers', 'Register Customer']}
        title="Register a New Customer"
        description="Create a customer profile and register their official water service details."
      />

      {/* Progress Indicator with 3 Stages */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-[#E7E2D6] shadow-2xs">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 relative">
          {/* Step 1 */}
          <div
            onClick={() => step > 1 && setStep(1)}
            className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
              step === 1 ? 'bg-[#E6F3F3]' : ''
            } ${step > 1 ? 'cursor-pointer hover:bg-slate-50' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step > 1
                  ? 'bg-emerald-600 text-white'
                  : step === 1
                  ? 'bg-[#399D9D] text-white ring-4 ring-[#399D9D]/20'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Stage 1
              </span>
              <span className={`text-xs font-bold truncate block ${step === 1 ? 'text-[#164E63]' : 'text-slate-700'}`}>
                Personal Details
              </span>
            </div>
          </div>

          {/* Step 2 */}
          <div
            onClick={() => step > 2 && setStep(2)}
            className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
              step === 2 ? 'bg-[#E6F3F3]' : ''
            } ${step > 2 ? 'cursor-pointer hover:bg-slate-50' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step > 2
                  ? 'bg-emerald-600 text-white'
                  : step === 2
                  ? 'bg-[#399D9D] text-white ring-4 ring-[#399D9D]/20'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Stage 2
              </span>
              <span className={`text-xs font-bold truncate block ${step === 2 ? 'text-[#164E63]' : 'text-slate-700'}`}>
                Address & Location
              </span>
            </div>
          </div>

          {/* Step 3 */}
          <div
            onClick={() => step > 3 && setStep(3)}
            className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${
              step === 3 || step === 4 ? 'bg-[#E6F3F3]' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                step === 4
                  ? 'bg-emerald-600 text-white'
                  : step === 3
                  ? 'bg-[#399D9D] text-white ring-4 ring-[#399D9D]/20'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {step === 4 ? <Check className="w-4 h-4" /> : '3'}
            </div>
            <div className="hidden sm:block min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Stage 3
              </span>
              <span className={`text-xs font-bold truncate block ${step >= 3 ? 'text-[#164E63]' : 'text-slate-700'}`}>
                Water Connection
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Content Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E7E2D6] shadow-sm">
        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#164E63]">
                1. Personal Details
              </h3>
              <p className="text-xs text-slate-500">
                Primary customer contact details and household identity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Customer Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mary Wanjiku Njeri"
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px] ${
                    errors.name ? 'border-rose-400' : 'border-[#CBD5E1]'
                  }`}
                />
                {errors.name && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.name}</span>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Primary Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+254 712 345 678"
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px] ${
                    errors.phone ? 'border-rose-400' : 'border-[#CBD5E1]'
                  }`}
                />
                {errors.phone && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.phone}</span>
                )}
              </div>

              {/* Alternative Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Alternative Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.altPhone}
                  onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                  placeholder="+254 722 000 000"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="customer@domain.com"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                />
              </div>

              {/* Customer Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.customerType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      customerType: e.target.value as CustomerType,
                      tariffCategory: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                >
                  <option value="Household">Household (Residential)</option>
                  <option value="Business">Business / Commercial</option>
                  <option value="Institution">Institution (School / Hospital / Church)</option>
                </select>
              </div>

              {/* ID Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Identification Type
                </label>
                <select
                  value={formData.idType}
                  onChange={(e) => setFormData({ ...formData, idType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                >
                  <option value="National ID">Kenyan National ID</option>
                  <option value="Passport">Passport</option>
                  <option value="Alien ID">Alien ID</option>
                </select>
              </div>

              {/* ID Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Identification Number
                </label>
                <input
                  type="text"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="e.g. 24891024"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Address and Location */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#164E63]">
                2. Address & Location
              </h3>
              <p className="text-xs text-slate-500">
                Community zone location, village sector, and nearest landmarks.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Community Zone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Community Scheme Zone <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                >
                  {ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              {/* Village */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Village / Neighbourhood <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="e.g. Thogoto Mission / Sigona View"
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px] ${
                    errors.village ? 'border-rose-400' : 'border-[#CBD5E1]'
                  }`}
                />
                {errors.village && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.village}</span>
                )}
              </div>

              {/* Plot Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Plot Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.plotNumber}
                  onChange={(e) => setFormData({ ...formData, plotNumber: e.target.value })}
                  placeholder="e.g. Plot 42/B"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                />
              </div>

              {/* Physical Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Street / Physical Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g. Near PCEA Church, Thogoto Lane"
                  className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px] ${
                    errors.address ? 'border-rose-400' : 'border-[#CBD5E1]'
                  }`}
                />
                {errors.address && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{errors.address}</span>
                )}
              </div>

              {/* Landmark */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nearby Recognised Landmark
                </label>
                <input
                  type="text"
                  value={formData.landmark}
                  onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  placeholder="e.g. 100m past Alliance Girls main entrance gate"
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                />
              </div>

              {/* Location Notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location & Branch Access Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.locationNotes}
                  onChange={(e) => setFormData({ ...formData, locationNotes: e.target.value })}
                  placeholder="Additional navigation guidance for meter readers and maintenance technicians..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Water Connection */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#164E63]">
                3. Water Connection & Meter Setup
              </h3>
              <p className="text-xs text-slate-500">
                Service pipe specifications, tariff tier, and physical meter installation details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Connection Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Connection Classification <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.connectionType}
                  onChange={(e) => setFormData({ ...formData, connectionType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                >
                  <option value="Standard Domestic">Standard Domestic (1/2 inch)</option>
                  <option value="Commercial">Commercial / Business (3/4 inch)</option>
                  <option value="Institutional">Institutional Bulk (1 - 2 inch)</option>
                  <option value="Agricultural">Agricultural Irrigation</option>
                </select>
              </div>

              {/* Connection Status */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Initial Connection Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.connectionStatus}
                  onChange={(e) => setFormData({ ...formData, connectionStatus: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                >
                  <option value="active">Active (Water flowing immediately)</option>
                  <option value="pending">Pending (Awaiting final line trenching)</option>
                </select>
              </div>

              {/* Meter Installed Toggle */}
              <div className="sm:col-span-2 p-4 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Is a physical meter already installed onsite?
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    If no, connection will remain pending until a technician registers the meter serial number.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meterInstalled: true })}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      formData.meterInstalled
                        ? 'bg-[#399D9D] text-white shadow-2xs'
                        : 'bg-white border text-slate-600'
                    }`}
                  >
                    Yes, Meter Installed
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meterInstalled: false })}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      !formData.meterInstalled
                        ? 'bg-[#164E63] text-white shadow-2xs'
                        : 'bg-white border text-slate-600'
                    }`}
                  >
                    No, Pending
                  </button>
                </div>
              </div>

              {/* Conditional Meter Details */}
              {formData.meterInstalled && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Meter Serial Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.meterSerialNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, meterSerialNumber: e.target.value })
                      }
                      placeholder="e.g. WM-883945"
                      className={`w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 font-mono min-h-[44px] ${
                        errors.meterSerialNumber ? 'border-rose-400' : 'border-[#CBD5E1]'
                      }`}
                    />
                    {errors.meterSerialNumber && (
                      <span className="text-[11px] text-rose-600 mt-1 block">
                        {errors.meterSerialNumber}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Installation / Commissioning Date
                    </label>
                    <input
                      type="date"
                      value={formData.installationDate}
                      onChange={(e) =>
                        setFormData({ ...formData, installationDate: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Initial Meter Reading (m³)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.initialReading}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          initialReading: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 font-mono tabular-nums min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tariff Schedule
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={`${formData.customerType} Standard Scheme`}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-100 border border-slate-300 rounded-[10px] text-slate-600 min-h-[44px]"
                    />
                  </div>
                </>
              )}

              {/* Connection Notes */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Connection Notes & Valve Position
                </label>
                <textarea
                  rows={2}
                  value={formData.connectionNotes}
                  onChange={(e) =>
                    setFormData({ ...formData, connectionNotes: e.target.value })
                  }
                  placeholder="Gate valve located inside steel meter box on outer boundary fence..."
                  className="w-full px-3.5 py-2.5 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Review Summary Screen */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#164E63]">
                  Review & Confirm Customer Registration
                </h3>
                <p className="text-xs text-slate-500">
                  Please verify all entered customer and connection details before submission.
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs font-bold text-[#164E63] bg-[#E6F3F3] rounded-lg">
                Stage 4: Summary
              </span>
            </div>

            {/* Section 1 Review */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#399D9D]" />
                  <span>1. Personal Details</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#399D9D] font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Full Name</span>
                  <span className="font-bold text-slate-900">{formData.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Phone</span>
                  <span className="font-mono text-slate-800">{formData.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Customer Type</span>
                  <span className="text-slate-800 font-medium">{formData.customerType}</span>
                </div>
                {formData.email && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email</span>
                    <span className="text-slate-700">{formData.email}</span>
                  </div>
                )}
                {formData.idNumber && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">{formData.idType}</span>
                    <span className="font-mono text-slate-800">{formData.idNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 2 Review */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#399D9D]" />
                  <span>2. Address & Community Location</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="text-xs text-[#399D9D] font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Zone</span>
                  <span className="font-bold text-slate-900">{formData.zone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Village / Neighbourhood</span>
                  <span className="text-slate-800 font-medium">{formData.village}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Physical Address</span>
                  <span className="text-slate-800">{formData.address}</span>
                </div>
                {formData.landmark && (
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Landmark</span>
                    <span className="text-slate-700">{formData.landmark}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3 Review */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <GitFork className="w-4 h-4 text-[#399D9D]" />
                  <span>3. Water Connection & Meter Setup</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-[#399D9D] font-semibold hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Connection Type</span>
                  <span className="font-bold text-slate-900">{formData.connectionType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Status</span>
                  <span className="capitalize font-semibold text-emerald-700">{formData.connectionStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Meter Installed?</span>
                  <span className="font-bold text-slate-800">
                    {formData.meterInstalled ? 'Yes' : 'No (Pending)'}
                  </span>
                </div>
                {formData.meterInstalled && (
                  <>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Meter Serial</span>
                      <span className="font-mono font-bold text-[#164E63]">
                        {formData.meterSerialNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Initial Reading</span>
                      <span className="font-mono text-slate-800">{formData.initialReading} m³</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Installation Date</span>
                      <span className="font-mono text-slate-800">{formData.installationDate}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Form Footer Navigation Controls */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActiveNavPage('customers')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-[10px] transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-slate-50 transition-colors min-h-[44px]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px] shadow-sm transition-all min-h-[44px]"
              >
                <span>{step === 3 ? 'Review Details' : 'Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px] shadow-md transition-all min-h-[44px]"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Create Customer Account</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
