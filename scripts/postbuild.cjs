const { existsSync } = require('fs');
const { execSync } = require('child_process');

const siteDir = existsSync('dist/client') ? 'dist/client' : 'dist';

execSync(`npx pagefind --site ${siteDir}`, { stdio: 'inherit' });

// Kontrola danych strukturalnych (BreadcrumbList) — blokuje build przy regresji.
execSync(`node scripts/validate-structured-data.mjs ${siteDir}`, { stdio: 'inherit' });
