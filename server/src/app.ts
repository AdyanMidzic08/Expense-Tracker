import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const apiInfo = {
  name: "Expense Tracker API",
  version: "1.0.0",
  status: "online",
  endpoints: [
    {
      path: "/",
      method: "GET",
      description: "Displays this API overview dashboard"
    },
    {
      path: "/api/payments",
      method: "GET",
      description: "Retrieves all payment records from the database"
    }
  ]
};

app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${apiInfo.name}</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-950 text-slate-100 min-h-screen flex items-center justify-center p-6">
      <div class="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl font-bold text-indigo-400">${apiInfo.name}</h1>
          <span class="px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ${apiInfo.status}
          </span>
        </div>
        <p class="text-slate-400 mb-6 text-sm">Version: ${apiInfo.version}</p>
        <h2 class="text-lg font-semibold mb-4 text-slate-200">Available Endpoints</h2>
        <div class="space-y-3">
          ${apiInfo.endpoints.map(ep => `
            <div class="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <span class="px-2.5 py-1 text-xs font-bold rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">${ep.method}</span>
                <code class="text-sm font-mono text-slate-200">${ep.path}</code>
              </div>
              <span class="text-xs text-slate-400 text-right">${ep.description}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </body>
    </html>
  `;
  res.send(html);
});

app.get('/api/payments', async (req, res) => {
  try {
    const [rows] = await pool.query('select * from payments order by created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
