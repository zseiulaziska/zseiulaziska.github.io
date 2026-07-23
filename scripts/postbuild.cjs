const { existsSync } = require('fs');
const { execSync } = require('child_process');

const siteDir = existsSync('dist/client') ? 'dist/client' : 'dist';

execSync(`npx pagefind --site ${siteDir}`, { stdio: 'inherit' });
