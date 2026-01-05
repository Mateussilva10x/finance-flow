import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FinancialService } from '../../core/services/financial.service';
import { TransactionModalComponent } from '../transactions/components/transaction-modal/transaction-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, TransactionModalComponent],
  template: `
    <div class="space-y-6 relative">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Visão Geral</h1>
          <p class="text-gray-500 text-sm">Acompanhe sua saúde financeira</p>
        </div>

        <div class="flex gap-3">
          <button
            (click)="isModalOpen.set(true)"
            class="bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg shadow-gray-200"
          >
            <span>+</span> Nova Transação
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden"
        >
          <div class="absolute top-0 right-0 p-4 opacity-10 text-green-500">
            <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
              <path
                fill-rule="evenodd"
                d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <p class="text-sm text-gray-500 font-medium">Saldo Atual</p>
          <p
            class="text-3xl font-bold mt-2"
            [class.text-green-600]="financialService.balance() >= 0"
            [class.text-red-600]="financialService.balance() < 0"
          >
            {{ financialService.balance() | currency : 'BRL' }}
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Entradas do Mês</p>
          <p class="text-2xl font-bold text-gray-800 mt-2">
            {{ financialService.totalIncome() | currency : 'BRL' }}
          </p>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Saídas do Mês</p>
          <p class="text-2xl font-bold text-red-600 mt-2">
            {{ financialService.totalExpense() | currency : 'BRL' }}
          </p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div class="flex justify-between items-end mb-2">
          <div>
            <h3 class="font-bold text-gray-800">Limite Mensal</h3>
            <p class="text-sm text-gray-500">
              Gastou {{ financialService.totalExpense() | currency : 'BRL' }} de
              {{ financialService.getMonthlyLimit()() | currency : 'BRL' }}
            </p>
          </div>
          <span
            class="text-sm font-bold"
            [class.text-red-600]="financialService.isOverLimit()"
            [class.text-green-600]="!financialService.isOverLimit()"
          >
            {{ financialService.limitPercentage() | number : '1.0-0' }}%
          </span>
        </div>

        <div class="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div
            class="h-2.5 rounded-full transition-all duration-500"
            [style.width.%]="Math.min(financialService.limitPercentage(), 100)"
            [class.bg-green-500]="!financialService.isOverLimit()"
            [class.bg-red-500]="financialService.isOverLimit()"
          ></div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 class="font-bold text-gray-800">Últimas Transações</h3>
          <button class="text-sm text-blue-600 hover:underline">Ver todas</button>
        </div>
        <div class="divide-y divide-gray-100">
          @for (item of financialService.getTransactions()(); track item.id) {
          <div
            class="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
          >
            <div class="flex items-center gap-4">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                [class.bg-green-100]="item.type === 'income'"
                [class.text-green-600]="item.type === 'income'"
                [class.bg-red-100]="item.type === 'expense'"
                [class.text-red-600]="item.type === 'expense'"
              >
                @if (item.type === 'income') { ⬇️ } @else { ⬆️ }
              </div>
              <div>
                <p class="font-medium text-gray-900">{{ item.title }}</p>
                <p class="text-xs text-gray-500">
                  {{ item.category }} • {{ item.date | date : 'dd/MM/yyyy' }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <span
                class="font-bold whitespace-nowrap"
                [class.text-green-600]="item.type === 'income'"
                [class.text-red-600]="item.type === 'expense'"
              >
                {{ item.type === 'income' ? '+' : '-' }} {{ item.amount | currency : 'BRL' }}
              </span>

              <button
                (click)="deleteTransaction(item.id)"
                class="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                title="Excluir"
              >
                🗑️
              </button>
            </div>
          </div>
          } @if (financialService.getTransactions()().length === 0) {
          <div class="p-8 text-center text-gray-400">Nenhuma transação cadastrada ainda.</div>
          }
        </div>
      </div>
      @if (isModalOpen()) {
      <app-transaction-modal (closeModal)="isModalOpen.set(false)" />
      }
    </div>
  `,
})
export class DashboardComponent {
  financialService = inject(FinancialService);
  Math = Math;

  isModalOpen = signal(false);

  deleteTransaction(id: string) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      this.financialService.removeTransaction(id);
    }
  }
}
