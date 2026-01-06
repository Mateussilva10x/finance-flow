import { Component, computed, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { FinancialService } from '../../../core/services/financial.service';

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DecimalPipe],
  template: `
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center h-full transition-colors"
    >
      <h3 class="text-gray-800 dark:text-white font-bold mb-6 w-full text-left">
        Gastos por Categoria
      </h3>

      @if (hasExpenses()) {
      <div class="flex flex-col md:flex-row items-center gap-8 w-full">
        <div
          class="relative w-48 h-48 rounded-full shadow-inner"
          [style.background]="chartGradient()"
        >
          <div
            class="absolute inset-4 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center flex-col transition-colors"
          >
            <span class="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase"
              >Total Gasto</span
            >
            <span class="text-xl font-bold text-gray-800 dark:text-white">
              {{ totalExpense() | currency : 'BRL' }}
            </span>
          </div>
        </div>

        <div class="flex-1 w-full space-y-3">
          @for (cat of categoryData(); track cat.name) {
          <div class="flex items-center justify-between group">
            <div class="flex items-center gap-2">
              <div
                class="w-3 h-3 rounded-full shadow-sm"
                [style.background-color]="cat.color"
              ></div>
              <span class="text-sm text-gray-600 dark:text-gray-300 font-medium">{{
                cat.name
              }}</span>
            </div>

            <div class="text-right">
              <span class="text-sm font-bold text-gray-800 dark:text-white">
                {{ cat.total | currency : 'BRL' }}
              </span>
              <p class="text-[10px] text-gray-400 dark:text-gray-500">
                {{ cat.percentage | number : '1.0-0' }}%
              </p>
            </div>
          </div>
          }
        </div>
      </div>
      } @else {
      <div class="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-600">
        <div class="text-4xl mb-2">💤</div>
        <p class="text-sm">Sem gastos registrados</p>
      </div>
      }
    </div>
  `,
})
export class ExpenseChartComponent {
  private financialService = inject(FinancialService);

  private colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  expenses = computed(() =>
    this.financialService
      .getTransactions()()
      .filter((t) => t.type === 'expense')
  );

  totalExpense = this.financialService.totalExpense;

  hasExpenses = computed(() => this.expenses().length > 0);

  categoryData = computed(() => {
    const expenses = this.expenses();
    const total = this.totalExpense();

    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value], index) => ({
        name,
        total: value,
        percentage: (value / total) * 100,
        color: this.colors[index % this.colors.length],
      }))
      .sort((a, b) => b.total - a.total);
  });

  chartGradient = computed(() => {
    let accumulated = 0;
    const parts = this.categoryData().map((cat) => {
      const start = accumulated;
      accumulated += cat.percentage;
      const end = accumulated;
      return `${cat.color} ${start}% ${end}%`;
    });

    return `conic-gradient(${parts.join(', ')})`;
  });
}
