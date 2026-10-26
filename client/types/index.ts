export type TransactionType = "income" | "expense";

export interface Category {
  id: number;
  name: string;
}

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  transactionDate: string; // "2026-10-22"
  categoryId: number | null;
}