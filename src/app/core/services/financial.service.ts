import { Injectable, computed, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private transactions = signal<Transaction[]>([
    {
      id: '1',
      title: 'Salário',
      amount: 5000,
      type: 'income',
      category: 'Salário',
      date: new Date(),
    },
    {
      id: '2',
      title: 'Aluguel',
      amount: 500,
      type: 'expense',
      category: 'Moradia',
      date: new Date(),
    },
    {
      id: '3',
      title: 'Supermercado',
      amount: 800,
      type: 'expense',
      category: 'Alimentação',
      date: new Date(),
    },
  ]);

  private monthlyLimitSignal = signal<number>(3000);

  public totalIncome = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0)
  );

  public totalExpense = computed(() =>
    this.transactions()
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0)
  );

  public balance = computed(() => this.totalIncome() - this.totalExpense());

  public investmentPotential = computed(() => {
    const bal = this.balance();
    return bal > 0 ? bal * 0.2 : 0;
  });

  public isOverLimit = computed(() => this.totalExpense() > this.monthlyLimitSignal());

  public limitPercentage = computed(() => {
    if (this.monthlyLimitSignal() === 0) return 0;
    return (this.totalExpense() / this.monthlyLimitSignal()) * 100;
  });

  addTransaction(transaction: Omit<Transaction, 'id'>) {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };

    this.transactions.update((current) => [...current, newTransaction]);
  }

  removeTransaction(id: string) {
    this.transactions.update((current) => current.filter((t) => t.id !== id));
  }

  setMonthlyLimit(amount: number) {
    this.monthlyLimitSignal.set(amount);
  }

  getTransactions() {
    return this.transactions.asReadonly();
  }

  getMonthlyLimit() {
    return this.monthlyLimitSignal.asReadonly();
  }
}
