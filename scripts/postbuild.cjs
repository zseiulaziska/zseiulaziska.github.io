const { existsSync } = require('fs');
const { execSync } = require('child_process');

const siteDir = existsSync('dist/client') ? 'dist/client' : 'dist';

execSync(`npx pagefind --site ${siteDir}`, { stdio: 'inherit' });

// Kontrola danych strukturalnych (BreadcrumbList) — blokuje build przy regresji.
execSync(`node scripts/validate-structured-data.mjs ${siteDir}`, { stdio: 'inherit' });

// Kontrola wyjścia katalogu materiałów: atrybuty Pagefind, kategorie i pliki do pobrania.
execSync(`node scripts/validate-downloads-build.mjs ${siteDir}`, { stdio: 'inherit' });
