/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
const Home = React.lazy(() => import('./pages/Home'));
const Vitamins = React.lazy(() => import('./pages/Vitamins'));
const Services = React.lazy(() => import('./pages/Services'));
const HealthHub = React.lazy(() => import('./pages/HealthHub'));
const About = React.lazy(() => import('./pages/About'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AuthProvider } from './context/AuthContext';
import WhatsappAssistant from './components/ui/WhatsappAssistant';
import NotFound from './pages/NotFound';
import PrivacyAndTerms from './pages/PrivacyAndTerms';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  React.useEffect(() => {
    if (hash) {
      let id = hash.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Ignore malformed encoding. */ }
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  React.useEffect(() => {
    const handleLink = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const target = new URL(link.href);
      if (target.origin === location.origin && target.pathname === pathname && !target.search && !target.hash) window.scrollTo(0, 0);
    };
    document.addEventListener('click', handleLink);
    return () => document.removeEventListener('click', handleLink);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
          <div className="min-h-screen flex flex-col">
            <ScrollToTop />
            <Navbar />
            <div className="flex-grow">
              <React.Suspense fallback={<main className="min-h-[60vh] pt-32 text-center text-primary" role="status">Loading page…</main>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/vitamins" element={<Vitamins />} />
                <Route path="/services" element={<Services />} />
                <Route path="/health-hub" element={<HealthHub />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-and-service-terms" element={<PrivacyAndTerms />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              </React.Suspense>
            </div>
            <Footer />
            <WhatsappAssistant />
          </div>
        </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
