import { describe, expect, it } from 'vitest';
import { sanitizeExcerpt } from './search';

describe('sanitizeExcerpt', () => {
  it('zachowuje podświetlenie <mark> z Pagefind', () => {
    expect(sanitizeExcerpt('To jest <mark>test</mark> wyszukiwarki')).toBe(
      'To jest <mark>test</mark> wyszukiwarki',
    );
  });

  it('escapuje payload XSS i nie tworzy elementów ani atrybutów', () => {
    expect(sanitizeExcerpt('<img src=x onerror=alert(1)>')).toBe(
      '&lt;img src=x onerror=alert(1)&gt;',
    );
    expect(sanitizeExcerpt('<mark onclick=alert(1)>x</mark>')).toBe(
      '&lt;mark onclick=alert(1)&gt;x</mark>',
    );
  });

  it('zwraca pusty string dla pustego wejścia i undefined', () => {
    expect(sanitizeExcerpt('')).toBe('');
    expect(sanitizeExcerpt(undefined)).toBe('');
  });

  it('escapuje zagnieżdżony mark i inne tagi, zachowując tylko literalne mark', () => {
    expect(sanitizeExcerpt('<mark>foo <mark>bar</mark></mark>')).toBe(
      '<mark>foo <mark>bar</mark></mark>',
    );
    expect(sanitizeExcerpt('<mark>foo</mark><script>alert(1)</script>')).toBe(
      '<mark>foo</mark>&lt;script&gt;alert(1)&lt;/script&gt;',
    );
  });
});
