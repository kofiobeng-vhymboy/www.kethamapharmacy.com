import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Heart, 
  LogOut, 
  Edit3, 
  Clock, 
  Activity,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import { useAuth, UserProfile } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { sendProductInquiryViaWhatsapp } from '../lib/whatsapp';
import { cn } from '../lib/utils';

export default function Profile() {
  const navigate = useNavigate();
  const { user, signOut, updateProfile } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();

  const [activeSubTab, setActiveSubTab] = useState<'wishlist' | 'settings'>('wishlist');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Redirect if not signed in
  React.useEffect(() => {
    if (!user) {
      navigate('/signin?redirect=/profile');
    } else {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        dateOfBirth: user.dateOfBirth || '',
        allergyInfo: user.allergyInfo || 'None'
      });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <main className="pt-16 min-h-screen bg-surface-container-lowest flex items-center justify-center p-4">
        <div className="text-center">
          <Clock className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant font-medium">Redirecting to login portal...</p>
        </div>
      </main>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <main className="pt-16 min-h-screen bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Profile Intro Header */}
        <div className="bg-primary rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden shadow-xl mb-12">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/10 rounded-[2rem] flex items-center justify-center text-white backdrop-blur-md text-3xl font-bold uppercase border border-white/20">
                {user.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl md:text-4xl font-extrabold">{user.name}</h1>
                  <span className="text-[10px] font-bold uppercase py-1 px-3.5 rounded-full bg-secondary text-white tracking-widest leading-none">
                    Patient
                  </span>
                </div>
                <p className="text-white/80 font-medium text-sm md:text-base flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {user.email}
                </p>
                {user.phone && (
                  <p className="text-white/75 font-medium text-xs flex items-center gap-2 pt-0.5">
                    <Phone className="w-3.5 h-3.5" /> {user.phone}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                signOut();
                navigate('/');
              }}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-2xl font-bold flex items-center gap-2 transition-all text-sm border border-white/10"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>

        {/* Outer Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Info Card */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white rounded-[2rem] p-6 border border-outline-variant shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5 text-secondary" /> Clinic Summary
                </h3>
                {!isEditing && (
                  <button 
                    onClick={() => {
                      setIsEditing(true);
                      setActiveSubTab('settings');
                    }}
                    className="p-2 hover:bg-surface-container rounded-xl text-primary transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="space-y-4 text-sm font-medium">
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <span className="text-[10px] font-bold text-primary block uppercase tracking-wider mb-0.5">Allergies / Flags</span>
                  <span className="text-on-surface-variant font-semibold">{user.allergyInfo || 'None registered'}</span>
                </div>
                
                <div className="p-3 bg-surface-container-low rounded-xl">
                  <span className="text-[10px] font-bold text-primary block uppercase tracking-wider mb-0.5">Primary Address</span>
                  <span className="text-on-surface-variant font-semibold">{user.address || 'Not specified'}</span>
                </div>

                <div className="p-3 bg-surface-container-low rounded-xl">
                  <span className="text-[10px] font-bold text-primary block uppercase tracking-wider mb-0.5">Date of Birth</span>
                  <span className="text-on-surface-variant font-semibold">{user.dateOfBirth || 'Not specified'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Main Details Dashboard Panel */}
          <div className="lg:col-span-3 space-y-8">
            {/* Horizontal Sub-tabs */}
            <div className="flex border-b border-outline-variant bg-white p-2 rounded-2xl border">
              <button
                onClick={() => setActiveSubTab('wishlist')}
                className={cn(
                  "px-6 py-3 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
                  activeSubTab === 'wishlist' 
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                <Heart className="w-4 h-4" /> Saved Vitamins ({wishlist.length})
              </button>
              <button
                onClick={() => setActiveSubTab('settings')}
                className={cn(
                  "px-6 py-3 text-sm font-bold rounded-xl transition-all flex items-center gap-2",
                  activeSubTab === 'settings' 
                    ? "bg-primary text-white shadow-sm"
                    : "text-on-surface-variant hover:text-primary"
                )}
              >
                <User className="w-4 h-4" /> Edit Profile
              </button>
            </div>

            {/* Sub-tab contents */}
            <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-outline-variant shadow-sm min-h-[350px]">
              <AnimatePresence mode="wait">
                
                {/* Wishlist Tab */}
                {activeSubTab === 'wishlist' && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-display text-2xl font-bold text-primary">Saved Clinician Formulations</h2>
                      <p className="text-xs text-on-surface-variant font-medium">Quick list of vitamins and supplements aligned to your wishlist.</p>
                    </div>

                    {wishlist.length === 0 ? (
                      <div className="text-center py-12 bg-surface-container-lowest rounded-[2rem] border border-dashed border-outline-variant">
                        <Heart className="w-12 h-12 text-on-surface-variant/40 mx-auto mb-4" />
                        <p className="text-on-surface-variant font-bold">Your wishlist is empty</p>
                        <p className="text-xs text-on-surface-variant mt-1 mb-6">Browse and toggle hearts on products to track wellness vitamins here.</p>
                        <button 
                          onClick={() => navigate('/vitamins')} 
                          className="px-6 py-3 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-all inline-flex items-center gap-1.5"
                        >
                          Browse Vitamins
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlist.map((prod) => (
                          <div 
                            key={prod.id} 
                            className="flex gap-4 p-4 border border-outline-variant rounded-2xl bg-surface-container-lowest hover:shadow-md transition-all relative group"
                          >
                            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-outline-variant">
                              <img src={prod.image} alt={prod.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col justify-between min-w-0 pr-8">
                              <div>
                                <h4 className="font-display font-bold text-primary text-sm truncate">{prod.name}</h4>
                                <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">{prod.brand}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-on-surface-variant">Price on enquiry</span>
                                <button 
                                  onClick={() => sendProductInquiryViaWhatsapp(prod, user)}
                                  className="text-xs font-bold text-secondary hover:underline flex items-center gap-1"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" /> Enquire
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => removeFromWishlist(prod.id)}
                              className="absolute top-3 right-3 p-1.5 text-error hover:bg-error/10 rounded-lg transition-colors"
                              aria-label="Remove"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* 3. Settings / Profile Edit Info Tab */}
                {activeSubTab === 'settings' && (
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-display text-2xl font-bold text-primary">Primary Patient Record</h2>
                      <p className="text-xs text-on-surface-variant font-medium">Keep your contact and allergy coordinates accurate for safe dispensing.</p>
                    </div>

                    <form onSubmit={handleSave} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Full Name</label>
                          <input
                            required
                            type="text"
                            value={formData.name || ''}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-primary text-sm outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Email Address (Read-only)</label>
                          <input
                            disabled
                            type="email"
                            value={formData.email || ''}
                            className="w-full bg-surface-container border border-outline-variant rounded-2xl px-5 py-3.5 text-on-surface-variant/70 text-sm outline-none cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Phone Number</label>
                          <input
                            type="tel"
                            value={formData.phone || ''}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-primary text-sm outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Date of Birth</label>
                          <input
                            type="date"
                            value={formData.dateOfBirth || ''}
                            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-primary text-sm outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Allergy / Clinical Flags Warning</label>
                          <input
                            type="text"
                            placeholder="e.g. Penicillin, peanuts, or latex"
                            value={formData.allergyInfo || ''}
                            onChange={e => setFormData({ ...formData, allergyInfo: e.target.value })}
                            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-primary text-sm outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div className="space-y-1.5 md:col-span-2">
                          <label className="text-[10px] font-bold text-primary uppercase tracking-widest ml-1">Home Delivery Address</label>
                          <textarea
                            rows={2}
                            value={formData.address || ''}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                            className="w-full bg-surface-container-low border border-outline-variant rounded-2xl px-5 py-3.5 text-primary text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                          />
                        </div>
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-8 py-3.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-container transition-all"
                        >
                          Save Record Changes
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
