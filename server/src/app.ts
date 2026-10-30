import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import type { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware/auth.js';
import type { AuthenticatedRequest } from './middleware/auth.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

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
      description: "Retrieves user payment records from the database"
    },
    {
      path: "/api/payments/:id",
      method: "GET",
      description: "Retrieves one payment record belonging to the user"
    },
    {
      path: "/api/payments",
      method: "POST",
      description: "Adds a payment for the authenticated user"
    },
    {
      path: "/api/payments/:id",
      method: "PUT",
      description: "Changes the user payment record in the database"
    },
    {
      path: "/api/payments/:id",
      method: "DELETE",
      description: "Removes a user payment from the database"
    },
    {
      path: "/api/categories",
      method: "GET",
      description: "Retrieves user categories from the database"
    },
    {
      path: "/api/categories/:id",
      method: "GET",
      description: "Retrieves one category record belonging to the user"
    },
    {
      path: "/api/categories",
      method: "POST",
      description: "Adds a category for the authenticated user"
    },
    {
      path: "/api/categories/:id",
      method: "PUT",
      description: "Changes the user category record in the database"
    },
    {
      path: "/api/categories/:id",
      method: "DELETE",
      description: "Removes a user category from the database"
    },
    {
      path: "/api/register",
      method: "POST",
      description: "Creates a new User and saves it in the database"
    },
    {
      path: "/api/login",
      method: "POST",
      description: "Authenticates user credentials and returns a JWT token"
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

// --- PAYMENTS ROUTES (Protected) ---
app.get('/api/payments', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const [rows] = await pool.query(
      'SELECT * FROM payments WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/payments/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const [rows]: any = await pool.query(
      'SELECT * FROM payments WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Payment not Found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/payments', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const { invoice_id, client, amount, status, category_id } = req.body;

    if (!invoice_id || !client || amount === undefined) {
      return res.status(400).json({ error: 'Missing required fields (invoice_id, client, amount)' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO payments (user_id, invoice_id, client, amount, status, category_id) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, invoice_id, client, amount, status || 'Pending', category_id || null]
    );

    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      invoice_id,
      client,
      amount,
      status: status || 'Pending',
      category_id: category_id || null
    });
  } catch (error) {
    console.error('Database error during payment insertion:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/payments/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { client, amount, status } = req.body;

    const [result]: any = await pool.query(
      'UPDATE payments SET client = ?, amount = ?, status = ? WHERE id = ? AND user_id = ?',
      [client, amount, status, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ message: 'Payment updated successfully' });
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/payments/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const [result]: any = await pool.query(
      'DELETE FROM payments WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- CATEGORIES ROUTES (Protected) ---
app.get('/api/categories', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE user_id = ? ORDER BY id ASC',
      [userId]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/categories/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const [rows]: any = await pool.query(
      'SELECT * FROM categories WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/categories', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.userId;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name has no Value' });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (user_id, name) VALUES (?, ?)',
      [userId, name]
    );

    res.status(201).json({
      id: result.insertId,
      user_id: userId,
      name,
    });
  } catch (error) {
    console.error('Database error during category insertion:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/categories/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    const { name } = req.body;

    const [result]: any = await pool.query(
      'UPDATE categories SET name = ? WHERE id = ? AND user_id = ?',
      [name, id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully' });
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/categories/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const [result]: any = await pool.query(
      'DELETE FROM categories WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- REGISTER ROUTE ---
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Prüfen, ob der Nutzer bereits existiert
    const [existingUsers]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Passwort sicher verschlüsseln (Hashen)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // In die Datenbank speichern
    await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Database error during registration' });
  }
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Nutzer in der Datenbank suchen
    const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = users[0];

    // Passwort mit dem Hash in der Datenbank vergleichen
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET as string, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Database error during login' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export default app;
