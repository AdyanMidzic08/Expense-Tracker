import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import type { ResultSetHeader } from 'mysql2';
import { error } from 'node:console';
import path from 'node:path';
import { text } from 'node:stream/consumers';

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
    },
    {
      path: "api/payments/:id",
      method: "GET",
      description: "Retrieves one payment record from the database"
    },
    {
      path: "api/payments/:id",
      method: "PUT",
      description: "Chnges the payment record from the database"
    },
    {
      path: "api/payments",
      method: "POST",
      description: "adds a payment to the database"
    },
    {
      path: "api/payments/:id",
      method: "DELETE",
      description: "removes a payment from the database"
    },
    {
      path: "/api/categories",
      method: "GET",
      description: "Retrieves all categories records from the database"
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
                <span class="px-2.5 py-1 text-xs font-bold rounded ${
                ep.method === 'GET' ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' :
                ep.method === 'PUT' ? 'bg-blue-600/10 text-blue-500 border border-blue-600/20' :
                ep.method === 'DELETE' ? 'bg-red-500/10 text-red-400 border border-red-600/20' : 
                'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }">${ep.method}</span>
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

app.get('/api/payments/:id', async (req,res) => {
  try {
    const { id } = req.params;
    const [rows]: any = await pool.query('SELECT * FROM payments WHERE id = ?', [id]);

    if(rows.length === 0) {
      return res.status(404).json({error: "Payment not Found"})
    }

    res.json(rows[0])



  } catch (error) {
    console.error(error);
    res.status(500).json({error: "Database error"})
  }
})

app.put('/api/payments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { client, amount, status } = req.body;

    const [result]: any = await pool.query(
      'update payments set client = ?, amount = ?, status = ? WHERE id = ?',
      [client, amount, status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ message: 'Payment updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/payments', async (req,res) => {
  try {
    const {invoice_id , client, amount, status} = req.body;

    if(!invoice_id || !client || amount === undefined) {
      return res.status(500).json({error: "Missing required fields (invoice_id, client, amount)"});
    }

    const [result] = await pool.query<ResultSetHeader>(
      'insert into payments (invoice_id, client, amount, status) values(?,?,?,?)',
      [invoice_id,client,amount,status || 'Pending']
    );

    res.status(201).json({
      id: result.insertId,
      invoice_id,
      client,
      amount,
      status: status || 'Pending'
    })

  } catch (error) {
    console.error('Database error during payment insertion:', error);
    res.status(500).json({ error: 'Database error' });
  }
})

app.delete('/api/payments/:id', async (req,res) => {

  try {
    const { id } = req.params;

    const [result]: any = await pool.query(
      'delete from payments where id = ?',
      [id]
    );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Payment not found' });
      }

      res.json({ message: 'Payment deleted successfully' });

  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Database error' });
  }
})

app.get('/api/categories', async (req,res) => {
  try {
    const[rows] = await pool.query('select * from categories');
    res.json(rows);
  }catch (error) {
    console.error(error);
    res.status(500).json({error: "Database error"})
  } 
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});