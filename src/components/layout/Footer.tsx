import { Link } from 'react-router-dom';
import { Pill, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-primary text-white py-16 px-4 md:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-[1.2fr_.8fr_1fr] md:gap-14">
        <div className="max-w-sm space-y-5">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-white p-2 rounded-lg">
              <Pill className="text-primary w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-white leading-none">Kethama</span>
              <span className="text-[10px] font-medium tracking-widest text-secondary-container uppercase">Pharmacy</span>
            </div>
          </Link>
          <p className="text-surface-container text-sm leading-relaxed">
            Your trusted provider for professional clinical pharmacy services. Committed to excellence in medication management and diagnostic testing in Accra.
          </p>
        </div>

        <div>
          <h3 className="mb-5 font-display text-base font-bold">Explore</h3>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-surface-container md:grid-cols-1">
            <li><Link to="/" className="hover:text-secondary-container transition-colors">Home</Link></li>
            <li><Link to="/vitamins" className="hover:text-secondary-container transition-colors">Products & Essentials</Link></li>
            <li><Link to="/services" className="hover:text-secondary-container transition-colors">Our Services</Link></li>
            <li><Link to="/health-hub" className="hover:text-secondary-container transition-colors">Health Hub</Link></li>
            <li><Link to="/about" className="hover:text-secondary-container transition-colors">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 font-display text-base font-bold">Contact</h3>
          <ul className="space-y-4 text-sm text-surface-container">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-secondary-container" />
              <span>Dome Parakuo Estates, Accra - Ghana</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-secondary-container" />
              <span><a href="tel:+233244537326" className="hover:text-secondary-container">+233 244 537 326</a><span className="mx-2 text-white/40">/</span><a href="tel:+233246865082" className="hover:text-secondary-container">+233 246 865 082</a></span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-secondary-container" />
              <a href="mailto:kethamapharmacy@gmail.com" className="break-all hover:text-secondary-container">kethamapharmacy@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium tracking-widest uppercase text-white/60">
        <p>© 2026 Kethama Pharmacy. All Rights Reserved.</p>
        <Link to="/privacy-and-service-terms" className="transition-colors hover:text-white">Privacy &amp; Service Terms</Link>
      </div>
    </footer>
  );
}
