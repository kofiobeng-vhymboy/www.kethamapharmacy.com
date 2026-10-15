import ContentImage from '../components/ui/ContentImage';
import React from 'react';
import { Pill, TestTube, Syringe, ClipboardCheck, Bandage, Phone, MapPin, ChevronRight, ArrowRight, MessageSquare, X } from 'lucide-react';
import { getServices } from '../lib/mockApi';
import { useAsyncData } from '../hooks/useAsyncData';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import ServiceModal from '../components/ui/ServiceModal';
import { PharmacyService } from '../types';

export default function Services() {
  const [selectedService, setSelectedService] = React.useState<PharmacyService | null>(null);
  const [modalMode, setModalMode] = React.useState<'details' | 'inquiry'>('details');
  const services = useAsyncData(getServices, []);

  const openServiceModal = (service: PharmacyService, mode: 'details' | 'inquiry') => {
    setSelectedService(service);
    setModalMode(mode);
  };
  const iconMap: Record<string, any> = {
    Pill,
    TestTube,
    Syringe,
    ClipboardCheck,
    Bandage
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-surface-container-low py-12 px-4 sm:py-16 md:px-8 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-secondary font-bold tracking-widest uppercase text-xs mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-outline" />
            <span>Our Services</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-primary mb-5 md:mb-6 leading-tight">
            Clinical Services <br />
            <span className="text-secondary">Tailored for You.</span>
          </h1>
          <p className="text-on-surface-variant text-base sm:text-lg font-medium max-w-2xl leading-relaxed">
            Kethama Pharmacy is more than just a place to pick up medicine. We offer a full suite of clinical services designed to bridge the gap between diagnosis and recovery.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-14 px-4 sm:py-16 md:px-8 md:py-24">
        <div className="max-w-7xl mx-auto space-y-16 sm:space-y-20 lg:space-y-32">
          {services.isLoading && Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-96 animate-pulse rounded-[3rem] bg-surface-container-low" />)}
          {services.error && <p role="alert" className="rounded-2xl bg-error/10 p-5 font-bold text-error">{services.error}</p>}
          {services.data?.map((service, i) => {
            const Icon = iconMap[service.icon] || Pill;
            const isEven = i % 2 === 0;
            
            return (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className={cn(
                  "flex min-w-0 flex-col gap-7 sm:gap-9 lg:gap-12 items-center",
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                )}
              >
                <div className="w-full min-w-0 lg:w-1/2">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-3xl shadow-xl sm:rounded-[2.5rem] lg:rounded-[3rem]">
                    <ContentImage 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                
                <div className="w-full min-w-0 space-y-5 sm:space-y-6 lg:w-1/2 lg:space-y-8">
                  <div className="inline-flex items-center justify-center rounded-2xl bg-surface-container-highest p-3 text-primary sm:p-4">
                    <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <h2 className="font-display text-3xl font-bold leading-tight text-primary sm:text-4xl">{service.title}</h2>
                  <p className="text-base leading-relaxed font-medium text-on-surface-variant sm:text-lg">
                    {service.description}
                  </p>
                  <ul className="space-y-3 sm:space-y-4">
                    {(service.features ?? []).map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm font-medium leading-relaxed text-on-surface-variant sm:text-base">
                        <div className="mt-2 h-2 w-2 flex-none rounded-full bg-secondary" />
                        <span className="min-w-0">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-4 sm:pt-4">
                    <button 
                      onClick={() => openServiceModal(service, 'inquiry')}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 font-bold text-white shadow-lg transition-all hover:bg-primary-container sm:w-auto sm:px-8 sm:py-4"
                    >
                      Inquire Now
                      <MessageSquare className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => openServiceModal(service, 'details')}
                      className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-surface-container px-5 py-3 font-bold text-primary transition-all hover:bg-surface-container-highest sm:w-auto sm:px-8 sm:py-4"
                    >
                      Full Details
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Locations */}
      <section className="bg-surface-container-low px-4 py-14 sm:py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-outline-variant bg-white shadow-sm sm:rounded-[2.5rem] lg:rounded-[3rem]">
          <div className="mx-auto flex max-w-3xl flex-col items-center p-6 text-center sm:p-10 md:p-16 lg:p-20">
            <h2 className="font-display mb-6 text-3xl font-bold text-primary sm:mb-8 md:text-4xl">Where to Find Us</h2>
            <div className="space-y-6 flex flex-col items-center">
              <div className="flex items-center gap-3 text-secondary font-bold mb-2 uppercase text-xs tracking-widest">
                <MapPin className="w-4 h-4 text-secondary" />
                Accra Branch
              </div>
              <h3 className="font-display mb-2 text-xl font-bold text-primary sm:text-2xl">Dome Parakuo Estates</h3>
              <p className="mb-6 text-base font-medium leading-relaxed text-on-surface-variant sm:text-lg">
                Near the second security gate, Dome Parakuo Estates.
              </p>
              <div className="mt-4 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:gap-4">
                <a href="tel:+233244537326" className="flex min-w-0 items-center justify-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4 text-base font-bold text-primary shadow-sm transition-colors hover:text-secondary hover:underline sm:flex-1 sm:px-5 sm:text-lg">
                  <Phone className="w-5 h-5 text-secondary" />
                  +233 24 453 7326
                </a>
                <a href="tel:+233246865082" className="flex min-w-0 items-center justify-center gap-3 rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-4 text-base font-bold text-primary shadow-sm transition-colors hover:text-secondary hover:underline sm:flex-1 sm:px-5 sm:text-lg">
                  <Phone className="w-5 h-5 text-secondary" />
                  +233 24 686 5082
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceModal 
        service={selectedService}
        mode={modalMode}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
}
