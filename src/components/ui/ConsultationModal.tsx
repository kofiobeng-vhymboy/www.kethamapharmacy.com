import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Apple, Calendar, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, Clock, HeartPulse, Pill, Send, ShieldCheck, Stethoscope, UserRound, X, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { sendWhatsappMessage } from '../../lib/whatsapp';
import { contactError } from '../../lib/validation';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultConcern?: string;
}

const initialTime = 'Morning (8:00 AM - 12:00 PM)';
const initialForm = (concern: string) => ({
  name: '',
  phone: '',
  email: '',
  concern,
  preferredDate: '',
  preferredTime: initialTime,
  notes: '',
});

interface ConsultationOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
}

interface ConsultationDropdownProps {
  id: string;
  label: string;
  value: string;
  options: ConsultationOption[];
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onChange: (value: string) => void;
  wide?: boolean;
}

function ConsultationDropdown({ id, label, value, options, isOpen, onToggle, onChange, wide = false }: ConsultationDropdownProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selected = options.find(option => option.value === value) ?? options[0];
  const SelectedIcon = selected.icon;

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) onToggle(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [isOpen, onToggle]);

  const focusOption = (index: number) => {
    window.requestAnimationFrame(() => {
      const items = wrapperRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]');
      if (items?.length) items[Math.max(0, Math.min(index, items.length - 1))]?.focus();
    });
  };

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp' && event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onToggle(true);
    const selectedIndex = options.findIndex(option => option.value === value);
    focusOption(event.key === 'ArrowUp' ? (selectedIndex < 0 ? options.length - 1 : selectedIndex) : Math.max(0, selectedIndex));
  };

  const handleMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'));
    const currentIndex = items.indexOf(document.activeElement as HTMLButtonElement);
    let nextIndex: number | null = null;
    if (event.key === 'ArrowDown') nextIndex = (currentIndex + 1) % items.length;
    if (event.key === 'ArrowUp') nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = items.length - 1;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onToggle(false);
      triggerRef.current?.focus();
      return;
    }
    if (nextIndex !== null) {
      event.preventDefault();
      items[nextIndex]?.focus();
    }
  };

  return (
    <div ref={wrapperRef} className={cn('consultation-modal-dropdown', wide && 'consultation-modal-field-wide')}>
      <span id={`${id}-label`} className="consultation-modal-dropdown-label">{label}</span>
      <button
        ref={triggerRef}
        type="button"
        className={cn('consultation-modal-dropdown-trigger', isOpen && 'is-open')}
        aria-labelledby={`${id}-label`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        onClick={() => onToggle(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="consultation-modal-dropdown-icon"><SelectedIcon aria-hidden="true" /></span>
        <span className="consultation-modal-dropdown-value">
          <span>{selected.label}</span>
          <small>{selected.description}</small>
        </span>
        <ChevronDown className={cn('consultation-modal-dropdown-chevron', isOpen && 'is-open')} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`${id}-listbox`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="consultation-modal-dropdown-menu"
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={{ duration: 0.16 }}
            onKeyDown={handleMenuKeyDown}
          >
            {options.map(option => {
              const OptionIcon = option.icon;
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn('consultation-modal-dropdown-option', isSelected && 'is-selected')}
                  onClick={() => {
                    onChange(option.value);
                    onToggle(false);
                    triggerRef.current?.focus();
                  }}
                >
                  <span className="consultation-modal-dropdown-option-icon"><OptionIcon aria-hidden="true" /></span>
                  <span className="consultation-modal-dropdown-option-copy"><strong>{option.label}</strong><small>{option.description}</small></span>
                  {isSelected && <Check aria-hidden="true" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const localDateValue = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const localToday = () => localDateValue(new Date());

function ConsultationDatePicker({ value, isOpen, onToggle, onChange, error }: {
  value: string;
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onChange: (value: string) => void;
  error: string | null;
}) {
  const today = localToday();
  const parsedValue = value ? new Date(`${value}T12:00:00`) : new Date(`${today}T12:00:00`);
  const [viewMonth, setViewMonth] = useState(() => new Date(parsedValue.getFullYear(), parsedValue.getMonth(), 1));
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const monthLabel = new Intl.DateTimeFormat('en-GH', { month: 'long', year: 'numeric' }).format(viewMonth);
  const selectedLabel = value
    ? new Intl.DateTimeFormat('en-GH', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsedValue)
    : 'Choose a date';
  const firstWeekday = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => index < firstWeekday ? null : index - firstWeekday + 1);
  const weeks = Array.from({ length: Math.ceil(cells.length / 7) }, (_, index) => cells.slice(index * 7, index * 7 + 7));
  const monthFloor = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
  const todayFloor = new Date(`${today}T00:00:00`);
  const previousDisabled = monthFloor <= new Date(todayFloor.getFullYear(), todayFloor.getMonth(), 1);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !wrapperRef.current?.contains(event.target)) onToggle(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [isOpen, onToggle]);

  useEffect(() => {
    if (value) {
      const selectedDate = new Date(`${value}T12:00:00`);
      setViewMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    const frame = window.requestAnimationFrame(() => {
      const selectedDay = wrapperRef.current?.querySelector<HTMLButtonElement>('[aria-selected="true"]:not(:disabled)');
      const todayButton = wrapperRef.current?.querySelector<HTMLButtonElement>('[aria-current="date"]:not(:disabled)');
      (selectedDay ?? todayButton)?.focus({ preventScroll: true });
      const menu = wrapperRef.current?.querySelector<HTMLElement>('.consultation-modal-calendar-menu');
      const scroll = wrapperRef.current?.closest<HTMLElement>('.consultation-modal-scroll');
      if (menu && scroll) scroll.scrollTop += menu.getBoundingClientRect().top - scroll.getBoundingClientRect().top - 8;
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, viewMonth]);

  const moveMonth = (amount: number) => setViewMonth(current => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  const moveCalendarFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      onToggle(false);
      triggerRef.current?.focus();
      return;
    }
    const offsets: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const offset = offsets[event.key];
    if (!offset) return;
    const currentDay = Number((document.activeElement as HTMLElement).dataset.calendarDay);
    if (!currentDay) return;
    event.preventDefault();
    const nextDay = Math.max(1, Math.min(daysInMonth, currentDay + offset));
    wrapperRef.current?.querySelector<HTMLButtonElement>(`[data-calendar-day="${nextDay}"]`)?.focus();
  };

  return (
    <div ref={wrapperRef} className="consultation-modal-dropdown consultation-modal-field-date">
      <span id="consultation-date-label" className="consultation-modal-dropdown-label">Preferred Date</span>
      <button
        ref={triggerRef}
        id="consultation-date-trigger"
        type="button"
        className={cn('consultation-modal-dropdown-trigger', isOpen && 'is-open')}
        aria-labelledby="consultation-date-label"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="consultation-date-calendar"
        aria-required="true"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'consultation-date-error' : undefined}
        onClick={() => onToggle(!isOpen)}
        onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onToggle(true);
          }
        }}
      >
        <span className="consultation-modal-dropdown-icon"><CalendarDays aria-hidden="true" /></span>
        <span className="consultation-modal-dropdown-value"><span>{selectedLabel}</span><small>{value ? 'Selected appointment date' : 'Select your preferred day'}</small></span>
        <ChevronDown className={cn('consultation-modal-dropdown-chevron', isOpen && 'is-open')} aria-hidden="true" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="consultation-date-calendar"
            role="dialog"
            aria-label="Choose a preferred date"
            className="consultation-modal-calendar-menu"
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={{ duration: 0.16 }}
            onKeyDown={moveCalendarFocus}
          >
            <div className="consultation-modal-calendar-header">
              <span>{monthLabel}</span>
              <div>
                <button type="button" aria-label="Previous month" disabled={previousDisabled} onClick={() => moveMonth(-1)}><ChevronLeft aria-hidden="true" /></button>
                <button type="button" aria-label="Next month" onClick={() => moveMonth(1)}><ChevronRight aria-hidden="true" /></button>
              </div>
            </div>
            <div className="consultation-modal-calendar-grid" role="grid" aria-label={monthLabel}>
              <div className="consultation-modal-calendar-week" role="row">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <span key={day} role="columnheader">{day}</span>)}
              </div>
              {weeks.map((week, weekIndex) => (
                <div className="consultation-modal-calendar-week" role="row" key={weekIndex}>
                  {week.map((day, dayIndex) => {
                    if (!day) return <span role="gridcell" aria-disabled="true" key={`blank-${weekIndex}-${dayIndex}`} />;
                    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
                    const dateValue = localDateValue(date);
                    const isDisabled = dateValue < today;
                    const isSelected = dateValue === value;
                    const isToday = dateValue === today;
                    return (
                      <button
                        key={dateValue}
                        type="button"
                        role="gridcell"
                        data-calendar-day={day}
                        aria-label={new Intl.DateTimeFormat('en-GH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date)}
                        aria-selected={isSelected}
                        aria-current={isToday ? 'date' : undefined}
                        disabled={isDisabled}
                        className={cn('consultation-modal-calendar-day', isSelected && 'is-selected', isToday && 'is-today')}
                        onClick={() => {
                          onChange(dateValue);
                          onToggle(false);
                          triggerRef.current?.focus();
                        }}
                      >{day}</button>
                    );
                  })}
                  {week.length < 7 && Array.from({ length: 7 - week.length }, (_, blankIndex) => <span role="gridcell" aria-disabled="true" key={`tail-${weekIndex}-${blankIndex}`} />)}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {error && <span id="consultation-date-error" className="consultation-modal-date-error" role="alert">{error}</span>}
    </div>
  );
}

export default function ConsultationModal({ isOpen, onClose, defaultConcern = 'General Consultation' }: ConsultationModalProps) {
  const [formData, setFormData] = useState(() => initialForm(defaultConcern));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasMoreContent, setHasMoreContent] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [whatsappDraft, setWhatsappDraft] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const concerns: ConsultationOption[] = [
    { value: 'General Consultation', label: 'General Consultation', description: 'Discuss a health concern with a pharmacist', icon: Stethoscope },
    { value: 'Vitamin & Supplement Profiling', label: 'Vitamin & Supplement Profiling', description: 'Personalized supplement guidance', icon: Pill },
    { value: 'Prescription & Medication Review', label: 'Prescription & Medication Review', description: 'Review medicines and prescriptions', icon: ClipboardList },
    { value: 'Chronic Condition Monitoring', label: 'Chronic Condition Monitoring', description: 'Ongoing support for a chronic condition', icon: HeartPulse },
    { value: 'Elderly Care Consultation', label: 'Elderly Care Consultation', description: 'Medication support for older adults', icon: UserRound },
    { value: 'Nutritional Assessment', label: 'Nutritional Assessment', description: 'Nutrition and wellbeing guidance', icon: Apple },
  ];
  const timeSlots: ConsultationOption[] = [
    { value: initialTime, label: 'Morning', description: '8:00 AM – 12:00 PM', icon: Clock },
    { value: 'Afternoon (12:00 PM - 4:00 PM)', label: 'Afternoon', description: '12:00 PM – 4:00 PM', icon: Clock },
    { value: 'Evening (4:00 PM - 7:00 PM)', label: 'Evening', description: '4:00 PM – 7:00 PM', icon: Clock },
  ];

  const updateScrollState = useCallback(() => {
    const element = scrollRef.current;
    if (element) setHasMoreContent(element.scrollHeight - element.scrollTop - element.clientHeight > 2);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )).filter(element => element.offsetParent !== null && element.tabIndex >= 0);
      if (!focusable.length) return;
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
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || isSubmitted || !scrollRef.current) return;
    const element = scrollRef.current;
    const frame = window.requestAnimationFrame(updateScrollState);
    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(element);
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [isOpen, isSubmitted, updateScrollState]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = contactError(formData.name, formData.phone);
    if (validationError) { setFormError(validationError); return; }
    setFormError(null);
    if (!formData.preferredDate || formData.preferredDate < localToday()) {
      setDateError('Choose a preferred date to continue.');
      setOpenDropdown('date');
      window.requestAnimationFrame(() => document.getElementById('consultation-date-trigger')?.focus());
      return;
    }
    setIsSubmitting(true);
    const message = [
      '*CONSULTATION REQUEST — KETHAMA PHARMACY*',
      '',
      `*Name:* ${formData.name.trim()}`,
      `*Phone:* ${formData.phone.trim()}`,
      `*Email:* ${formData.email.trim()}`,
      `*Topic:* ${formData.concern}`,
      `*Preferred date:* ${formData.preferredDate}`,
      `*Preferred time:* ${formData.preferredTime}`,
      ...(formData.notes.trim() ? ['', `*Additional note:* ${formData.notes.trim()}`] : []),
      '',
      'Please confirm whether this appointment time is available. I understand this request is not booked until the pharmacy confirms it.',
    ].join('\n');

    setWhatsappDraft(message);
    sendWhatsappMessage(message);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetAndClose = () => {
    onClose();
      setIsSubmitted(false);
      setDateError(null);
      setFormError(null);
      setOpenDropdown(null);
      setFormData(initialForm(defaultConcern));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="consultation-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : 0.16 } }}
          transition={{ duration: reducedMotion ? 0 : 0.22 }}
          onMouseDown={event => { if (event.target === event.currentTarget) resetAndClose(); }}
        >
          <motion.div
            ref={dialogRef}
            className="consultation-modal-shell"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consultation-modal-title"
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.96, y: reducedMotion ? 0 : 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.985, y: reducedMotion ? 0 : 8 }}
            transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.2, 0, 0, 1] }}
          >
            <aside className="consultation-modal-image">
              <div className="consultation-modal-watermark" aria-hidden="true"><HeartPulse /></div>
              <div className="consultation-modal-image-gradient" />
              <span className="consultation-modal-chip">Pharmacist consultation</span>
              <div className="consultation-modal-image-copy">
                <span className="consultation-modal-icon"><HeartPulse aria-hidden="true" /></span>
                <h1 id="consultation-modal-title">Clinical Consultation</h1>
                <p>Speak directly with our registered clinical pharmacists. Private, professional, and personalized.</p>
                <div className="consultation-modal-trust">
                  <div><ShieldCheck aria-hidden="true" /><span><strong>Professional guidance</strong><small>Discuss your enquiry directly with the pharmacy.</small></span></div>
                  <div><CheckCircle2 aria-hidden="true" /><span><strong>Confirm before booking</strong><small>Ask the pharmacy about availability and any fees.</small></span></div>
                </div>
              </div>
            </aside>

            <section className="consultation-modal-content">
              <header className="consultation-modal-header">
                <span>{isSubmitted ? 'Continue in WhatsApp' : 'Schedule Consultation'}</span>
                <button ref={closeButtonRef} type="button" onClick={resetAndClose} aria-label="Close consultation" className="consultation-modal-close"><X aria-hidden="true" /></button>
              </header>

              {isSubmitted ? (
                <motion.div className="consultation-modal-success" role="status" initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="consultation-modal-success-icon"><CheckCircle2 aria-hidden="true" /></div>
                  <div>
                    <h2>Continue in WhatsApp</h2>
                    <p>Thank you <strong>{formData.name}</strong>. Your consultation request is ready in WhatsApp for <strong>{formData.concern}</strong>.</p>
                    <div className="consultation-modal-confirmation">
                      <p><Calendar aria-hidden="true" />{formData.preferredDate || 'Upcoming business day'}</p>
                      <p><Clock aria-hidden="true" />{formData.preferredTime}</p>
                    </div>
                  </div>
                  <p className="consultation-modal-followup">Send the prefilled message in WhatsApp to complete your enquiry. Your appointment is not confirmed until the pharmacy replies.</p>
                  <button type="button" onClick={() => sendWhatsappMessage(whatsappDraft)} className="consultation-modal-primary">Reopen WhatsApp</button>
                  <button type="button" onClick={resetAndClose} className="service-modal-tab">Close Window</button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="consultation-modal-form">
                  <div className={cn('consultation-modal-scroll-wrap', hasMoreContent && 'has-more')}>
                    <div ref={scrollRef} className="consultation-modal-scroll" onScroll={updateScrollState}>
                      <div className="consultation-modal-form-intro">
                        <h2>Schedule Consultation</h2>
                        <p>Please enter your contact details and preferred timeslot.</p>
                      </div>

                      <div className="consultation-modal-form-grid">
                      <label className="consultation-modal-field">
                        Your Name
                        <input required type="text" autoComplete="name" placeholder="e.g. Ama Mensah" value={formData.name} aria-describedby={formError ? 'consultation-form-error' : undefined} onChange={event => { setFormData({ ...formData, name: event.target.value }); setFormError(null); }} />
                      </label>
                      <label className="consultation-modal-field">
                        Phone Number
                        <input required type="tel" autoComplete="tel" placeholder="e.g. +233 24 123 4567" value={formData.phone} aria-describedby={formError ? 'consultation-form-error' : undefined} onChange={event => { setFormData({ ...formData, phone: event.target.value }); setFormError(null); }} />
                      </label>
                      <label className="consultation-modal-field consultation-modal-field-wide">
                        Email Address
                        <input required type="email" autoComplete="email" placeholder="name@example.com" value={formData.email} onChange={event => setFormData({ ...formData, email: event.target.value })} />
                      </label>
                      <ConsultationDropdown
                        id="consultation-topic"
                        label="Consultation Topic"
                        value={formData.concern}
                        options={concerns}
                        isOpen={openDropdown === 'topic'}
                        onToggle={open => setOpenDropdown(open ? 'topic' : null)}
                        onChange={concern => setFormData({ ...formData, concern })}
                        wide
                      />
                      <ConsultationDatePicker
                        value={formData.preferredDate}
                        isOpen={openDropdown === 'date'}
                        onToggle={open => setOpenDropdown(open ? 'date' : null)}
                        onChange={preferredDate => { setFormData({ ...formData, preferredDate }); setDateError(null); }}
                        error={dateError}
                      />
                      <ConsultationDropdown
                        id="consultation-time"
                        label="Preferred Time"
                        value={formData.preferredTime}
                        options={timeSlots}
                        isOpen={openDropdown === 'time'}
                        onToggle={open => setOpenDropdown(open ? 'time' : null)}
                        onChange={preferredTime => setFormData({ ...formData, preferredTime })}
                      />
                      <label className="consultation-modal-field consultation-modal-field-wide">
                        <span>Additional Notes <em className="consultation-modal-optional">Optional</em></span>
                        <textarea rows={2} placeholder="Tell us what you would like help with…" value={formData.notes} onChange={event => setFormData({ ...formData, notes: event.target.value })} />
                      </label>
                      </div>
                    </div>
                    <div className="consultation-modal-scroll-fade" aria-hidden="true" />
                  </div>
                  <footer className="consultation-modal-footer">
                    {formError && <p id="consultation-form-error" role="alert" className="service-modal-form-error">{formError}</p>}
                    <p className="consultation-modal-footer-note"><ShieldCheck aria-hidden="true" /> This opens WhatsApp with your contact details and preferences. Avoid including sensitive medical details.</p>
                    <button type="submit" disabled={isSubmitting} className="consultation-modal-primary">
                      {isSubmitting ? <><span className="consultation-modal-spinner" aria-hidden="true" /> Opening WhatsApp…</> : <>Continue to WhatsApp <Send aria-hidden="true" /></>}
                    </button>
                  </footer>
                </form>
              )}
            </section>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
