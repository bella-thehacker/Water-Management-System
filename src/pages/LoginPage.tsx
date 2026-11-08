import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Eye, EyeOff, AlertCircle, ArrowRight, KeyRound, Sparkles, ShieldCheck } from 'lucide-react';
import { PipMascot } from '../components/PipMascot';

export const LoginPage: React.FC = () => {
  const { login, users } = useApp();

  const [email, setEmail] = useState('ivy.mwangi@kikuyuwater.co.ke');
  const [password, setPassword] = useState('kikuyu2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email);
      setLoading(false);
      if (!success) {
        setErrorMessage('Invalid email or password. Please try again.');
      }
    }, 400);
  };

  const handleDemoSelect = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('kikuyu2026');
    setErrorMessage('');
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FAF8F1]">
      {/* Left Column (55% on desktop) - Deep Ocean #164E63 with Water Imagery & Pip */}
      <div className="relative w-full lg:w-[55%] bg-[#164E63] text-white p-8 lg:p-14 flex flex-col justify-between overflow-hidden min-h-[460px] lg:min-h-screen">
        {/* Kikuyu Highland Photo Backdrop with Deep Ocean Gradient Scrim */}
        <div
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-luminosity"
          style={{ backgroundImage: `url('/assets/aistudio/image_6664281a.png')` }}
        />

        {/* Ambient Flowing Water SVG Wave Paths */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <svg
            className="absolute -bottom-20 -left-20 w-[140%] h-[60%] opacity-15"
            viewBox="0 0 1000 400"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 0 200 C 300 280, 450 120, 700 220 C 850 280, 950 150, 1000 180 L 1000 400 L 0 400 Z"
              fill="#38BDF8"
            />
            <path
              d="M 0 250 C 250 180, 500 320, 750 240 C 900 190, 950 280, 1000 260 L 1000 400 L 0 400 Z"
              fill="#399D9D"
              opacity="0.4"
            />
          </svg>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md p-2 flex items-center justify-center border border-white/20 shadow-md">
            <img
              src="/assets/aistudio/image_0d358796.png"
              alt="Kikuyu Water"
              className="w-full h-full object-contain filter brightness-110"
            />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight">Kikuyu Water</h1>
            <p className="text-xs font-medium text-[#38BDF8]">
              Community Water Supply Scheme
            </p>
          </div>
        </div>

        {/* Hero Narrative with Pip Mascot */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          <div className="mb-6 inline-block">
            <PipMascot state="idle" size={96} showRipple={true} />
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-white mb-4">
            Water connects us.{' '}
            <span className="text-[#38BDF8]">Let's manage it better.</span>
          </h2>

          <p className="text-base text-cyan-100/90 leading-relaxed max-w-md">
            A smarter digital platform for operating community water services.
            Connecting households, tracking meters, automating billing, and maintaining vital infrastructure.
          </p>

          <div className="mt-8 flex items-center gap-6 text-xs text-cyan-200/80 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#399D9D]" />
              <span>Reliable Ledger</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>Automated Billing</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>M-Pesa Verified</span>
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="relative z-10 pt-4 border-t border-white/10 text-xs text-cyan-100/70 font-medium">
          Every drop matters. Every community counts.
        </div>
      </div>

      {/* Right Column (45% on desktop) - Pearl Background #FAF8F1 with Sign-In Card */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-[420px] bg-white rounded-2xl p-8 sm:p-10 border border-[#E7E2D6] shadow-sm">
          <div className="mb-6">
            <h3 className="text-2xl font-extrabold text-[#164E63] tracking-tight">
              Welcome back!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to your Kikuyu Water operational workspace or customer portal.
            </p>
          </div>

          {/* Inline Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Email address or username
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@kikuyuwater.co.ke"
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 focus:border-[#399D9D] transition-colors min-h-[46px]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs font-semibold text-[#399D9D] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 pr-10 text-xs text-slate-900 bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 focus:border-[#399D9D] transition-colors min-h-[46px]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#399D9D] focus:ring-[#399D9D] border-slate-300"
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-600 select-none cursor-pointer">
                Remember my login on this device
              </label>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] active:bg-[#246969] disabled:opacity-60 rounded-[10px] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#399D9D]/40 flex items-center justify-center gap-2 min-h-[46px]"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Role Selector */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
              Instant Demo Logins
            </span>
            <div className="space-y-1.5">
              {users.slice(0, 4).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleDemoSelect(u.email)}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between border transition-all ${
                    email === u.email
                      ? 'border-[#399D9D] bg-[#E6F3F3] text-[#164E63] font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <span className="font-semibold">{u.name}</span>
                    <span className="text-[11px] text-slate-500 ml-1.5 capitalize">
                      ({u.role.replace('_', ' ')})
                    </span>
                  </div>
                  <span className="text-[10px] text-[#399D9D] font-mono shrink-0">Use</span>
                </button>
              ))}
            </div>
          </div>

         
        </div>
      </div>

      {/* Forgot Password Demo Flow Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            {!forgotSubmitted ? (
              <>
                <div className="w-10 h-10 rounded-xl bg-[#E6F3F3] text-[#399D9D] flex items-center justify-center mb-3">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  Reset your password
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                  Enter your Kikuyu Water email address and we'll send password reset instructions.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setForgotSubmitted(true);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail || email}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@kikuyuwater.co.ke"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setForgotModalOpen(false)}
                      className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                    >
                      Back to sign in
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-lg"
                    >
                      Send reset instructions
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <PipMascot state="celebrating" size={80} className="mb-3" />
                <h4 className="text-base font-bold text-slate-900 mb-1">
                  Reset instructions sent!
                </h4>
                <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                  (Demonstration Flow): A simulated secure reset link has been dispatched for{' '}
                  <strong className="text-slate-900">{forgotEmail || email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSubmitted(false);
                  }}
                  className="w-full py-2.5 text-xs font-semibold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-lg"
                >
                  Return to sign in
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
