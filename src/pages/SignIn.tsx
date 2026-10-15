import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  HeartPulse,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

export default function SignIn() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, user } = useAuth();
  const redirect = searchParams.get('redirect') || '/profile';

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect right away
  React.useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide your email address.');
      return;
    }
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      const success = await signIn(email, password);
      if (success) {
        navigate(redirect);
      } else {
        setError('Sign in failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      setError('Please fill in all fields.');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = await signUp(name, email, phone);
      if (success) {
        navigate(redirect);
      } else {
        setError('An account with this email already exists.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-16 min-h-screen bg-surface-container-lowest flex items-center justify-center p-4">
      <div className="max-w-md w-full my-12 bg-white rounded-[3rem] shadow-xl border border-outline-variant overflow-hidden">
        {/* Banner */}
        <div className="bg-primary text-white p-8 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <HeartPulse className="w-24 h-24" />
          </div>
          <div className="bg-white/15 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold">Kethama Account</h2>
          <p className="text-white/80 text-xs font-medium tracking-wide uppercase mt-1">Patient Portal & Health Hub</p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-outline-variant bg-surface-container-low p-2 m-4 rounded-2xl">
          <button
            onClick={() => {
              setActiveTab('signin');
              setError(null);
            }}
            className={cn(
              "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
              activeTab === 'signin' 
                ? "bg-white text-primary shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setError(null);
            }}
            className={cn(
              "flex-1 py-3 text-sm font-bold rounded-xl transition-all",
              activeTab === 'signup' 
                ? "bg-white text-primary shadow-sm"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            Create Account
          </button>
        </div>

        {/* Auth Forms */}
        <div className="p-8 pt-4">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-error/10 border border-error/20 rounded-2xl flex items-start gap-3 text-error"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm font-semibold">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === 'signin' ? (
              <motion.form
                key="signin-form"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                onSubmit={handleSignIn}
                className="space-y-5"
              >
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-4">
                  Sign in to manage your profile and view your saved products.
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-5 h-5 text-on-surface-variant" />
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-2xl pl-12 pr-6 py-4 text-primary focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Password / Passcode</label>
                    <button type="button" className="text-[10px] font-bold text-secondary uppercase tracking-wider hover:underline">
                      Forgot?
                    </button>
                  </div>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-on-surface-variant" />
                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-2xl pl-12 pr-6 py-4 text-primary focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                  <input type="checkbox" id="remember" className="rounded border-outline-variant accent-primary w-4 h-4 cursor-pointer" defaultChecked />
                  <label htmlFor="remember" className="text-xs text-on-surface-variant font-medium cursor-pointer select-none">
                    Remember my clinical clinic session safely
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-container transition-all shadow-xl shadow-primary/20 disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? 'Verifying Identity...' : 'Sign In Now'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="signup-form"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                onSubmit={handleSignUp}
                className="space-y-5"
              >
                <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-4">
                  Create an account to manage your profile and keep your saved pharmacy products together.
                </p>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-4 w-5 h-5 text-on-surface-variant" />
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ama Mensah"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-2xl pl-12 pr-6 py-4 text-primary focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-5 h-5 text-on-surface-variant" />
                    <input
                      required
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-2xl pl-12 pr-6 py-4 text-primary focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative flex items-center">
                    <Phone className="absolute left-4 w-5 h-5 text-on-surface-variant" />
                    <input
                      required
                      type="tel"
                      placeholder="e.g. +233 24 123 4567"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-2xl pl-12 pr-6 py-4 text-primary focus:ring-2 focus:ring-primary outline-none transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 py-2">
                  <input type="checkbox" id="consent" required className="rounded border-outline-variant accent-primary w-4 h-4 cursor-pointer mt-0.5" />
                  <label htmlFor="consent" className="text-xs text-on-surface-variant font-medium cursor-pointer select-none">
                    I understand this preview stores my profile details in this browser.
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary-container transition-all shadow-xl shadow-primary/20 disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? 'Registering...' : 'Create My Account'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Info Footer */}
        <div className="bg-surface-container p-6 text-center border-t border-outline-variant">
          <p className="text-[10px] text-on-surface-variant font-semibold uppercase tracking-wider">
            🔒 Fully Compliant Clinical Privacy Framework
          </p>
        </div>
      </div>
    </main>
  );
}
