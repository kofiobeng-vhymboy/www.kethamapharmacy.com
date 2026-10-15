import ContentImage from '../components/ui/ContentImage';
import React, { useState } from 'react';
import { ArrowRight, ShieldCheck, Heart, Clock, Pill, MessageCircle, Eye, Bandage, TestTube, ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HOME_VALUES, SHOWCASE_CATEGORIES } from '../mocks/ui';
import { getArticles, getFeaturedProducts, getServiceStatus } from '../lib/mockApi';
import { useAsyncData } from '../hooks/useAsyncData';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import QuickViewModal from '../components/ui/QuickViewModal';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { sendProductInquiryViaWhatsapp } from '../lib/whatsapp';
import homepageBackground from '../../asset/background.jpg';
import qualityHealthcareImage from '../../asset/Quality Healthcare.jpg';

export default function Home() {
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [enquirySentId, setEnquirySentId] = useState<string | null>(null);
  const featured = useAsyncData(getFeaturedProducts, []);
  const articles = useAsyncData(() => getArticles(), []);
  const homeArticles = articles.data?.slice(0, 3) ?? [];
  const serviceStatus = useAsyncData(getServiceStatus, []);

  const handleProductEnquiry = (product: Product) => {
    if (sendProductInquiryViaWhatsapp(product, user)) {
      setEnquirySentId(product.id);
      window.setTimeout(() => setEnquirySentId(null), 2000);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative flex min-h-[76vh] items-center overflow-hidden bg-primary pt-28 pb-16 md:min-h-[82vh]">
        <div className="absolute inset-0 z-0">
          <ContentImage 
            src={homepageBackground} loading="eager" fetchPriority="high"
            alt="" 
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#062f50]/90 via-[#073f6b]/72 to-[#073f6b]/28" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#062f50]/35 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[.18em] text-white/85">
              <span className="h-px w-8 bg-secondary-container" />
              Kethama Pharmacy · Accra
            </div>
            <h1 className="mb-5 font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
              Pharmacy care for <span className="text-secondary-container">everyday life.</span>
            </h1>
            <p className="mb-9 max-w-xl text-base font-medium leading-relaxed text-white/85 md:text-lg">
              From everyday essentials and prescription medicines to malaria testing and wellness products, our Accra pharmacy is here to help.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link 
                to="/vitamins" 
                className="flex items-center justify-center gap-2 rounded-xl bg-secondary-container px-7 py-4 font-bold text-on-secondary-container transition-colors hover:bg-white"
              >
                Explore our pharmacy
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/services" className="flex items-center justify-center rounded-xl border border-white/35 bg-white/10 px-7 py-4 font-bold text-white transition-colors hover:bg-white/20">Our services</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Bar */}
      <section className="border-b border-outline-variant bg-white px-4 py-5 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-6">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/10 text-secondary"><Clock className="h-4 w-4" /></span>
            <span className="text-sm font-medium">{serviceStatus.data?.detail ?? 'Checking pharmacist availability…'}</span>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="overflow-hidden bg-white px-4 py-20 md:px-8 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {HOME_VALUES.map((v, i) => {
              const Icon = v.icon === 'shield' ? ShieldCheck : v.icon === 'heart' ? Heart : Clock;
              return (
              <motion.div 
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="flex gap-5 rounded-3xl border border-outline-variant bg-white p-6 transition-colors hover:bg-surface-container-low md:p-7"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-container-low text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <div><h3 className="mb-2 font-display text-lg font-bold text-primary">{v.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{v.description}</p></div>
              </motion.div>
            )})}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white px-4 py-20 md:px-8 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-secondary">Selected products</span>
              <h2 className="font-display text-3xl font-bold text-primary md:text-4xl">Everyday wellness</h2>
            </div>
            <Link to="/vitamins" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View all products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
            {featured.isLoading && Array.from({ length: 4 }).map((_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-[2rem] bg-white" />)}
            {featured.data?.map((product) => (
              <article key={product.id} className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#e4ebf3] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c8dedc] hover:shadow-[0_18px_45px_-28px_rgba(9,47,84,.42)]">
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f5f8fc] to-[#eaf1f7] p-5">
                  <ContentImage 
                    src={product.image} 
                    alt={product.name} 
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    
                  />
                  {product.prescriptionRequired && <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white"><ShieldCheck className="h-3.5 w-3.5" />Prescription</span>}
                  {!product.prescriptionRequired && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#006a64]">{product.productType === 'OTC medicine' ? 'Pharmacy essential' : 'Wellness'}</span>}
                  <div className="absolute top-4 right-4 z-10">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      aria-label={isInWishlist(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                      className={cn(
                        "rounded-2xl p-3 shadow-lg backdrop-blur-md transition-all",
                        isInWishlist(product.id) 
                          ? "bg-secondary text-white" 
                          : "bg-white/80 text-primary hover:bg-white"
                      )}
                    >
                      <Heart className={cn("w-5 h-5", isInWishlist(product.id) && "fill-current")} />
                    </button>
                  </div>
                  <div className="product-actions absolute inset-0 z-[2] flex items-center justify-center gap-2 bg-primary/20 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleProductEnquiry(product)} aria-label={`Enquire about ${product.name} on WhatsApp`} className="rounded-full bg-white p-3.5 text-primary shadow-lg transition-all hover:scale-105 hover:bg-primary hover:text-white"><MessageCircle className="h-5 w-5" /></motion.button>
                    <button type="button" onClick={() => setQuickViewProduct(product)} aria-label={`Quick view ${product.name}`} className="rounded-full bg-white px-4 py-3 text-sm font-bold text-primary shadow-lg transition-all hover:scale-105 hover:bg-primary hover:text-white">Quick View</button>
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#00877f]">{product.category}</p>
                  <h3 className="mb-1 font-display text-lg font-bold leading-snug text-[#073f6b] transition-colors group-hover:text-[#006a64]">
                    {product.name}
                  </h3>
                  <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500">{product.brand}</p>
                  <div className="mt-auto flex flex-col gap-3 border-t border-[#e8eef5] pt-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500">Price confirmed on enquiry</span>
                      <button type="button" onClick={() => setQuickViewProduct(product)} className="text-xs font-bold text-[#073f6b] underline decoration-[#b8c8d9] underline-offset-4 hover:text-[#00877f]">Details</button>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleProductEnquiry(product)}
                      aria-label={`Enquire about ${product.name} on WhatsApp`}
                      className={cn(
                        "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all",
                        enquirySentId === product.id 
                          ? "bg-secondary text-white" 
                          : "bg-[#073f6b] text-white hover:bg-[#00518a]"
                      )}
                    >
                      <MessageCircle className="h-4 w-4" />{enquirySentId === product.id ? 'Continue in WhatsApp' : 'Ask about this product'}
                    </motion.button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pharmacy departments */}
      <section className="bg-white px-4 py-20 md:px-8 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-secondary">More than vitamins</span>
            <h2 className="mb-4 font-display text-3xl font-bold text-primary md:text-4xl">Explore the pharmacy</h2>
            <p className="text-on-surface-variant leading-relaxed">Browse the kinds of products and services you can ask us about. Stock and suitability are confirmed by our pharmacy team.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SHOWCASE_CATEGORIES.map((category) => {
              const Icon = category.icon === 'firstAid' ? Bandage : category.icon === 'test' ? TestTube : category.icon === 'prescription' ? ClipboardList : Pill;
              return <Link key={category.id} to={category.href} className="group flex h-full flex-col rounded-[2rem] border border-outline-variant bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:p-7">
                <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-low text-primary"><Icon className="h-6 w-6" /></span>
                <span className="mb-2 block text-[11px] font-bold uppercase tracking-[.14em] text-secondary">{category.eyebrow}</span>
                <h3 className="mb-3 font-display text-xl font-bold text-primary">{category.title}</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{category.description}</p>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-primary">Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
              </Link>;
            })}
          </div>
        </div>
      </section>

      {/* Services CTA */}
      <section className="px-4 py-20 md:px-8 md:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-primary">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 text-white sm:p-12 md:p-16">
              <span className="mb-5 block text-xs font-bold uppercase tracking-[0.18em] text-secondary-container">Professional care</span>
              <h2 className="mb-6 font-display text-3xl font-bold leading-tight md:text-5xl">
                Quality healthcare in your neighborhood.
              </h2>
              <p className="mb-9 max-w-md text-base leading-relaxed text-white/80 md:text-lg">
                Ask our team about malaria testing, blood glucose checks, and other clinical services available at the pharmacy.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link 
                  to="/services" 
                  className="flex items-center gap-2 rounded-xl bg-white px-6 py-4 font-bold text-primary transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
                >
                  Explore services
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="relative min-h-[300px] overflow-hidden lg:min-h-[470px]">
              <ContentImage 
                src={qualityHealthcareImage} 
                alt="Pharmacist" 
                className="absolute inset-0 h-full w-full object-cover object-center brightness-[1.12] contrast-[1.04] saturate-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-transparent to-transparent lg:from-primary/35" />
            </div>
          </div>
        </div>
      </section>

      {/* Health Hub / Blog */}
      <section className="bg-surface-container-low px-4 py-20 md:px-8 md:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-secondary">Wellness education</span>
              <h2 className="mb-4 font-display text-3xl font-bold text-primary md:text-4xl">Useful health reading</h2>
              <p className="font-medium text-on-surface-variant">
                Clear, practical articles on nutrition, wellness, medication, and mental health.
              </p>
            </div>
            <Link to="/health-hub" className="inline-flex items-center gap-2 font-bold text-primary transition-all hover:gap-3 hover:text-secondary">Visit the Health Hub<ArrowRight className="h-5 w-5" /></Link>
          </div>

          {articles.isLoading ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[.82fr_1.7fr]" aria-label="Loading health articles" aria-busy="true">
              <div className="h-[620px] animate-pulse rounded-[2rem] bg-surface-container" />
              <div className="grid gap-5"><div className="h-[380px] animate-pulse rounded-[2rem] bg-surface-container" /><div className="grid grid-cols-2 gap-5"><div className="h-[220px] animate-pulse rounded-[2rem] bg-surface-container" /><div className="h-[220px] animate-pulse rounded-[2rem] bg-surface-container" /></div></div>
            </div>
          ) : homeArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[.82fr_1.7fr]">
              {homeArticles[0] && (
                <Link to={`/health-hub?article=${encodeURIComponent(homeArticles[0].id)}`} className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-outline-variant bg-white transition-shadow hover:shadow-xl lg:row-span-2">
                  <div className="relative aspect-[4/5] overflow-hidden bg-surface-container-low">
                    <ContentImage src={homeArticles[0].image} alt={homeArticles[0].title} referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[.14em] text-secondary"><span>Latest article</span><span className="text-on-surface-variant">{homeArticles[0].category}</span></div>
                    <h3 className="mb-3 font-display text-xl font-bold leading-snug text-primary transition-colors group-hover:text-primary-container md:text-2xl">{homeArticles[0].title}</h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-on-surface-variant">{homeArticles[0].excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary">Read article<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              )}
              <div className="grid min-w-0 gap-5">
                {homeArticles[1] ? (
                  <Link to={`/health-hub?article=${encodeURIComponent(homeArticles[1].id)}`} className="group relative flex min-h-[320px] overflow-hidden rounded-[1.5rem] bg-primary md:min-h-[380px]">
                    <ContentImage src={homeArticles[1].image} alt={homeArticles[1].title} referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#092d27]/95 via-[#092d27]/35 to-transparent" />
                    <div className="relative mt-auto max-w-3xl p-6 text-white md:p-8">
                      <p className="mb-2 text-[11px] font-extrabold uppercase tracking-[.16em] text-secondary-container">Featured article · {homeArticles[1].category}</p>
                      <h3 className="font-display text-xl font-bold leading-snug md:text-3xl">{homeArticles[1].title}</h3>
                      <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-white/80">{homeArticles[1].excerpt}</p>
                    </div>
                  </Link>
                ) : (
                  <Link to="/health-hub" className="flex min-h-[320px] items-end rounded-[1.5rem] bg-primary p-8 text-white">
                    <span className="font-display text-2xl font-bold">Browse all health articles <ArrowRight className="ml-2 inline h-5 w-5" /></span>
                  </Link>
                )}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Link to="/health-hub" className="flex min-h-[220px] flex-col justify-between rounded-[1.5rem] border border-[#c8ddd0] bg-[#e8f1e7] p-6 transition-colors hover:bg-[#dfeade] md:p-7">
                    <div>
                      <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[.16em] text-[#306149]">Explore by topic</p>
                      <h3 className="font-display text-xl font-bold leading-snug text-[#163f2e]">Practical reading for everyday health.</h3>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2 text-[11px] font-semibold text-[#315d45]">
                      {['Nutrition', 'Wellness', 'Medication', 'Mental health'].map(topic => <span key={topic} className="rounded-full border border-[#b8d1be] bg-white/65 px-2.5 py-1">{topic}</span>)}
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#163f2e]">Browse the Health Hub<ArrowRight className="h-4 w-4" /></span>
                  </Link>
                  {homeArticles[2] && (
                    <Link to={`/health-hub?article=${encodeURIComponent(homeArticles[2].id)}`} className="group flex min-h-[220px] flex-col overflow-hidden rounded-[1.5rem] border border-outline-variant bg-white transition-shadow hover:shadow-lg">
                      <div className="min-h-32 flex-1 overflow-hidden bg-surface-container-low">
                        <ContentImage src={homeArticles[2].image} alt={homeArticles[2].title} referrerPolicy="no-referrer" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="p-5">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[.14em] text-secondary">{homeArticles[2].category}</p>
                        <h3 className="font-display text-lg font-bold leading-snug text-primary transition-colors group-hover:text-primary-container">{homeArticles[2].title}</h3>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="rounded-2xl border border-outline-variant bg-surface-container-low p-6 text-sm font-medium text-on-surface-variant">Health articles will appear here soon.</p>
          )}
          
        </div>
      </section>

      {/* Chief Pharmacist statement */}
      <section className="bg-primary px-4 py-16 text-white md:px-8 md:py-20">
        <div className="mx-auto max-w-5xl">
          <span className="mb-5 block text-xs font-bold uppercase tracking-[.18em] text-secondary-container">A note from our leadership</span>
          <blockquote className="max-w-4xl font-display text-2xl font-medium leading-relaxed md:text-4xl">
            “We believe that healthcare starts with a conversation. At Kethama, we take the time to understand your needs before we recommend a solution.”
          </blockquote>
          <p className="mt-6 border-t border-white/20 pt-5 text-sm font-bold uppercase tracking-[.16em] text-white/75">CEO</p>
        </div>
      </section>

      {/* Closing invitation */}
      <section className="border-t border-outline-variant bg-white px-4 py-16 md:px-8 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-7 rounded-[2rem] bg-surface-container-low p-7 sm:p-10 md:flex-row md:items-center md:p-12">
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-secondary">Need a hand?</p>
            <h2 className="mb-3 font-display text-2xl font-bold text-primary md:text-3xl">Speak with the pharmacy team.</h2>
            <p className="font-medium leading-relaxed text-on-surface-variant">Ask about a product, prescription, or service. We’ll confirm the details directly with you.</p>
          </div>
          <Link to="/services" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 font-bold text-white transition-colors hover:bg-primary-container">
            Get in touch<ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />

    </main>
  );
}
