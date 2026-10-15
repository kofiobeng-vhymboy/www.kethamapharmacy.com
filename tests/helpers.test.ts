import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contactError, validPhone } from '../src/lib/validation';
import { readStoredIds, writeStoredIds } from '../src/lib/storage';
import { buildWhatsappUrl } from '../src/lib/whatsapp';

test('phone validation rejects empty, alphabetic, short and implausible input', () => {
  for (const value of ['', 'abc', '1234', '0000000000', '+233abc244537326']) assert.equal(validPhone(value), false);
  for (const value of ['024 453 7326', '+233 24 453 7326', '(020) 123-4567']) assert.equal(validPhone(value), true);
  assert.ok(contactError('  ', '0244537326'));
  assert.equal(contactError('Ama Mensah', '+233244537326'), null);
});

test('WhatsApp drafts use the business number and preserve encoded user input', () => {
  const draft = 'Name: Test & Review\nMedicine? #1 + availability';
  const url = new URL(buildWhatsappUrl(draft));
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/233244537326');
  assert.equal(url.searchParams.get('text'), draft);
});

test('storage tolerates corruption, legacy objects and unavailable storage', () => {
  let stored = '{bad json';
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: () => stored,
    setItem: (_key: string, value: string) => { stored = value; },
  } });
  assert.deepEqual(readStoredIds('wishlist'), []);
  stored = JSON.stringify([{id:'p1',name:'stale'}, 'p1', null, {}, 1, 'p2']);
  assert.deepEqual(readStoredIds('wishlist'), ['p1','p2']);
  assert.equal(writeStoredIds('wishlist', ['p3']), true);
  assert.deepEqual(readStoredIds('wishlist'), ['p3']);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('Storage blocked'); } });
  assert.deepEqual(readStoredIds('wishlist'), []);
  assert.equal(writeStoredIds('wishlist', ['p4']), false);
});
