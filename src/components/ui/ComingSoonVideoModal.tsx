import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Sparkles, Youtube, ShieldAlert } from 'lucide-react';

interface ComingSoonVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoonVideoModal({ isOpen, onClose }: ComingSoonVideoModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl p-8 text-center border border-outline-variant z-10"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 bg-surface-container-high/60 backdrop-blur-md p-2 rounded-full text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Visual Icon */}
          <div className="mx-auto w-20 h-20 bg-secondary/15 rounded-3xl flex items-center justify-center text-secondary mb-6 relative">
            <Play className="w-8 h-8 fill-current translate-x-0.5" />
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm border border-outline-variant">
              <Sparkles className="w-2.5 h-2.5 text-secondary-container" />
              Soon
            </span>
          </div>

          {/* Title and Description */}
          <h2 className="font-display text-2xl md:text-3xl font-black text-primary mb-4 leading-tight">
            Workplace Documentary <br />
            <span className="text-secondary">Coming Soon!</span>
          </h2>
          
          <p className="text-on-surface-variant font-medium leading-relaxed mb-6 max-w-sm mx-auto text-sm md:text-base">
            We are currently filming our professional walkthrough video! In this mini-documentary, you'll see a behind-the-scenes look at our sterile prescription compounding, state-of-the-art diagnostic testing, and neighborhood wellness consultations.
          </p>

          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 flex items-center gap-3 text-left max-w-sm mx-auto mb-6">
            <ShieldAlert className="w-5 h-5 text-secondary shrink-0" />
            <p className="text-xs text-on-surface-variant font-semibold">
              Get notified immediately. Tap the WhatsApp assistant below to be placed on our premium health list.
            </p>
          </div>

          {/* Call to action button */}
          <button
            onClick={onClose}
            className="bg-primary text-white font-bold w-full py-4 rounded-xl hover:bg-primary-container transition-all shadow-md"
          >
            Got it, thanks!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
