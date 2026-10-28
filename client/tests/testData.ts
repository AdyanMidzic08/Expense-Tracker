import fs from 'fs';
import path from 'path';

export interface TestCategory {
  id: number;
  name: string;
  created_at?: string;
}

export interface TestPayment {
  id: number;
  invoice_id: string;
  client: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Cancelled' | string;
  category_id: number;
  created_at?: string;
}

export interface TestDatabaseData {
  categories: TestCategory[];
  payments: TestPayment[];
}

/**
 * Parses categories and payments from server/testData.sql.
 * If file cannot be read directly (e.g. In isolated CI container),
 * returns guaranteed fallback data identical to testData.sql.
 */
export function loadDatabaseTestData(): TestDatabaseData {
  const possiblePaths = [
    path.resolve(process.cwd(), '../server/testData.sql'),
    path.resolve(process.cwd(), 'server/testData.sql'),
    path.resolve(__dirname, '../../../server/testData.sql'),
  ];

  for (const sqlPath of possiblePaths) {
    if (fs.existsSync(sqlPath)) {
      try {
        const content = fs.readFileSync(sqlPath, 'utf8');
        const categories: TestCategory[] = [];
        const payments: TestPayment[] = [];

        // Parse categories
        const catMatch = content.match(
          /INSERT INTO categories \([^)]+\) VALUES\s*([\s\S]*?);/
        );
        if (catMatch) {
          const lines = catMatch[1].split('\n').filter((l) => l.includes("'"));
          lines.forEach((line, idx) => {
            const m = line.match(/'([^']+)'/);
            if (m) categories.push({ id: idx + 1, name: m[1] });
          });
        }

        // Parse payments
        const payMatch = content.match(
          /INSERT INTO payments \([^)]+\) VALUES\s*([\s\S]*?);/
        );
        if (payMatch) {
          const regex =
            /\('([^']+)',\s*'([^']+)',\s*([0-9.]+),\s*'([^']+)',\s*([0-9]+)\)/g;
          let m: RegExpExecArray | null;
          let id = 1;
          while ((m = regex.exec(payMatch[1])) !== null) {
            payments.push({
              id: id++,
              invoice_id: m[1],
              client: m[2],
              amount: parseFloat(m[3]),
              status: m[4],
              category_id: parseInt(m[5], 10),
            });
          }
        }

        if (categories.length > 0 && payments.length > 0) {
          return { categories, payments };
        }
      } catch (err) {
        console.warn(
          'Could not parse server/testData.sql, using embedded test data:',
          err
        );
      }
    }
  }

  // Exact fallback matching server/testData.sql
  return {
    categories: [
      { id: 1, name: 'Software & Tools' },
      { id: 2, name: 'Cloud & Hosting' },
      { id: 3, name: 'Design & Media' },
      { id: 4, name: 'Marketing' },
      { id: 5, name: 'Hardware' },
    ],
    payments: [
      {
        id: 1,
        invoice_id: 'INV-2026-001',
        client: 'Tech Solutions GmbH',
        amount: 1250.0,
        status: 'Paid',
        category_id: 1,
      },
      {
        id: 2,
        invoice_id: 'INV-2026-002',
        client: 'Max Mustermann',
        amount: 149.99,
        status: 'Paid',
        category_id: 3,
      },
      {
        id: 3,
        invoice_id: 'INV-2026-003',
        client: 'CloudProvider Inc.',
        amount: 89.99,
        status: 'Paid',
        category_id: 2,
      },
      {
        id: 4,
        invoice_id: 'INV-2026-004',
        client: 'Design Studio Blau',
        amount: 450.0,
        status: 'Pending',
        category_id: 3,
      },
      {
        id: 5,
        invoice_id: 'INV-2026-005',
        client: 'AdNetwork Media',
        amount: 320.0,
        status: 'Paid',
        category_id: 4,
      },
      {
        id: 6,
        invoice_id: 'INV-2026-006',
        client: 'Office Hardware Store',
        amount: 1299.0,
        status: 'Paid',
        category_id: 5,
      },
      {
        id: 7,
        invoice_id: 'INV-2026-007',
        client: 'GitHub Enterprise',
        amount: 44.0,
        status: 'Paid',
        category_id: 1,
      },
      {
        id: 8,
        invoice_id: 'INV-2026-008',
        client: 'AWS Server Hosting',
        amount: 215.5,
        status: 'Pending',
        category_id: 2,
      },
      {
        id: 9,
        invoice_id: 'INV-2026-009',
        client: 'Anna Schmidt',
        amount: 75.5,
        status: 'Cancelled',
        category_id: 3,
      },
      {
        id: 10,
        invoice_id: 'INV-2026-010',
        client: 'Local Coffee Shop',
        amount: 45.0,
        status: 'Paid',
        category_id: 4,
      },
      {
        id: 11,
        invoice_id: 'INV-2026-011',
        client: 'DevTools Pro',
        amount: 199.0,
        status: 'Paid',
        category_id: 1,
      },
      {
        id: 12,
        invoice_id: 'INV-2026-012',
        client: 'Vercel Deployment',
        amount: 20.0,
        status: 'Paid',
        category_id: 2,
      },
      {
        id: 13,
        invoice_id: 'INV-2026-013',
        client: 'Google Workspace',
        amount: 72.0,
        status: 'Pending',
        category_id: 1,
      },
      {
        id: 14,
        invoice_id: 'INV-2026-014',
        client: 'Logitech Mouse & Keyboard',
        amount: 149.99,
        status: 'Paid',
        category_id: 5,
      },
      {
        id: 15,
        invoice_id: 'INV-2026-015',
        client: 'Social Media Boost',
        amount: 500.0,
        status: 'Cancelled',
        category_id: 4,
      },
    ],
  };
}

export const TEST_DATABASE_DATA = loadDatabaseTestData();
