import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, HeartPulse, ShieldCheck, Check, ChevronDown, Stethoscope, ClipboardList, Pill, TestTube, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { sendInquiryViaWhatsapp } from '../../lib/whatsapp';
import { cn } from '../../lib/utils';

export default function WhatsappAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState('General Health Question');
  const [query, setQuery] = useState('');
  const [sent, setSent] = useState(false);
  const [isTopicMenuOpen, setIsTopicMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const topicRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.querySelector<HTMLButtonElement>('[aria-label="Close assistant"]')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setIsTopicMenuOpen(false); setIsOpen(false); triggerRef.current?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);
  const topics = [
    { value: 'General Health Question', label: 'General health question', description: 'Symptoms, dosage, and wellbeing', icon: Stethoscope },
    { value: 'Prescription Medicine Inquiry', label: 'Prescription medicine', description: 'Prescription medicines and availability', icon: ClipboardList },
    { value: 'Vitamin/Supplement Advice', label: 'Vitamin & supplement advice', description: 'Product and wellness guidance', icon: Pill },
    { value: 'Diagnostic Testing Inquiry', label: 'Diagnostic testing', description: 'Testing availability and preparation', icon: TestTube },
    { value: 'Delivery Coordination', label: 'Delivery coordination', description: 'Collection and delivery support', icon: Truck },
  ];
  const selectedTopic = topics.find(item => item.value === topic) ?? topics[0];
  const SelectedTopicIcon = selectedTopic.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const opened = sendInquiryViaWhatsapp(query, user, topic);
    if (!opened) return;
    setSent(true);

  };

  return (
    <div className="fixed bottom-4 right-4 z-[60] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="region"
            aria-label="WhatsApp assistant"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="mb-3 flex max-h-[calc(100dvh-104px)] w-[min(24rem,calc(100vw-32px))] flex-col overflow-y-auto overscroll-contain bg-white rounded-3xl shadow-2xl border border-outline-variant"
          >
            {/* Header */}
            <div className="sticky top-0 z-20 shrink-0 overflow-hidden bg-primary p-5 text-white">
              <div className="absolute top-0 right-0 p-3 opacity-5">
                <HeartPulse className="w-20 h-20" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center border border-white/10">
                    <HeartPulse className="w-5 h-5 text-secondary-container" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm leading-none">Ask a Pharmacist</h3>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-white/80">Continue on WhatsApp</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => { setIsOpen(false); triggerRef.current?.focus(); }}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer"
                  aria-label="Close assistant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Helper Intro */}
            <div className="p-6 pb-2 border-b border-outline-variant bg-surface-container-low">
              <p className="text-xs text-on-surface-variant leading-relaxed font-medium">
                Have a question about dosage, prescriptions, or chronic symptoms? Write to us and a pharmacist will assist you on WhatsApp.
              </p>
            </div>

            {/* Query Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5 relative">
                <span id="whatsapp-topic-label" className="text-xs font-bold text-primary uppercase tracking-widest block ml-1">
                  Inquiry Topic
                </span>
                <button
                  ref={topicRef}
                  type="button"
                  aria-labelledby="whatsapp-topic-label"
                  aria-haspopup="listbox"
                  aria-expanded={isTopicMenuOpen}
                  onClick={() => setIsTopicMenuOpen(value => !value)}
                  onKeyDown={event => { if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); setIsTopicMenuOpen(true); requestAnimationFrame(() => panelRef.current?.querySelector<HTMLButtonElement>('[role="option"]')?.focus()); } }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-2xl border bg-surface-container-lowest px-4 py-3 text-left transition-all',
                    isTopicMenuOpen ? 'border-primary ring-2 ring-primary/15' : 'border-outline-variant hover:border-primary/45',
                  )}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><SelectedTopicIcon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-primary">{selectedTopic.label}</span><span className="block truncate text-[11px] font-medium text-on-surface-variant">{selectedTopic.description}</span></span>
                  <ChevronDown className={cn('h-4 w-4 text-on-surface-variant transition-transform', isTopicMenuOpen && 'rotate-180')} />
                </button>
                <AnimatePresence>
                  {isTopicMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.16 }}
                      role="listbox"
                      aria-label="Inquiry topic"
                      className="relative z-10 mt-2 w-full rounded-2xl border border-outline-variant bg-white p-1.5 shadow-xl"
                      onKeyDown={event => {
                        const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));
                        const index = items.indexOf(document.activeElement as HTMLButtonElement);
                        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setIsTopicMenuOpen(false); topicRef.current?.focus(); }
                        const next = event.key === 'ArrowDown' ? (index + 1) % items.length : event.key === 'ArrowUp' ? (index - 1 + items.length) % items.length : event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : -1;
                        if (next >= 0) { event.preventDefault(); items[next]?.focus(); }
                      }}
                    >
                      {topics.map(item => {
                        const Icon = item.icon;
                        const selected = item.value === topic;
                        return (
                          <button
                            type="button"
                            key={item.value}
                            role="option"
                            aria-selected={selected}
                            onClick={() => { setTopic(item.value); setIsTopicMenuOpen(false); topicRef.current?.focus(); setSent(false); }}
                            className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors', selected ? 'bg-primary text-white' : 'text-primary hover:bg-surface-container-low')}
                          >
                            <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', selected ? 'bg-white/15' : 'bg-primary/10')}><Icon className="h-4 w-4" /></span>
                            <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{item.label}</span><span className={cn('block truncate text-[10px] font-medium', selected ? 'text-white/75' : 'text-on-surface-variant')}>{item.description}</span></span>
                            {selected && <Check className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="whatsapp-message" className="text-xs font-bold text-primary uppercase tracking-widest block ml-1">
                  Your Message
                </label>
                <textarea
                  id="whatsapp-message"
                  required
                  rows={3}
                  placeholder="Ask about a medicine, dosage, or delivery…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSent(false); }}
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 text-sm font-medium text-primary placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              {user && (
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-2 text-primary">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Your WhatsApp message will include your name and email.
                  </span>
                </div>
              )}

              <p className="px-1 text-[11px] leading-relaxed text-on-surface-variant">
                WhatsApp will open with your selected topic and message. Review it and tap Send there; avoid including sensitive medical details.
              </p>

              <button
                type="submit"
                disabled={!query.trim()}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-50",
                  sent
                    ? "bg-success text-white shadow-success/15"
                    : "bg-primary text-white hover:bg-primary-container shadow-primary/10"
                )}
              >
                {sent ? (
                  <>
                    Reopen WhatsApp — send your message there <Check className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Ask on WhatsApp
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        ref={triggerRef}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl relative transition-all cursor-pointer border border-white/10",
          isOpen ? "bg-primary-container rotate-90" : "bg-primary"
        )}
        aria-label="Ask a Pharmacist on WhatsApp"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close-icon"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="msg-icon"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-success border-2 border-white rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
