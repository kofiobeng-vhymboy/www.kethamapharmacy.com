import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, History, Target, Award, HeartPulse, CheckCircle2, MessageSquare, ClipboardCheck, CheckCircle2 as ConfirmIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';
import ConsultationModal from '../components/ui/ConsultationModal';
import homepageBackground from '../../asset/background.jpg';

export default function About() {
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const milestones = [
    { year: '2021', event: 'Kethama Pharmacy founded with a single mission: clinical excellence.' },
    { year: '2022', event: 'Expanded its range of pharmacy products and services to support the community’s everyday health needs.' },
  ];

  const careSteps = [
    {
      icon: MessageSquare,
      number: '01',
      title: 'Tell us what you need',
      description: 'Start with a product question, prescription enquiry, or request for guidance in person or through our contact channels.',
    },
    {
      icon: ClipboardCheck,
      number: '02',
      title: 'We check the details',
      description: 'The team confirms relevant product information, price, availability, and any prescription requirements before you decide.',
    },
    {
      icon: ConfirmIcon,
      number: '03',
      title: 'Choose your next step',
      description: 'With clear information, you can decide whether to proceed, ask another question, or speak with the pharmacist.',
    },
  ];

  return (
    <main className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 md:py-24 lg:pb-32">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl space-y-8 lg:pr-8"
            >
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                Trusted Since 2021
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-extrabold text-primary leading-tight">
                Healthcare with a <span className="text-secondary">Human Touch.</span>
              </h1>
              <p className="text-lg text-on-surface-variant leading-relaxed max-w-xl font-medium">
                Kethama Pharmacy isn't just about dispensing medication; we're about building a healthier community through professional clinical expertise and genuine care.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mx-auto w-full max-w-lg lg:ml-auto"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src={homepageBackground} 
                  alt="Pharmacist working" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 left-6 hidden max-w-xs rounded-[2.5rem] bg-white p-7 shadow-xl md:block lg:-left-10 lg:-bottom-10 lg:p-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">100%</p>
                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Licensed Professionals</p>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant font-medium">Every professional at Kethama is fully certified and dedicated to your safety.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History & Mission */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="space-y-10 md:space-y-12">
              <div className="flex items-center gap-4">
                <div className="bg-surface-container p-4 rounded-3xl text-primary">
                  <History className="w-8 h-8" />
                </div>
                <h2 className="font-display text-4xl font-bold text-primary">Our Journey</h2>
              </div>
              <div className="space-y-8">
                {milestones.map((m, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-[5rem_minmax(0,1fr)] items-baseline gap-6"
                  >
                    <span className="text-right text-base font-bold leading-relaxed tabular-nums text-secondary">{m.year}</span>
                    <p className="m-0 text-on-surface-variant font-medium leading-relaxed">{m.event}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-10 md:space-y-12">
              <div className="flex items-center gap-4">
                <div className="bg-surface-container p-4 rounded-3xl text-primary">
                  <Target className="w-8 h-8" />
                </div>
                <h2 className="font-display text-4xl font-bold text-primary">Our Mission</h2>
              </div>
              <div className="bg-primary text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <HeartPulse className="w-32 h-32" />
                </div>
                <p className="text-2xl md:text-3xl font-display font-medium leading-relaxed relative z-10 italic">
                  "To bridge the gap between traditional pharmacy and clinical excellence, ensuring every patient receives pharmaceutical care that is accurate, accessible, and deeply personal."
                </p>
                <div className="mt-8 flex items-center gap-4 relative z-10">
                  <div className="h-1 w-12 rounded-full bg-secondary" />
                  <p className="font-bold uppercase tracking-widest text-sm">Commitment to Health</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {['Accuracy', 'Integrity', 'Community', 'Innovation'].map(val => (
                  <div key={val} className="flex items-center gap-3 p-4 bg-surface-container-low rounded-2xl border border-outline-variant">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    <span className="font-bold text-primary">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="bg-surface-container-low px-4 py-20 md:px-8 md:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-2xl">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-secondary">Our approach</span>
            <h2 className="mb-4 font-display text-3xl font-bold leading-tight text-primary md:text-4xl">Clear answers, before you decide.</h2>
            <p className="font-medium leading-relaxed text-on-surface-variant">A little clarity can make a pharmacy visit easier. Here’s what to expect when you get in touch with Kethama.</p>
          </div>

          <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-[2rem] border border-outline-variant bg-white md:grid-cols-3">
            {careSteps.map(({ icon: Icon, number, title, description }, index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={`relative flex h-full flex-col p-7 md:p-9 ${index < careSteps.length - 1 ? 'border-b border-outline-variant md:border-b-0 md:border-r' : ''}`}
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                  <span className="font-display text-sm font-extrabold tracking-widest text-secondary">{number}</span>
                </div>
                <h3 className="mb-3 font-display text-xl font-bold text-primary">{title}</h3>
                <p className="flex-1 text-sm font-medium leading-relaxed text-on-surface-variant">{description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-primary rounded-[3.5rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/10 rounded-full translate-x-1/2 translate-y-1/2" />
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="font-display text-4xl md:text-5xl font-bold">Have a health concern?</h2>
              <p className="text-white/80 text-lg font-medium">
                Our clinical team is always available to provide professional advice on your medications and health goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setIsConsultModalOpen(true)}
                  className="bg-secondary text-white px-10 py-5 rounded-2xl font-bold hover:bg-secondary/90 transition-all shadow-xl shadow-secondary/20"
                >
                  Book a Consultation
                </button>
                <Link 
                  to="/services"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-bold hover:bg-white/25 transition-all flex items-center justify-center"
                >
                  View Our Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ConsultationModal 
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        defaultConcern="General Consultation"
      />
    </main>
  );
}
