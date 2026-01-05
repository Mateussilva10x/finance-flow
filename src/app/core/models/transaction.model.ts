export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: Date;
}

export interface FinancialState {
  transactions: Transaction[];
  monthlyLimit: number;
}
