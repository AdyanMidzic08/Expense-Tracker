import { Category, Transaction } from '@/types';

export const categories: Category[] = [
  { id: 1, name: 'Gehalt', type: 'income' },
  { id: 2, name: 'Essen', type: 'expense' },
  { id: 3, name: 'Miete', type: 'expense' },
  { id: 4, name: 'Freizeit', type: 'expense' },
];

export const transactions: Transaction[] = [
  {
    id: 1,
    amount: 2500,
    type: 'income',
    description: 'Oktober Gehalt',
    transactionDate: '2026-10-01',
    categoryId: 1,
  },
  {
    id: 2,
    amount: 800,
    type: 'expense',
    description: 'Miete',
    transactionDate: '2026-10-02',
    categoryId: 3,
  },
  {
    id: 3,
    amount: 45.9,
    type: 'expense',
    description: 'Supermarkt',
    transactionDate: '2026-10-05',
    categoryId: 2,
  },
  {
    id: 4,
    amount: 25,
    type: 'expense',
    description: 'Kino',
    transactionDate: '2026-10-12',
    categoryId: 4,
  },
];
