import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.API_URL || 'http://localhost:3001';
const endpoints = ['/', '/api/payments', '/api/payments/1', '/api/categories'];
const watch = process.argv.includes('--watch');

// Farben nur verwenden, wenn die Ausgabe ein Terminal ist
const useColor = process.stdout.isTTY;
const RED = useColor ? '\x1b[31m' : '';
const GREEN = useColor ? '\x1b[32m' : '';
const YELLOW = useColor ? '\x1b[33m' : '';
const RESET = useColor ? '\x1b[0m' : '';

const SLOW_MS = 100;

async function check(path: string): Promise<void> {
  const start = Date.now();
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    const duration = Date.now() - start;

    if (res.ok) {
      const color = duration > SLOW_MS ? YELLOW : GREEN;
      const tag = duration > SLOW_MS ? 'SLOW ' : 'OK   ';
      console.log(`${color}[${tag}] ${res.status} GET ${path} (${duration}ms)${RESET}`);
    } else {
      const body = await res.text();
      console.error(
        `${RED}[ERROR] ${res.status} GET ${path} (${duration}ms) -> ${body.slice(0, 100)}${RESET}`
      );
    }
  } catch (err) {
    console.error(`${RED}[ERROR] GET ${path} - Server nicht erreichbar${RESET}`);
  }
}

async function run(): Promise<void> {
  console.log(`\n--- ${new Date().toLocaleTimeString()} ---`);
  for (const path of endpoints) {
    await check(path);
  }
}

await run();
if (watch) setInterval(run, 3000);
