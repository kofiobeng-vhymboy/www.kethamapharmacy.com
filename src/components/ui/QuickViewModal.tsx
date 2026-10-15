import ContentImage from './ContentImage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Heart, Info, MessageCircle, ShieldCheck, X } from 'lucide-react';
import { Product } from '../../types';
import { cn } from '../../lib/utils';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { sendProductInquiryViaWhatsapp } from '../../lib/whatsapp';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [isEnquirySent, setIsEnquirySent] = useState(false);
  const [hasMoreContent, setHasMoreContent] = useState(false);
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const updateScrollState = useCallback(() => {
    const element = scrollBodyRef.current;
    if (!element) return;
    setHasMoreContent(element.scrollHeight - element.scrollTop - element.clientHeight > 2);
  }, []);

  useEffect(() => {
    setIsEnquirySent(false);
  }, [product?.id]);

  useEffect(() => {
    if (!product) return;
    const scrollElement = scrollBodyRef.current;
    if (scrollElement) scrollElement.scrollTop = 0;
    const frame = window.requestAnimationFrame(updateScrollState);
    const observer = scrollElement ? new ResizeObserver(updateScrollState) : null;
    if (scrollElement && observer) observer.observe(scrollElement);
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [product?.id, updateScrollState]);

  useEffect(() => {
    if (!product) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusTimer = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      )).filter(element => element.offsetParent !== null && element.tabIndex >= 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [product?.id]);

  const handleProductEnquiry = () => {
    if (!product) return;
    if (sendProductInquiryViaWhatsapp(product, user)) {
      setIsEnquirySent(true);
      window.setTimeout(() => setIsEnquirySent(false), 2400);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="product-modal-overlay"
          className="product-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.16 } }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
          onMouseDown={event => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={dialogRef}
            className="product-modal-shell"
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.985, y: reducedMotion ? 0 : 8, transition: { duration: reducedMotion ? 0 : 0.16 } }}
            transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.2, 0, 0, 1] }}
          >
            <aside className="product-modal-image">
              <ContentImage src={product.image} alt={product.name} referrerPolicy="no-referrer" className="product-modal-photo" />
              <div className="product-modal-image-gradient" />
              {product.tags && product.tags.length > 0 && (
                <div className="product-modal-tags" aria-label="Product tags">
                  {product.tags.map(tag => <span key={tag}>{tag}</span>)}
                </div>
              )}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label={isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                aria-pressed={isInWishlist(product.id)}
                className={cn('product-modal-wishlist', isInWishlist(product.id) && 'is-active')}
              >
                <Heart className={cn(isInWishlist(product.id) && 'fill-current')} aria-hidden="true" />
              </button>
              <div className="product-modal-image-copy">
                <p>{product.category}</p>
                <h2>{product.name}</h2>
              </div>
            </aside>

            <section className="product-modal-content">
              <header className="product-modal-header">
                <span className="product-modal-header-label">Product details</span>
                <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close" className="product-modal-close">
                  <X aria-hidden="true" />
                </button>
              </header>

              <div className={cn('product-modal-scroll-wrap', hasMoreContent && 'has-more')}>
                <div ref={scrollBodyRef} className="product-modal-scroll" tabIndex={0} onScroll={updateScrollState}>
                  <div className="product-modal-eyebrow">
                    <span>{product.category}</span><i aria-hidden="true" /><span>{product.brand}</span>
                  </div>
                  <h1 id="product-modal-title" className="product-modal-title">{product.name}</h1>

                  <div className="product-modal-availability"><ShieldCheck aria-hidden="true" /><span>{product.prescriptionRequired ? 'A valid prescription and pharmacist review are required.' : 'Exact product, price and availability are confirmed by the pharmacy.'}</span></div>

                  <section className="product-modal-description" aria-labelledby="product-description-heading">
                    <h2 id="product-description-heading"><Info aria-hidden="true" /> Product Description</h2>
                    <p>{product.description || 'Ask the pharmacy to confirm product details from the current pack.'}</p>
                  </section>

                  {product.keyDetails && product.keyDetails.length > 0 && (
                    <section className="product-modal-pharmacist-note">
                      <h2><Info aria-hidden="true" /> Pack details</h2>
                      <ul>{product.keyDetails.map(detail => <li key={detail}>{detail}</li>)}</ul>
                    </section>
                  )}

                  {product.safetyNote && <section className="product-modal-pharmacist-note"><h2><ShieldCheck aria-hidden="true" /> Important note</h2><p>{product.safetyNote}</p></section>}
                </div>
                <div className="product-modal-scroll-fade" aria-hidden="true" />
              </div>

              <footer className="product-modal-footer">
                <p>Price and availability are confirmed directly by our pharmacist.</p>
                <motion.button
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  onClick={handleProductEnquiry}
                  type="button"
                  aria-live="polite"
                  className={cn('product-modal-primary', isEnquirySent && 'is-sent')}
                >
                  <MessageCircle aria-hidden="true" />{isEnquirySent ? 'Continue in WhatsApp' : 'Enquire on WhatsApp'}
                </motion.button>
              </footer>
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
