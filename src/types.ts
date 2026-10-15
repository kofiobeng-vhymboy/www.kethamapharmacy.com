export interface Product {
  id: string;
  name: string;
  brand: string;
  price?: number;
  image: string;
  category: string;
  tags?: string[];
  description?: string;
  keyDetails?: string[];
  productType?: 'Supplement' | 'OTC medicine' | 'Prescription medicine';
  prescriptionRequired?: boolean;
  safetyNote?: string;
}

export interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  image: string;
  author: string;
  authorRole?: string;
  excerpt: string;
  content?: string;
  sources?: { label: string; url: string }[];
}

export interface PharmacyService {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  icon: string;
  image?: string;
  features?: string[];
  pricing?: string;
}

export interface ShowcaseCategory {
  id: string;
  title: string;
  description: string;
  icon: 'pill' | 'firstAid' | 'test' | 'prescription';
  href: string;
  eyebrow: string;
}

export interface CartItem extends Product {
  quantity: number;
}
