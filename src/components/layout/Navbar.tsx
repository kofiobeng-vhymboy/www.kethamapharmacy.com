import ContentImage from '../ui/ContentImage';
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Pill, ArrowRight, ExternalLink, Heart } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS } from '../../data';
import { useWishlist } from '../../context/WishlistContext';
import NotificationToast from '../cart/NotificationToast';
import SearchField from '../ui/SearchField';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { wishlist } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const isHeroOverlay = location.pathname === '/' && !isScrolled && !isSearchOpen && !isMobileMenuOpen;

  const filteredProducts = searchQuery.trim() 
    ? PRODUCTS.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      navigate(`/vitamins?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products & Essentials', path: '/vitamins' },
    { name: 'Services', path: '/services' },
    { name: 'Health Hub', path: '/health-hub' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3 md:px-8',
        isHeroOverlay ? 'bg-primary/75 backdrop-blur-md border-b border-white/15 shadow-lg' : 'bg-white/90 backdrop-blur-md shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <Pill className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
              <span className={cn('font-display text-xl font-bold leading-none', isHeroOverlay ? 'text-white' : 'text-primary')}>Kethama</span>
              <span className={cn('text-[10px] font-medium tracking-widest uppercase', isHeroOverlay ? 'text-secondary-container' : 'text-secondary')}>Pharmacy</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6 whitespace-nowrap">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-sm font-semibold transition-all relative py-2 select-none',
                  isHeroOverlay
                    ? (isActive ? 'text-white' : 'text-white/85 hover:text-white')
                    : (isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary')
                )}
              >
                <span>{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="desktopActiveNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button 
            aria-label={isSearchOpen ? "Close search" : "Open search"}
            aria-controls="search-bar"
            aria-expanded={isSearchOpen}
            className={cn(
              "p-2 transition-colors",
              isSearchOpen ? "text-primary bg-surface-container rounded-full" : isHeroOverlay ? "text-white hover:text-secondary-container" : "text-on-surface-variant hover:text-primary"
            )}
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
          <Link 
            to="/wishlist" 
            aria-label={`Open wishlist, ${wishlist.length} items`}
            className={cn("p-2 transition-colors relative", isHeroOverlay ? "text-white hover:text-secondary-container" : "text-on-surface-variant hover:text-primary")}
          >
            <Heart className={cn("w-5 h-5", wishlist.length > 0 && "fill-secondary text-secondary")} />
            {wishlist.length > 0 && (
              <span className="absolute top-0 right-0 bg-secondary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button 
            className={cn("lg:hidden p-2", isHeroOverlay ? "text-white" : "text-on-surface-variant")}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Descending Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            id="search-bar"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="max-h-[calc(100dvh-80px)] overflow-y-auto bg-white border-t border-outline-variant shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-4 mb-6">
                <SearchField
                  autoFocus
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search for vitamins, supplements, or medical advice..."
                  ariaLabel="Search"
                  className="flex-1"
                  inputClassName="py-5 text-base"
                />
                <button 
                  type="submit"
                  className="hidden md:flex items-center gap-2 bg-primary text-white px-8 py-5 rounded-2xl font-bold hover:bg-primary-container transition-all"
                >
                  Search
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              {filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  {filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      to={`/vitamins?product=${encodeURIComponent(p.id)}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container transition-colors group"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-outline-variant">
                        <ContentImage src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold text-primary truncate">{p.name}</span>
                        <span className="text-xs text-on-surface-variant font-medium">{p.brand}</span>
                        <span className="text-xs font-bold text-secondary mt-1">View product details</span>
                      </div>
                    </Link>
                  ))}
                  {searchQuery.length > 2 && (
                    <button 
                      onClick={handleSearchSubmit}
                      className="lg:col-span-4 flex items-center justify-center gap-2 py-4 border-2 border-dashed border-outline-variant rounded-2xl text-on-surface-variant font-bold hover:border-primary hover:text-primary transition-all group"
                    >
                      View all results for "{searchQuery}"
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              )}
              
              {searchQuery.trim() && filteredProducts.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-on-surface-variant font-medium">No products match your search.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 max-h-[calc(100dvh-64px)] overflow-y-auto bg-white shadow-lg border-t border-outline-variant p-4 flex flex-col gap-4 lg:hidden animate-in fade-in slide-in-from-top-4 duration-300">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  'text-base font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-between',
                  isActive 
                    ? 'bg-primary/5 text-primary border-l-4 border-secondary font-extrabold pl-3' 
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                )}
              </Link>
            );
          })}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant">
            <Link
              to="/wishlist"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-surface-container-low text-primary font-bold text-sm hover:bg-surface-container transition-all"
            >
              <Heart className="w-4 h-4 text-secondary" />
              <span>Wishlist ({wishlist.length})</span>
            </Link>
          </div>

        </div>
      )}

      <NotificationToast />
    </nav>
  );
}
