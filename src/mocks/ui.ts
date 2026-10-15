import { ShowcaseCategory } from '../types';

export interface HomeValue {
  icon: 'shield' | 'heart' | 'clock';
  title: string;
  description: string;
}

export interface ServiceStatus {
  label: string;
  detail: string;
  updatedAt: string;
}

export const SHOWCASE_CATEGORIES: ShowcaseCategory[] = [
  { id: 'medicines', title: 'Medicines & prescriptions', description: 'Ask our pharmacy team about prescribed medicines and current availability.', icon: 'prescription', href: '/services', eyebrow: 'Pharmacist support' },
  { id: 'first-aid', title: 'First aid & wound care', description: 'Cotton wool, gauze, dressings and other everyday pharmacy essentials.', icon: 'firstAid', href: '/services', eyebrow: 'Everyday essentials' },
  { id: 'testing', title: 'Malaria & health checks', description: 'Enquire about malaria rapid testing and other available health checks.', icon: 'test', href: '/services', eyebrow: 'In-pharmacy services' },
  { id: 'wellness', title: 'Vitamins & supplements', description: 'Browse wellness products and ask about brands, stock and suitability.', icon: 'pill', href: '/vitamins', eyebrow: 'Wellness range' },
];

export const HOME_VALUES: HomeValue[] = [
  { icon: 'shield', title: 'Clinical Expertise', description: 'Pharmacist-led guidance for everyday health decisions.' },
  { icon: 'heart', title: 'Personalized Care', description: 'Support tailored to your medication and wellness needs.' },
  { icon: 'clock', title: 'Efficient Service', description: 'Clear next steps for enquiries, consultations, and collection.' },
];

export const SERVICE_STATUS: ServiceStatus = {
  label: 'Pharmacist support available',
  detail: 'Use WhatsApp to start a product or service enquiry.',
  updatedAt: new Date().toISOString(),
};

export const HOME_FEATURED_PRODUCT_IDS = ['1', '2', '3', '4'];
