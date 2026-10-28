export type TransactionType = 'income' | 'expense';

export interface Category {
  id: number;
  name: string;
  type?: TransactionType;
  created_at?: string;
}

export interface Payment {
  id: number;
  invoice_id: string;
  client: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Cancelled';
  category_id?: number | null;
  created_at?: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  transactionDate: string; // "2026-10-22"
  categoryId: number | null;
}
