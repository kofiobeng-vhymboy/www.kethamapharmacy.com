import ContentImage from '../components/ui/ContentImage';
import React, { useState } from 'react';
import { getArticles } from '../lib/mockApi';
import { useAsyncData } from '../hooks/useAsyncData';
import { Link, useSearchParams } from 'react-router-dom';
import { ARTICLES } from '../data';
import { ChevronRight, ArrowRight, BookOpen, SearchX, AlertCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import ArticleModal from '../components/ui/ArticleModal';
import { Article } from '../types';
import SearchField from '../components/ui/SearchField';

export default function HealthHub() {
  const [params, setParams] = useSearchParams();
  const selectedArticle = ARTICLES.find(article => article.id === params.get('article')) ?? null;
  const setSelectedArticle = (article: Article | null) => {
    setParams(previous => { const next = new URLSearchParams(previous); if (article) next.set('article', article.id); else next.delete('article'); return next; }, { preventScrollReset: true });
  };
  const [selectedCategory, setSelectedCategory] = useState('All Articles');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['All Articles', 'Nutrition', 'Wellness', 'Medication', 'Mental Health'];
  const articles = useAsyncData(() => getArticles(searchQuery, selectedCategory), [searchQuery, selectedCategory]);
  const filteredArticles = articles.data ?? [];
  const tilePalettes = [
    'bg-[#08686b] text-white',
    'bg-[#08686b] text-white',
    'bg-[#08686b] text-white',
    'bg-[#a3c1b8] text-white',
  ];

  return (
    <div className="min-h-screen bg-surface-container-low pt-16">
      {/* Blog Hero */}
      <section className="relative isolate overflow-hidden border-b border-outline-variant bg-white px-4 py-14 md:px-8 md:py-20">
        <div className="pointer-events-none absolute -right-24 -top-36 -z-10 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row md:items-center md:gap-12">
          <div className="max-w-2xl">
            <div className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary">
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3 text-outline" />
              <span>Health Hub</span>
            </div>
            <p className="mb-4 border-l-2 border-secondary pl-3 text-xs font-bold uppercase tracking-[.16em] text-secondary">Health information · Kethama Pharmacy</p>
            <h1 className="mb-5 font-display text-4xl font-extrabold leading-[1.08] text-primary md:text-6xl">
              Evidence-Based <br />
              <span className="text-secondary">Wellness Insights.</span>
            </h1>
            <p className="max-w-xl text-base font-medium leading-relaxed text-on-surface-variant md:text-lg">
              Our pharmacists translate complex medical information into simple, actionable health tips for you and your family.
            </p>
          </div>
          
          <div className="relative w-full md:w-[400px] md:shrink-0">
            <div className="w-full rounded-3xl border border-outline-variant bg-surface-container-low p-5 shadow-[0_18px_50px_-38px_rgba(10,30,70,.45)] sm:p-7">
              <div className="mb-4 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white text-primary shadow-sm"><BookOpen className="h-5 w-5" aria-hidden="true" /></span><div><h2 className="font-display text-lg font-bold text-primary">Search the Hub</h2><p className="mt-0.5 text-xs font-medium text-on-surface-variant">Find practical answers by topic</p></div></div>
              <SearchField value={searchQuery} onChange={setSearchQuery} placeholder="Sleep, B vitamins, energy..." ariaLabel="Search health articles" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="px-4 py-14 md:px-8 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex flex-col justify-between gap-5 lg:mb-10 lg:flex-row lg:items-end">
            <div><p className="mb-2 text-xs font-extrabold uppercase tracking-[.12em] text-secondary">The Health Hub</p><h2 className="font-display text-3xl font-bold text-primary">Latest Articles</h2><p className="mt-2 text-sm font-medium text-on-surface-variant" aria-live="polite">{articles.isLoading ? 'Finding useful reads…' : `${filteredArticles.length} ${filteredArticles.length === 1 ? 'article' : 'articles'}${searchQuery ? ` for “${searchQuery}”` : ''}`}</p></div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter articles by category">
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)}
                    aria-pressed={isActive}
                    className={`rounded-full border px-4 py-2.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:text-sm ${
                      isActive 
                        ? 'border-primary bg-primary text-white shadow-sm'
                        : 'border-outline-variant bg-white text-on-surface-variant hover:border-primary/50 hover:text-primary'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {articles.isLoading ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5" aria-label="Loading articles" aria-busy="true">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="min-h-72 animate-pulse rounded-sm bg-white/70" />)}</div>
          ) : articles.error ? (
            <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm md:p-12" role="alert">
              <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-700"><AlertCircle className="h-6 w-6" aria-hidden="true" /></span>
              <h3 className="font-display text-2xl font-bold text-primary">Articles couldn’t load</h3>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-on-surface-variant">{articles.error} Please try again in a moment.</p>
              <button type="button" onClick={() => void articles.reload()} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"><RefreshCw className="h-4 w-4" aria-hidden="true" />Try again</button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-3xl rounded-3xl border border-outline-variant bg-white p-8 text-center shadow-sm md:p-14"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                {searchQuery ? <SearchX className="h-7 w-7" /> : <BookOpen className="h-7 w-7" />}
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-primary mb-4">
                {searchQuery ? 'No matching articles' : selectedCategory === 'All Articles' ? 'New insights are on the way' : `${selectedCategory} insights are on the way`}
              </h3>
              <p className="text-on-surface-variant text-base md:text-lg font-medium leading-relaxed mb-8 max-w-xl mx-auto">
                {searchQuery ? <>We couldn’t find articles matching <strong>“{searchQuery}”</strong>. Try a different phrase or clear your filters.</> : <>We are currently researching and drafting expert clinical articles on <strong>{selectedCategory}</strong>. Our medical writing team is vetting recent pharmaceutical studies to present clear data soon!</>}
              </p>
              {searchQuery && <button type="button" onClick={() => { setSearchQuery(''); setSelectedCategory('All Articles'); }} className="mb-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Clear search and filters <ArrowRight className="h-4 w-4" /></button>}
              <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider">
                ● Vetted by Community Pharmacists
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-5">
              {filteredArticles.map((article, i) => (
                <motion.article 
                  key={article.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i % 4, 3) * 0.06, duration: 0.35 }}
                  className={`group relative flex min-h-[270px] flex-col justify-between overflow-hidden rounded-sm p-6 transition-transform duration-300 hover:-translate-y-1 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary sm:min-h-[300px] sm:p-8 lg:p-9 ${i % 5 === 4 ? 'sm:col-span-2 sm:min-h-[300px]' : ''} ${i % 5 === 4 ? 'text-white' : tilePalettes[i % tilePalettes.length]}`}
                >
                  <ContentImage src={article.image} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#073c3b]/95 via-[#073c3b]/65 to-[#073c3b]/20" />
                  <div className="relative z-10 max-w-2xl">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-white/80">{article.category}</p>
                    <h3 className="mb-4 font-display text-2xl font-bold leading-tight sm:text-3xl lg:text-[2rem]">{article.title}</h3>
                    <p className="max-w-prose text-sm font-medium leading-relaxed text-white/90 sm:text-base">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="relative z-10 mt-7 flex items-center justify-between gap-4 border-t border-current/20 pt-4">
                    <span className="text-xs font-semibold opacity-75">Kethama Health Hub</span>
                    <button
                      type="button"
                      onClick={() => setSelectedArticle(article)}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg font-bold transition-all hover:gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
                    >
                      More info <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <ArticleModal 
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

    </div>
  );
}
