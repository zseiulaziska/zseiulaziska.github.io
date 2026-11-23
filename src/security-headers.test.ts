import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// Seam: katalog wyjściowy builda, który Cloudflare czyta przy wdrożeniu statycznym.
// postbuild.cjs wybiera dist/client, jeśli istnieje, inaczej dist — sprawdzamy oba,
// żeby test nie zależał od wewnętrznej funkcji resolwującej postbuilda.
function builtHeadersPath(): string {
  const candidates = ['../dist/client/_headers', '../dist/_headers'].map((path) =>
    fileURLToPath(new URL(path, import.meta.url)),
  );
  const found = candidates.find(existsSync);
  expect(found, `Brak _headers w: ${candidates.join(', ')} — nagłówki nie trafiły do builda`).toBeDefined();
  return found!;
}

function parseHeaders(text: string): Map<string, string> {
  const headers = new Map<string, string>();
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s+([A-Za-z0-9-]+):\s*(.*)$/);
    if (match) headers.set(match[1].toLowerCase(), match[2].trim());
  }
  return headers;
}

function parseCsp(value: string): Map<string, string> {
  const directives = new Map<string, string>();
  for (const part of value.split(';')) {
    const [name, ...sources] = part.trim().split(/\s+/);
    if (name) directives.set(name, sources.join(' '));
  }
  return directives;
}

function builtHeaders(): Map<string, string> {
  return parseHeaders(readFileSync(builtHeadersPath(), 'utf8'));
}

describe('nagłówki bezpieczeństwa w buildzie', () => {
  it('ma regułę /* z nagłówkami podstawowymi', () => {
    const text = readFileSync(builtHeadersPath(), 'utf8');
    expect(text).toMatch(/^\/\*\s*$/m);

    const headers = parseHeaders(text);
    expect(headers.get('x-content-type-options')).toBe('nosniff');
    expect(headers.get('x-frame-options')).toBe('SAMEORIGIN');
    expect(headers.get('referrer-policy')).toBe('strict-origin-when-cross-origin');
    expect(headers.get('permissions-policy')).toBe('camera=(), microphone=(), geolocation=(), payment=(), usb=()');

    const hsts = headers.get('strict-transport-security') ?? '';
    expect(hsts).toContain('max-age=31536000');
    expect(hsts).toContain('includeSubDomains');
    // preload jest praktycznie nieodwracalny — decyzja z ticketu 01
    expect(hsts).not.toContain('preload');
  });

  it('dostarcza egzekwowaną CSP z dyrektywami dla zasobów strony', () => {
    const headers = builtHeaders();
    const csp = headers.get('content-security-policy') ?? '';
    const directives = parseCsp(csp);

    expect(directives.get('default-src')).toBe("'self'");
    expect(directives.get('script-src')).toBe("'self' 'unsafe-inline'");
    expect(directives.get('style-src')).toBe("'self' 'unsafe-inline'");
    expect(directives.get('font-src')).toBe("'self' data:");
    expect(directives.get('img-src')).toBe("'self' data: https:");
    expect(directives.get('frame-src')).toBe(
      "'self' https://www.google.com https://maps.google.com https://zseiulaziska.github.io",
    );
    expect(directives.get('connect-src')).toBe("'self' https://script.google.com");
    expect(directives.get('frame-ancestors')).toBe("'self'");
    expect(directives.get('base-uri')).toBe("'self'");
    expect(directives.get('form-action')).toBe("'self'");
    expect(directives.get('object-src')).toBe("'none'");

    // Czcionki są self-hostowane przez astro:assets — te hosty nie mogą wrócić do CSP.
    expect(csp).not.toContain('fonts.googleapis.com');
    expect(csp).not.toContain('fonts.gstatic.com');
  });

  it('nie zostawia CSP w trybie Report-Only po przejściu na egzekwowanie', () => {
    expect(builtHeaders().has('content-security-policy-report-only')).toBe(false);
  });
});
