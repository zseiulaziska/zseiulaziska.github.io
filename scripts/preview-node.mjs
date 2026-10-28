// Podgląd produkcyjnego builda na Node — potrzebny, aby Keystatic w trybie
// `storage: { kind: 'local' }` miał dostęp do plików w src/content.
// Użycie: npm run preview:node
import { spawn } from 'node:child_process';

const env = {
  ...process.env,
  PREVIEW_NODE: '1',
};

function run(command, args, extraEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: { ...env, ...extraEnv },
      shell: process.platform === 'win32',
    });

    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} ${args.join(' ')} zakończył się kodem ${code}`));
      }
    });
  });
}

try {
  await run('npx', ['astro', 'build']);

  const port = process.env.PORT ?? '4322';
  const host = process.env.HOST ?? '127.0.0.1';

  console.log(`\nPodgląd (Node): http://${host}:${port}/keystatic\n`);

  await run('node', ['./dist-node/server/entry.mjs'], {
    ...env,
    PORT: port,
    HOST: host,
  });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
