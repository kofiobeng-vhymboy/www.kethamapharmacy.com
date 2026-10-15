import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { checkoutViaWhatsapp } from '../../lib/whatsapp';
import { cn } from '../../lib/utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const [checkedOut, setCheckedOut] = React.useState(false);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Call our WhatsApp helper
    const opened = checkoutViaWhatsapp(
      cart.map(item => ({
        name: item.name,
        brand: item.brand,
        price: item.price,
        quantity: item.quantity
      })),
      totalPrice,
      user
    );

    if (opened) setCheckedOut(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-[150]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping Cart"
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[151] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-outline-variant flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl text-primary">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-primary">Your Cart</h2>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">
                    {totalItems} Items
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                aria-label="Close cart"
                className="p-2 hover:bg-surface-container rounded-full transition-colors text-on-surface-variant"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="bg-surface-container p-6 rounded-full text-on-surface-variant/20">
                    <ShoppingBag className="w-16 h-16" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-primary">Your cart is empty</h3>
                  <p className="text-on-surface-variant max-w-[200px]">
                    Looks like you haven't added any medicines or vitamins yet.
                  </p>
                  <button 
                    onClick={onClose}
                    className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-container transition-all"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-container shrink-0">
                      <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-primary text-sm truncate leading-tight">
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="text-on-surface-variant hover:text-error transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                        {item.brand}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 border border-outline-variant rounded-lg p-0.5 bg-surface-container-low" role="group" aria-label="Quantity">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="w-6 h-6 flex items-center justify-center text-primary hover:bg-white rounded-md transition-all"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-primary" aria-label={`Quantity: ${item.quantity}`}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="w-6 h-6 flex items-center justify-center text-primary hover:bg-white rounded-md transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-primary">
                          {item.price == null ? 'Price on enquiry' : `₵${(item.price * item.quantity).toFixed(2)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-outline-variant space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-on-surface-variant font-bold uppercase tracking-[0.2em] text-[10px]">
                    Subtotal
                  </span>
                  <span className="text-2xl font-black text-primary">
                    {cart.some(item => item.price == null) ? 'Price on enquiry' : `₵${totalPrice.toFixed(2)}`}
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant leading-relaxed">
                  Shipping and taxes calculated at checkout. Free shipping on orders over ₵500 in Accra.
                </p>
                <button 
                  onClick={handleCheckout}
                  className={cn(
                    "w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer",
                    checkedOut 
                      ? "bg-success text-white shadow-success/20" 
                      : "bg-primary text-white hover:bg-primary-container shadow-primary/20"
                  )}
                >
                  {checkedOut ? (
                    <>
                      Review in WhatsApp <Check className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Checkout via WhatsApp
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
