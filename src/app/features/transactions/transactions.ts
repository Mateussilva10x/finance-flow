import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FinancialService } from '../../core/services/financial.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Transações</h1>
          <p class="text-gray-500 text-sm">Gerencie todas as suas entradas e saídas</p>
        </div>

        <div class="relative w-full md:w-96">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Buscar por título ou categoria..."
            (input)="updateSearch($event)"
            class="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
          />
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-gray-600">
            <thead class="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
              <tr>
                <th class="px-6 py-4">Data</th>
                <th class="px-6 py-4">Descrição</th>
                <th class="px-6 py-4">Categoria</th>
                <th class="px-6 py-4 text-right">Valor</th>
                <th class="px-6 py-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              @for (item of filteredTransactions(); track item.id) {
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  {{ item.date | date : 'dd MMM yyyy' }}
                </td>
                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ item.title }}
                </td>
                <td class="px-6 py-4">
                  <span
                    class="px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200"
                  >
                    {{ item.category }}
                  </span>
                </td>
                <td
                  class="px-6 py-4 text-right font-bold"
                  [class.text-green-600]="item.type === 'income'"
                  [class.text-red-600]="item.type === 'expense'"
                >
                  {{ item.type === 'income' ? '+' : '-' }} {{ item.amount | currency : 'BRL' }}
                </td>
                <td class="px-6 py-4 text-center">
                  <button
                    (click)="delete(item.id)"
                    class="text-gray-400 hover:text-red-600 transition-colors"
                    title="Excluir"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
              } @empty {
              <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-400">
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
    if (confirm('Deseja excluir permanentemente?')) {
      this.financialService.removeTransaction(id);
    }
  }
}
