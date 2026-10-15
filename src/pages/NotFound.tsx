import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface-container-lowest px-4 pt-36 pb-16">
      <section className="mx-auto max-w-2xl rounded-[2.5rem] border border-outline-variant bg-white p-10 text-center shadow-sm md:p-16">
        <span className="text-sm font-black tracking-[0.3em] text-secondary">404</span>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-primary md:text-5xl">Page not found</h1>
        <p className="mx-auto mt-5 max-w-lg leading-relaxed text-on-surface-variant">The page you requested is unavailable or may have moved. Return to the pharmacy home page to continue.</p>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-container">
          <ArrowLeft className="h-5 w-5" /> Return home
        </Link>
        <p className="mt-10 flex items-center justify-center gap-2 text-sm font-medium text-on-surface-variant"><MapPin className="h-4 w-4 text-secondary" /> Dome Parakuo Estates, Accra</p>
      </section>
    </main>
  );
}
