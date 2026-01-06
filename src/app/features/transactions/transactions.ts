import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FinancialService } from '../../core/services/financial.service';

import { ConfirmDialogService } from '../../shared/services/confirm-dialog.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Transações</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Gerencie todas as suas entradas e saídas
          </p>
        </div>

        <div class="relative w-full md:w-96">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por título ou categoria..."
            (input)="updateSearch($event)"
            class="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600 dark:text-gray-400">
            <thead
              class="bg-gray-50 dark:bg-gray-900 text-xs uppercase font-semibold text-gray-500 dark:text-gray-400"
            >
              <tr>
                <th class="px-6 py-4">Data</th>
                <th class="px-6 py-4">Descrição</th>
                <th class="px-6 py-4">Categoria</th>
                <th class="px-6 py-4 text-right">Valor</th>
                <th class="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
              @for (item of filteredTransactions(); track item.id) {

              <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ item.date | date : 'dd MMM yyyy' }}
                </td>

                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
                  {{ item.title }}
                </td>

                <td>
                  <span
                    class="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                  >
                    {{ item.category }}
                  </span>
                </td>

                <td
                  class="px-6 py-4 text-right font-bold"
                  [class.text-green-600]="item.type === 'income'"
                  [class.dark:text-green-400]="item.type === 'income'"
                  [class.text-red-600]="item.type === 'expense'"
                  [class.dark:text-red-400]="item.type === 'expense'"
                >
                  {{ item.type === 'income' ? '+' : '-' }} {{ item.amount | currency : 'BRL' }}
                </td>

                <td class="px-6 py-4 text-center">
                  <button
                    (click)="delete(item.id)"
                    class="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
              } @empty {
              <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                  Nenhuma transação encontrada.
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class TransactionsComponent {
  financialService = inject(FinancialService);

  confirmService = inject(ConfirmDialogService);

  searchTerm = signal('');

  filteredTransactions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const all = this.financialService.getTransactions()();

    if (!term) return all;

    return all.filter(
      (t) => t.title.toLowerCase().includes(term) || t.category.toLowerCase().includes(term)
    );
  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  delete(id: string) {
    this.confirmService.confirm({
      title: 'Excluir Transação',
      message: 'Tem certeza que deseja apagar este registro do histórico?',
      confirmText: 'Sim, excluir',
      onConfirm: () => {
        this.financialService.removeTransaction(id);
      },
    });
  }
}
