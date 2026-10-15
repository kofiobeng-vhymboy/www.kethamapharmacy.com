import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Truck, 
  ArrowLeft, 
  Heart,
  Clock,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { checkoutViaWhatsapp } from '../lib/whatsapp';
import { getFeaturedProducts } from '../lib/mockApi';
import { useAsyncData } from '../hooks/useAsyncData';
import { cn } from '../lib/utils';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart, addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, isInWishlist } = useWishlist();
  const [checkoutStarted, setCheckoutStarted] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const recommendations = useAsyncData(getFeaturedProducts, []);

  const freeShippingThreshold = 500;
  const progressToFreeShipping = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);

  const handleCheckout = () => {
    if (cart.length === 0) return;

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

    if (opened) {
      setCheckoutStarted(true);
      setCheckoutError(null);
    } else {
      setCheckoutError('WhatsApp did not open. Please allow pop-ups and try again.');
    }
  };

  const suggestedProducts = recommendations.data?.slice(0, 3) ?? [];

  return (
    <main className="pt-16 min-h-screen bg-surface-container-lowest pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              <ShoppingBag className="w-4 h-4" />
              Your Order Basket
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-primary leading-tight">
              Shopping <span className="text-secondary">Cart</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              to="/vitamins"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            {cart.length > 0 && (
              <button 
                onClick={clearCart}
                className="text-xs font-bold text-on-surface-variant hover:text-error transition-colors px-3 py-1.5 rounded-lg border border-outline-variant hover:border-error/30"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <div className="space-y-12">
            <div className="bg-white rounded-[3rem] p-12 md:p-16 text-center shadow-sm border border-outline-variant">
              <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-primary/40" />
              </div>
              <h2 className="font-display text-3xl font-bold text-primary mb-3">Your cart is empty</h2>
              <p className="text-on-surface-variant mb-8 max-w-md mx-auto font-medium">
                Looks like you haven't added any medicines or vitamins yet. Explore our pharmacist-vetted supplements and clinical essentials.
              </p>
              <Link 
                to="/vitamins" 
                className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-container transition-all shadow-xl shadow-primary/20"
              >
                Browse Vitamins & Supplements
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Recommended Products */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-bold text-primary flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  Recommended for You
                </h3>
                <Link to="/vitamins" className="text-sm font-bold text-secondary hover:underline">
                  View all products
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendations.isLoading && Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-80 animate-pulse rounded-3xl bg-surface-container" />)}
                {suggestedProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="bg-white rounded-3xl p-6 border border-outline-variant hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container mb-4">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover hover:scale-105 transition-transform" 
                        />
                      </div>
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{product.brand}</span>
                      <h4 className="font-display font-bold text-primary text-lg mt-1 mb-2 truncate">{product.name}</h4>
                      <span className="text-sm font-semibold text-on-surface-variant">Price and availability on enquiry</span>
                    </div>
                    <div className="mt-6 pt-4 border-t border-outline-variant flex items-center gap-2">
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex-grow bg-primary text-white py-3 px-4 rounded-xl font-bold text-sm hover:bg-primary-container transition-all flex items-center justify-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                      </button>
                      <button 
                        onClick={() => addToWishlist(product)}
                        className={cn(
                          "p-3 rounded-xl border border-outline-variant hover:bg-surface-container transition-all",
                          isInWishlist(product.id) ? "text-secondary border-secondary/30 bg-secondary/10" : "text-on-surface-variant"
                        )}
                        aria-label="Save to wishlist"
                      >
                        <Heart className={cn("w-4 h-4", isInWishlist(product.id) && "fill-current")} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Cart Items & Summary Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items Column */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Delivery Bar */}
              <div className="bg-white rounded-3xl p-6 border border-outline-variant shadow-sm space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 font-bold text-primary">
                    <Truck className="w-4 h-4 text-secondary" />
                    {totalPrice >= freeShippingThreshold ? (
                      <span className="text-secondary font-extrabold">You unlocked Free Delivery in Accra!</span>
                    ) : (
                      <span>
                        Add <strong className="text-secondary">₵{remainingForFreeShipping.toFixed(2)}</strong> more for free dispatch
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-on-surface-variant">
                    {Math.round(progressToFreeShipping)}%
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-secondary h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressToFreeShipping}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-[2.5rem] border border-outline-variant p-6 md:p-8 shadow-sm divide-y divide-outline-variant">
                <AnimatePresence mode="popLayout">
                  {cart.map((item) => (
                    <motion.div 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
                    >
                      <div className="flex gap-4 items-center min-w-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-surface-container shrink-0 border border-outline-variant">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            referrerPolicy="no-referrer" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                            {item.brand}
                          </span>
                          <h3 className="font-display font-bold text-primary text-lg leading-tight truncate">
                            {item.name}
                          </h3>
                          <p className="text-sm font-bold text-primary/70 mt-1">
                            {item.price == null ? 'Price on enquiry' : `₵${item.price.toFixed(2)} each`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between w-full sm:w-auto gap-6 shrink-0">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-1.5 border border-outline-variant rounded-xl p-1 bg-surface-container-low" role="group" aria-label="Quantity">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-primary hover:bg-white rounded-lg transition-all"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-primary">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-primary hover:bg-white rounded-lg transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-[90px]">
                          <span className="text-lg font-black text-primary">
                            {item.price == null ? 'Price on enquiry' : `₵${(item.price * item.quantity).toFixed(2)}`}
                          </span>
                        </div>

                        {/* Remove */}
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="p-2.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Trust Badge Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white p-5 rounded-2xl border border-outline-variant flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-primary text-xs">Licensed Dispensary</h5>
                    <p className="text-[11px] text-on-surface-variant">Vetted clinical standards</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-outline-variant flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-primary text-xs">Prompt Dispatch</h5>
                    <p className="text-[11px] text-on-surface-variant">Same-day in Greater Accra</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-outline-variant flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success/10 text-success flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-primary text-xs">Pharmacist Review</h5>
                    <p className="text-[11px] text-on-surface-variant">Free dosage guidance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Sticky Column */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-outline-variant p-6 md:p-8 shadow-sm space-y-6">
                <h3 className="font-display text-2xl font-bold text-primary">Order Summary</h3>

                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Items Total ({totalItems})</span>
                    <span className="text-primary font-bold">{cart.some(item => item.price == null) ? 'On enquiry' : `₵${totalPrice.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Pharmacist Counseling</span>
                    <span className="text-secondary font-bold uppercase text-xs">Complimentary</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Delivery</span>
                    <span className="text-primary font-bold">
                      {totalPrice >= freeShippingThreshold ? (
                        <span className="text-secondary font-bold">Free</span>
                      ) : (
                        'Calculated on WhatsApp'
                      )}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-outline-variant flex justify-between items-baseline">
                    <span className="font-bold text-primary text-base">Estimated Total</span>
                    <span className="text-3xl font-black text-primary">{cart.some(item => item.price == null) ? 'On enquiry' : `₵${totalPrice.toFixed(2)}`}</span>
                  </div>
                </div>

                <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant text-xs text-on-surface-variant space-y-1">
                  <p className="font-bold text-primary">WhatsApp Clinical Checkout</p>
                  <p>Review and send your order in WhatsApp. Your cart stays here until a pharmacist confirms the order.</p>
                </div>

                {checkoutError && <p role="alert" className="text-sm font-semibold text-error">{checkoutError}</p>}
                {checkoutStarted && <p role="status" className="text-sm font-semibold text-success">WhatsApp opened. Send the prepared message there to request confirmation.</p>}

                <button 
                  onClick={handleCheckout}
                  className={cn(
                    "w-full py-5 rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer",
                    checkoutStarted 
                      ? "bg-success text-white shadow-success/20" 
                      : "bg-primary text-white hover:bg-primary-container shadow-primary/20"
                  )}
                >
                  {checkoutStarted ? (
                    <>
                      Open WhatsApp again <Check className="w-5 h-5" />
                    </>
                  ) : (
                    <>
                      Checkout via WhatsApp
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <Link 
                    to="/vitamins" 
                    className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors underline"
                  >
                    Add more items to order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
