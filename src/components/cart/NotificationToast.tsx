import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function NotificationToast() {
  const { notification } = useCart();

  return (
    <AnimatePresence>
      {notification?.visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-primary text-white px-5 py-3.5 rounded-[2rem] shadow-2xl shadow-primary/40 border border-white/20 backdrop-blur-md"
        >
          <div className="bg-white/20 p-2 rounded-full shrink-0">
            <CheckCircle2 className="w-5 h-5 text-secondary-container" />
          </div>
          <div className="pr-4 border-r border-white/10 min-w-0">
            <p className="text-sm font-bold leading-tight truncate">{notification.message}</p>
            <p className="text-[10px] font-medium text-surface-container uppercase tracking-widest mt-0.5">Item added to cart</p>
          </div>
          <Link 
            to="/cart"
            className="flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-white transition-all whitespace-nowrap"
          >
            <span>View Cart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
