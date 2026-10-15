import ContentImage from './ContentImage';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Clock, FileText, LoaderCircle, Package, Send, ShieldCheck, UserRoundCheck, X } from 'lucide-react';
import { PharmacyService } from '../../types';
import { cn } from '../../lib/utils';
import { sendWhatsappMessage } from '../../lib/whatsapp';
import { contactError, validPhone } from '../../lib/validation';

interface ServiceModalProps {
  service: PharmacyService | null;
  mode: 'details' | 'inquiry';
  onClose: () => void;
}

const featureIcons = [FileText, UserRoundCheck, Package, ShieldCheck];

export default function ServiceModal({ service, mode, onClose }: ServiceModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [whatsappDraft, setWhatsappDraft] = useState('');
  const [currentMode, setCurrentMode] = useState<'details' | 'inquiry'>(mode);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [bodyScrolled, setBodyScrolled] = useState(false);
  const [hasMoreContent, setHasMoreContent] = useState(false);
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollBodyRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const detailsTabRef = useRef<HTMLButtonElement>(null);
  const inquiryTabRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    setCurrentMode(mode);
    setIsSubmitted(false);
    setFormError(null);
    setFormData({ name: '', phone: '', message: '' });
  }, [mode, service?.id]);

  useEffect(() => {
    if (!service) return;
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
        'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
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
  }, [service?.id]);

  const updateScrollState = useCallback(() => {
    const element = scrollBodyRef.current;
    if (!element) return;
    setBodyScrolled(element.scrollTop > 0);
    setHasMoreContent(element.scrollHeight - element.scrollTop - element.clientHeight > 2);
  }, []);

  useEffect(() => {
    const element = scrollBodyRef.current;
    if (!service || !element) return;
    const frame = window.requestAnimationFrame(updateScrollState);
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [service?.id, currentMode, isSubmitted, updateScrollState]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = contactError(formData.name, formData.phone);
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setIsSubmitting(true);
    setFormError(null);
    try {
      const draft = `SERVICE ENQUIRY - KETHAMA PHARMACY\n\nService: ${service!.title}\nName: ${formData.name.trim()}\nPhone: ${formData.phone.trim()}\n\n${formData.message.trim() || 'Please confirm availability and pricing for this service.'}`;
      setWhatsappDraft(draft);
      sendWhatsappMessage(draft);
      setIsSubmitted(true);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to submit your inquiry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const nextMode = event.key === 'Home' || event.key === 'ArrowLeft'
      ? (currentMode === 'inquiry' || event.key === 'Home' ? 'details' : 'inquiry')
      : (currentMode === 'details' || event.key === 'End' ? 'inquiry' : 'details');
    setCurrentMode(nextMode);
    (nextMode === 'details' ? detailsTabRef : inquiryTabRef).current?.focus();
  };

  return (
    <AnimatePresence>
      {service && (
        <motion.div
          key="service-modal-overlay"
          className="service-modal-overlay"
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
            className="service-modal-shell"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.985, y: reducedMotion ? 0 : 8, transition: { duration: reducedMotion ? 0 : 0.16 } }}
            transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.2, 0, 0, 1] }}
          >
            <aside className="service-modal-image">
              {service.image && <ContentImage src={service.image} alt={service.title} className="service-modal-photo" />}
              <div className="service-modal-image-gradient" />
              <span className="service-modal-chip">Pharmacy Service</span>
              <div className="service-modal-image-copy">
                <h2>{service.title}</h2>
                <p>Professional healthcare services you can trust.</p>
              </div>
            </aside>

            <section className="service-modal-content">
              <header className={cn('service-modal-header', bodyScrolled && 'is-scrolled')}>
                {!isSubmitted && (
                  <div className="service-modal-tabs" role="tablist" aria-label="Service information" onKeyDown={handleTabKeyDown}>
                    <span className={cn('service-modal-tab-indicator', currentMode === 'inquiry' && 'is-inquiry')} />
                    <button
                      ref={detailsTabRef}
                      id="service-details-tab"
                      type="button"
                      role="tab"
                      aria-selected={currentMode === 'details'}
                      aria-controls="service-modal-panel"
                      tabIndex={currentMode === 'details' ? 0 : -1}
                      className="service-modal-tab"
                      onClick={() => setCurrentMode('details')}
                    >Service Details</button>
                    <button
                      ref={inquiryTabRef}
                      id="service-inquiry-tab"
                      type="button"
                      role="tab"
                      aria-selected={currentMode === 'inquiry'}
                      aria-controls="service-modal-panel"
                      tabIndex={currentMode === 'inquiry' ? 0 : -1}
                      className="service-modal-tab"
                      onClick={() => setCurrentMode('inquiry')}
                    >Inquire Now</button>
                  </div>
                )}
                <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close" className="service-modal-close">
                  <X aria-hidden="true" />
                </button>
              </header>

              {isSubmitted ? (
                <div className="service-modal-success" role="status">
                  <div className="service-modal-success-icon"><Check /></div>
                  <div>
                    <h2 id="service-modal-title">Continue in WhatsApp</h2>
                    <p>Send the prepared message in WhatsApp to enquire about <strong>{service.title}</strong>. Your enquiry is not sent until you press Send there.</p>
                  </div>
                  <button type="button" onClick={() => sendWhatsappMessage(whatsappDraft)} className="service-modal-primary">Reopen WhatsApp</button>
                  <button type="button" onClick={onClose} className="service-modal-tab">Close Window</button>
                </div>
              ) : (
                <div className={cn('service-modal-scroll-wrap', hasMoreContent && 'has-more')}>
                  <div
                    ref={scrollBodyRef}
                    className="service-modal-scroll"
                    onScroll={updateScrollState}
                    role="tabpanel"
                    id="service-modal-panel"
                    aria-labelledby={currentMode === 'details' ? 'service-details-tab' : 'service-inquiry-tab'}
                    tabIndex={0}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {currentMode === 'details' ? (
                        <motion.div
                          key="details"
                          className="service-modal-pane"
                          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
                          transition={{ duration: reducedMotion ? 0 : 0.18 }}
                        >
                          <p className="service-modal-eyebrow">Service overview</p>
                          <h1 id="service-modal-title" className="service-modal-title">{service.title}</h1>
                          <p className="service-modal-description">{service.longDescription || service.description}</p>
                          {service.features && service.features.length > 0 && (
                            <section className="service-modal-features" aria-labelledby="service-features-title">
                              <h2 id="service-features-title" className="service-modal-section-label">What’s included</h2>
                              <div className="service-modal-feature-grid">
                                {service.features.map((feature, index) => {
                                  const FeatureIcon = featureIcons[index % featureIcons.length];
                                  return (
                                    <motion.div
                                      key={feature}
                                      className="service-modal-feature"
                                      initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: reducedMotion ? 0 : index * 0.04, duration: reducedMotion ? 0 : 0.2 }}
                                    >
                                      <span className="service-modal-feature-icon"><FeatureIcon aria-hidden="true" /></span>
                                      <span className="service-modal-feature-text">{feature}</span>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </section>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="inquiry"
                          className="service-modal-pane"
                          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: reducedMotion ? 0 : -4 }}
                          transition={{ duration: reducedMotion ? 0 : 0.18 }}
                        >
                          <p className="service-modal-eyebrow">We’re here to help</p>
                          <h1 id="service-modal-title" className="service-modal-title">Service Inquiry</h1>
                          <p className="service-modal-description">Prepare a WhatsApp enquiry about <strong>{service.title}</strong>. The pharmacy will confirm availability and pricing.</p>
                          <form onSubmit={handleSubmit} className="service-modal-form" noValidate>
                            <div className="service-modal-form-grid">
                              <label className="service-modal-field">
                                <span>Full Name</span>
                                <input required type="text" autoComplete="name" placeholder="e.g. Ama Mensah" value={formData.name} aria-describedby={formError ? 'service-form-error' : undefined} aria-invalid={Boolean(formError && formData.name.trim().length < 2)} onChange={event => { setFormData({ ...formData, name: event.target.value }); setFormError(null); }} />
                              </label>
                              <label className="service-modal-field">
                                <span>Phone Number</span>
                                <input required type="tel" autoComplete="tel" placeholder="e.g. +233 24 123 4567" value={formData.phone} aria-describedby={formError ? 'service-form-error' : undefined} aria-invalid={Boolean(formError && !validPhone(formData.phone))} onChange={event => { setFormData({ ...formData, phone: event.target.value }); setFormError(null); }} />
                              </label>
                              <label className="service-modal-field service-modal-field-wide">
                                <span>Your Message <em>(Optional)</em></span>
                                <textarea rows={4} placeholder="Briefly describe what you need help with…" value={formData.message} onChange={event => setFormData({ ...formData, message: event.target.value })} />
                              </label>
                            </div>
                            {formError && <p id="service-form-error" role="alert" className="service-modal-form-error">{formError}</p>}
                            <button type="submit" disabled={isSubmitting} className="service-modal-primary service-modal-submit">
                              {isSubmitting ? <><LoaderCircle className="is-spinning" aria-hidden="true" /> Opening WhatsApp</> : <>Continue to WhatsApp <Send aria-hidden="true" /></>}
                            </button>
                            <p className="service-modal-reassurance"><ShieldCheck aria-hidden="true" /> Continue in WhatsApp to send your message. Avoid sharing sensitive medical information here.</p>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="service-modal-scroll-fade" aria-hidden="true" />
                </div>
              )}

              {!isSubmitted && currentMode === 'details' && (
                <footer className="service-modal-footer">
                  <div className="service-modal-pricing">
                    <span><Clock aria-hidden="true" /></span>
                    <div><strong>{service.pricing || 'Contact us to confirm current pricing'}</strong><small>Pricing and availability confirmed on enquiry</small></div>
                  </div>
                  <button type="button" onClick={() => setCurrentMode('inquiry')} className="service-modal-primary service-modal-footer-cta">Inquire Now <Send aria-hidden="true" /></button>
                </footer>
              )}
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
