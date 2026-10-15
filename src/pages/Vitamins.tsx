import ContentImage from '../components/ui/ContentImage';
import React, { useState, useEffect, useRef } from "react";
import {
  MessageCircle,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  Heart,
  Pill,
  ShieldCheck,
  ChevronDown,
  Check,
} from "lucide-react";
import { getProducts } from "../lib/mockApi";
import { useAsyncData } from "../hooks/useAsyncData";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { Link, useSearchParams } from "react-router-dom";
import QuickViewModal from "../components/ui/QuickViewModal";
import ConsultationModal from "../components/ui/ConsultationModal";
import { Product } from "../types";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { sendProductInquiryViaWhatsapp } from "../lib/whatsapp";
import SearchField from "../components/ui/SearchField";

export default function Vitamins() {
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const searchQuery = searchParams.get('q') ?? '';
  const setSearchQuery = (query: string) => setSearchParams(previous => {
    const next = new URLSearchParams(previous);
    if (query) next.set('q', query); else next.delete('q');
    return next;
  }, { replace: true, preventScrollReset: true });
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Featured");
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const setQuickViewProduct = (product: Product | null) => {
    setSearchParams(previous => { const next = new URLSearchParams(previous); if (product) next.set('product', product.id); else next.delete('product'); return next; }, { preventScrollReset: true });
  };
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const catalog = useAsyncData(() => getProducts({ pageSize: 50 }), []);
  const quickViewProduct = catalog.data?.items.find(product => product.id === searchParams.get('product')) ?? null;

  useEffect(() => {
    if (!isSortMenuOpen) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (event.target instanceof Node && !sortMenuRef.current?.contains(event.target)) setIsSortMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, [isSortMenuOpen]);

  const handleProductEnquiry = (product: Product) => {
    sendProductInquiryViaWhatsapp(product, user);
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 2000);
  };

  const categories = ["All", "Multivitamins", "Vitamins", "Minerals", "Immune Support", "Supplements", "OTC Medicines", "Prescription Medicines"];
  const products = catalog.data?.items ?? [];
  const allBrands = Array.from(new Set(products.map((p) => p.brand)));
  const allTags = Array.from(new Set(products.flatMap((p) => p.tags || [])));

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === "All" ||
      p.category === selectedCategory ||
      p.tags?.includes(selectedCategory);
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    const matchesTag =
      selectedTags.length === 0 ||
      (p.tags && p.tags.some((t) => selectedTags.includes(t)));

    return (
      matchesCategory &&
      matchesSearch &&
      matchesBrand &&
      matchesTag
    );
  }).sort((a, b) => {
    if (sortBy === "Name: A to Z") return a.name.localeCompare(b.name);
    return 0; // Featured (default)
  });

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <div className="pt-16 min-h-screen bg-[#f5f8fc]">
      <section className="bg-[#073f6b] px-4 py-20 text-white md:px-8">
        <div className="mx-auto grid max-w-7xl items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div className="max-w-3xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#69e4d2]">
              <Link to="/" className="transition-colors hover:text-white">
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white/80">Products & wellness</span>
            </div>
            <h1 className="mb-6 font-display text-4xl font-extrabold leading-tight text-white md:text-6xl">
              Pharmacy products <span className="text-[#69e4d2]">for everyday care.</span>
            </h1>
            <p className="max-w-2xl text-lg font-medium leading-relaxed text-white/80">
              Browse vitamins, supplements and commonly requested pharmacy products. Product images are examples; confirm the exact brand, pack, price and availability with our team.
            </p>
          </div>

          <div className="w-full lg:w-[390px]">
            <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Search products or brands..." ariaLabel="Search pharmacy products" className="w-full" />
            <p className="mt-3 text-xs font-medium text-white/60">Ask our team to confirm current availability.</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-20">
        <div className="overflow-hidden rounded-[2rem] border border-[#e4ebf3] bg-white shadow-[0_24px_70px_-40px_rgba(9,47,84,.35)]">
          <div className="border-b border-[#e8eef5] p-6 md:p-8">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-bold uppercase tracking-[.2em] text-[#00877f]">Browse by category</span>
                <h2 className="mt-1 font-display text-2xl font-bold text-[#073f6b]">Find what you need</h2>
              </div>
              <p className="text-sm font-medium text-slate-500">{filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:thin]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2.5 text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00877f] focus-visible:ring-offset-2",
                    selectedCategory === cat
                      ? "border-[#073f6b] bg-[#073f6b] text-white shadow-sm"
                      : "border-[#e4ebf3] bg-[#f7f9fc] text-slate-600 hover:border-[#b8d8d7] hover:bg-[#eff8f7] hover:text-[#006a64]",
                  )}
                  aria-pressed={selectedCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 px-6 py-4 sm:flex-row sm:items-center md:px-8">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500"><Pill className="h-4 w-4 text-[#00877f]" />Pharmacy products and wellness essentials</div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-500">Sort</span>
              <div ref={sortMenuRef} className="relative">
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={isSortMenuOpen}
                  aria-label={`Sort products: ${sortBy}`}
                  onClick={() => setIsSortMenuOpen(open => !open)}
                  onKeyDown={event => { if (event.key === "Escape") setIsSortMenuOpen(false); }}
                  className={cn("flex min-w-40 items-center gap-3 rounded-2xl border bg-white px-4 py-3 text-left transition-all", isSortMenuOpen ? "border-primary ring-2 ring-primary/15" : "border-outline-variant hover:border-primary/45")}
                >
                  <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-primary">{sortBy}</span><span className="block text-[10px] font-medium text-on-surface-variant">Product order</span></span>
                  <ChevronDown className={cn("h-4 w-4 shrink-0 text-on-surface-variant transition-transform", isSortMenuOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                  {isSortMenuOpen && (
                    <motion.div role="listbox" aria-label="Sort products" initial={{ opacity: 0, y: -6, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.98 }} transition={{ duration: 0.16 }} className="absolute right-0 top-[calc(100%+8px)] z-40 grid w-60 gap-1 overflow-hidden rounded-2xl border border-outline-variant bg-white p-1.5 shadow-xl">
                      {[{ value: "Featured", description: "Recommended order" }, { value: "Name: A to Z", description: "Alphabetical order" }].map(option => {
                        const selected = sortBy === option.value;
                        return <button type="button" role="option" aria-selected={selected} key={option.value} onClick={() => { setSortBy(option.value); setIsSortMenuOpen(false); }} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors", selected ? "bg-primary text-white" : "text-primary hover:bg-surface-container-low")}>
                          <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", selected ? "bg-white/15" : "bg-primary/10")}><SlidersHorizontal className="h-4 w-4" /></span>
                          <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{option.value}</span><span className={cn("block text-[10px] font-medium", selected ? "text-white/75" : "text-on-surface-variant")}>{option.description}</span></span>
                          {selected && <Check className="h-4 w-4 shrink-0" />}
                        </button>;
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              aria-label={
                isFilterPanelOpen ? "Close filter panel" : "Open filter panel"
              }
              aria-expanded={isFilterPanelOpen}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition-all",
                isFilterPanelOpen
                  ? "border-[#073f6b] bg-[#073f6b] text-white"
                  : "border-[#e4ebf3] bg-[#f7f9fc] text-[#073f6b] hover:bg-[#edf3fa]",
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            </div>
          </div>

          <AnimatePresence>
            {isFilterPanelOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="overflow-hidden border-t border-[#e8eef5] px-6 pt-6 md:px-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <h4 className="font-display font-bold text-primary mb-4">
                      Brands
                    </h4>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {allBrands.map((brand) => (
                        <button
                          key={brand}
                          onClick={() => toggleBrand(brand)}
                          className={cn(
                            "px-4 py-2 rounded-xl border transition-all font-medium",
                            selectedBrands.includes(brand)
                              ? "bg-primary text-white border-primary shadow-sm"
                              : "bg-white text-on-surface-variant border-outline-variant hover:border-primary",
                          )}
                        >
                          {brand}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-display font-bold text-primary mb-4">
                      Health Tags
                    </h4>
                    <div className="flex flex-wrap gap-2 text-sm">
                      {allTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={cn(
                            "px-4 py-2 rounded-xl border transition-all font-medium",
                            selectedTags.includes(tag)
                              ? "bg-secondary text-on-secondary border-secondary shadow-sm"
                              : "bg-white text-on-surface-variant border-outline-variant hover:border-secondary",
                          )}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    <div className="space-y-8">
                      <button
                        onClick={() => {
                          setSelectedBrands([]);
                          setSelectedTags([]);
                          setSelectedCategory("All");
                          setSortBy("Featured");
                          setSearchQuery("");
                        }}
                        className="w-full rounded-xl border border-rose-100 bg-rose-50 py-3 text-sm font-bold text-rose-700 transition-colors hover:bg-rose-100"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 gap-6 bg-[#f5f8fc] p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8 md:p-8">
            {catalog.isLoading && Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[380px] animate-pulse rounded-[2rem] bg-surface-container" />)}
            {catalog.error && <p role="alert" className="col-span-full rounded-2xl bg-error/10 p-5 font-bold text-error">{catalog.error}</p>}
            {!catalog.isLoading && !catalog.error && filteredProducts.length === 0 && <div className="col-span-full rounded-[2rem] border border-outline-variant bg-white p-12 text-center"><h2 className="font-display text-2xl font-bold text-primary">No matching products</h2><p className="mt-2 text-on-surface-variant">Try clearing a filter or using a broader search term.</p></div>}
            {filteredProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[#e4ebf3] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c8dedc] hover:shadow-[0_18px_45px_-28px_rgba(9,47,84,.42)]"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#f5f8fc] to-[#eaf1f7] p-5">
                  <ContentImage
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="relative z-[1] h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    
                  />
                  {product.prescriptionRequired && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white"><ShieldCheck className="h-3.5 w-3.5" />Prescription</span>
                  )}
                  {!product.prescriptionRequired && <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#006a64]">{product.productType === 'OTC medicine' ? 'Pharmacy essential' : 'Wellness'}</span>}
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}
                      aria-label={
                        isInWishlist(product.id)
                          ? `Remove ${product.name} from wishlist`
                          : `Add ${product.name} to wishlist`
                      }
                      className={cn(
                        "rounded-2xl p-3 shadow-lg backdrop-blur-md transition-all",
                        isInWishlist(product.id)
                          ? "bg-secondary text-white"
                          : "bg-white/80 text-primary hover:bg-white",
                      )}
                    >
                      <Heart
                        className={cn(
                          "w-5 h-5",
                          isInWishlist(product.id) && "fill-current",
                        )}
                      />
                    </button>
                  </div>
                  <div className="product-actions absolute inset-0 z-[2] bg-primary/20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleProductEnquiry(product)}
                      aria-label={`Enquire about ${product.name} on WhatsApp`}
                      className="rounded-full bg-white p-3.5 text-primary shadow-lg transition-all hover:scale-105 hover:bg-primary hover:text-white"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </motion.button>
                    <button
                      onClick={() => setQuickViewProduct(product)}
                      aria-label={`Quick view ${product.name}`}
                      className="rounded-full bg-white px-4 py-3 text-sm font-bold text-primary shadow-lg transition-all hover:scale-105 hover:bg-primary hover:text-white"
                    >
                      Quick View
                    </button>
                  </div>
                </div>

                <div className="flex flex-grow flex-col p-5">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[.12em] text-[#00877f]">{product.category}</p>
                  <h3 className="mb-1 font-display text-lg font-bold leading-snug text-[#073f6b] transition-colors group-hover:text-[#006a64]">
                    {product.name}
                  </h3>
                  <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {product.brand}
                  </p>

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
                        "bg-[#073f6b] text-white hover:bg-[#00518a]",
                      )}
                    >
                      <MessageCircle className="h-4 w-4" />{recentlyAddedId === product.id ? "Opening WhatsApp…" : "Ask about this product"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* Pharmacist Help */}
      <section className="border-t border-[#dce5ef] bg-[#f5f8fc] px-4 py-20 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#073f6b] text-white shadow-[0_24px_70px_-40px_rgba(9,47,84,.45)] lg:grid-cols-[1.1fr_.9fr]">
          <div className="p-8 sm:p-10 md:p-14">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[.18em] text-[#69e4d2]">Pharmacist support</span>
            <h2 className="mb-5 max-w-xl font-display text-3xl font-bold leading-tight md:text-5xl">Need help choosing a product?</h2>
            <p className="mb-8 max-w-xl text-base font-medium leading-relaxed text-white/80 md:text-lg">
              Ask our pharmacy team to confirm product details, price, availability, or whether a prescription is required before you decide.
            </p>
            <button
              onClick={() => setIsConsultModalOpen(true)}
              className="inline-flex items-center gap-3 rounded-xl bg-white px-6 py-4 font-bold text-[#073f6b] transition-colors hover:bg-[#e5fbf7]"
            >
              Talk to a Pharmacist<ArrowRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-col justify-center gap-3 bg-[#062f50]/45 p-6 sm:p-8 md:p-10">
            {[
              'Confirm current product availability',
              'Check prescription requirements',
              'Discuss product suitability with the pharmacy team',
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/[.06] p-4 sm:p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#69e4d2]/15 text-[#69e4d2]">
                  {index === 1 ? <ShieldCheck className="h-5 w-5" /> : <Check className="h-5 w-5" />}
                </span>
                <span className="text-sm font-semibold leading-relaxed text-white/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <ConsultationModal 
        isOpen={isConsultModalOpen}
        onClose={() => setIsConsultModalOpen(false)}
        defaultConcern="Vitamin & Supplement Profiling"
      />
    </div>
  );
}
