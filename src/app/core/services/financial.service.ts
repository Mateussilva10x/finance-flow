import { Injectable, computed, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private platformId = inject(PLATFORM_ID);

  private transactions = signal<Transaction[]>([]);
  private monthlyLimitSignal = signal<number>(3000);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFromStorage();

      effect(() => {
        const state = {
          transactions: this.transactions(),
          limit: this.monthlyLimitSignal(),
        };
        localStorage.setItem('finance-flow-data', JSON.stringify(state));
      });
    }
  }

  private loadFromStorage() {
    const data = localStorage.getItem('finance-flow-data');
    if (data) {
      const parsed = JSON.parse(data);

      const transactionsWithDates = parsed.transactions.map((t: any) => ({
        ...t,
        date: new Date(t.date),
      }));

      this.transactions.set(transactionsWithDates);
      this.monthlyLimitSignal.set(parsed.limit || 3000);
    } else {
      this.transactions.set([
        {
          id: '1',
          title: 'Salário Inicial',
          amount: 5000,
          type: 'income',
          category: 'Salário',
          date: new Date(),
        },
      ]);
    }
  }

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
    const newTransaction: Transaction = { ...transaction, id: crypto.randomUUID() };
    this.transactions.update((current) => [newTransaction, ...current]);
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
