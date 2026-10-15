import ContentImage from '../components/ui/ContentImage';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, MessageCircle, Heart, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { sendProductInquiryViaWhatsapp } from '../lib/whatsapp';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { user } = useAuth();

  return (
    <main className="pt-16 min-h-screen bg-surface-container-lowest">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              <Heart className="w-4 h-4 fill-current" />
              Your Collection
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-primary leading-tight">
              My <span className="text-secondary">Wishlist</span>
            </h1>
          </div>
          <p className="text-on-surface-variant font-medium max-w-sm">
            Keep track of the professional clinical products and essential vitamins you're planning to purchase.
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white rounded-[3rem] p-12 md:p-20 text-center shadow-sm border border-outline-variant">
            <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant mx-auto mb-8">
              <Heart className="w-10 h-10" />
            </div>
            <h3 className="font-display text-3xl font-bold text-primary mb-4">Your wishlist is empty</h3>
            <p className="text-on-surface-variant mb-10 max-w-md mx-auto font-medium">
              Start adding your favorite vitamins and supplements to keep track of them here.
            </p>
            <Link 
              to="/vitamins" 
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:bg-primary-container transition-all shadow-xl shadow-primary/20"
            >
              Browse Vitamins
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-outline-variant group"
                >
                  <div className="aspect-[4/3] relative overflow-hidden bg-surface-container">
                    <ContentImage 
                      src={product.image} 
                      alt={product.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => removeFromWishlist(product.id)}
                        className="bg-white/80 backdrop-blur-md p-3 rounded-2xl text-error hover:bg-error hover:text-white transition-all shadow-lg"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{product.brand}</span>
                        <div className="w-1 h-1 bg-outline-variant rounded-full" />
                        <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{product.category}</span>
                      </div>
                      <h3 className="font-display text-xl font-bold text-primary group-hover:text-secondary transition-colors underline decoration-transparent group-hover:decoration-secondary decoration-2 underline-offset-4">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
                      <span className="text-sm font-semibold text-on-surface-variant">Price on enquiry</span>
                      <button 
                        onClick={() => sendProductInquiryViaWhatsapp(product, user)}
                        className="bg-primary text-white p-4 rounded-2xl hover:bg-primary-container transition-all shadow-lg shadow-primary/10 flex items-center gap-3"
                      >
                        <span className="text-sm font-bold">Enquire</span>
                        <MessageCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
