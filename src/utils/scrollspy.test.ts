import { describe, expect, it } from 'vitest';
import { pickActiveTarget, syncTocCurrent, type SectionCandidate, type TocLink } from './scrollspy';

function fakeLink(href: string): TocLink & { attrs: Map<string, string>; tokens: Set<string> } {
  const attrs = new Map<string, string>([['href', href]]);
  const tokens = new Set<string>();
  return {
    attrs,
    tokens,
    getAttribute: (name) => attrs.get(name) ?? null,
    setAttribute: (name, value) => { attrs.set(name, value); },
    removeAttribute: (name) => { attrs.delete(name); },
    classList: {
      toggle: (token, force) => {
        const add = force ?? !tokens.has(token);
        if (add) tokens.add(token);
        else tokens.delete(token);
        return add;
      },
    },
  };
}

function candidate(id: string, isIntersecting: boolean, top: number): SectionCandidate {
  return { id, isIntersecting, boundingClientRect: { top, bottom: top + 200 } };
}

describe('syncTocCurrent', () => {
  it('oznacza aktywny link klasą target-current i aria-current="location"', () => {
    const first = fakeLink('#pierwsza');
    const second = fakeLink('#druga');

    syncTocCurrent([first, second], '#druga');

    expect(second.tokens.has('target-current')).toBe(true);
    expect(second.getAttribute('aria-current')).toBe('location');
    expect(first.tokens.has('target-current')).toBe(false);
    expect(first.getAttribute('aria-current')).toBeNull();
  });

  it('zdejmuje oznaczenia, gdy nie ma aktywnej sekcji', () => {
    const link = fakeLink('#sekcja');
    syncTocCurrent([link], '#sekcja');

    syncTocCurrent([link], null);

    expect(link.tokens.has('target-current')).toBe(false);
    expect(link.getAttribute('aria-current')).toBeNull();
  });

  it('nie aktywuje linków, które nie wskazują na fragment #id', () => {
    const external = fakeLink('/inne');
    const empty = fakeLink('#');

    syncTocCurrent([external, empty], '/inne');
    syncTocCurrent([external, empty], '#');

    expect(external.tokens.size).toBe(0);
    expect(empty.tokens.size).toBe(0);
    expect(external.getAttribute('aria-current')).toBeNull();
  });
});

describe('pickActiveTarget', () => {
  it('zwraca null, gdy żadna sekcja nie przecina linii czytania', () => {
    expect(pickActiveTarget([candidate('a', false, -100), candidate('b', false, 50)])).toBeNull();
    expect(pickActiveTarget([])).toBeNull();
  });

  it('wybiera przecinającą sekcję najbliższą linii czytania', () => {
    const active = pickActiveTarget([
      candidate('pierwsza', true, -600),
      candidate('druga', true, -12),
      candidate('trzecia', false, 40),
    ]);

    expect(active).toBe('druga');
  });
});
