import { ARTICLES, PRODUCTS, SERVICES } from '../data';
import { Article, PharmacyService, Product } from '../types';
import { HOME_FEATURED_PRODUCT_IDS, SERVICE_STATUS } from '../mocks/ui';

const wait = (ms = 280) => new Promise(resolve => window.setTimeout(resolve, ms));

export interface ProductQuery {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}

const subscribers = new Set<string>();
const serviceRequests: Array<{ id: string; serviceId: string; name: string; phone: string; message: string; createdAt: string }> = [];

export async function getProducts(query: ProductQuery = {}): Promise<PaginatedResult<Product>> {
  await wait();
  const needle = query.search?.trim().toLowerCase() ?? '';
  const matches = PRODUCTS.filter(product =>
    (!needle || [product.name, product.brand, product.category, ...(product.tags ?? [])].join(' ').toLowerCase().includes(needle)) &&
    (!query.category || query.category === 'All' || product.category === query.category),
  );
  const pageSize = query.pageSize ?? Math.max(matches.length, 1);
  const page = Math.max(1, query.page ?? 1);
  return { items: matches.slice((page - 1) * pageSize, page * pageSize), total: matches.length, page, pages: Math.max(1, Math.ceil(matches.length / pageSize)) };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  await wait(220);
  return PRODUCTS.filter(product => HOME_FEATURED_PRODUCT_IDS.includes(product.id));
}

export async function getArticles(search = '', category = 'All Articles'): Promise<Article[]> {
  await wait();
  const needle = search.trim().toLowerCase();
  return ARTICLES.filter(article =>
    (category === 'All Articles' || article.category === category) &&
    (!needle || [article.title, article.excerpt, article.content ?? ''].join(' ').toLowerCase().includes(needle)),
  );
}

export async function getServices(): Promise<PharmacyService[]> {
  await wait();
  return SERVICES;
}

export async function getServiceStatus() {
  await wait(180);
  return SERVICE_STATUS;
}

export async function subscribeToNewsletter(email: string): Promise<{ status: 'created' | 'existing' }> {
  await wait(350);
  const normalized = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(normalized)) throw new Error('Enter a valid email address.');
  if (subscribers.has(normalized)) return { status: 'existing' };
  subscribers.add(normalized);
  return { status: 'created' };
}

export async function createServiceRequest(input: { serviceId: string; name: string; phone: string; message: string }) {
  await wait(350);
  if (!input.name.trim() || !input.phone.trim()) throw new Error('Name and phone number are required.');
  const request = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  serviceRequests.unshift(request);
  return request;
}
