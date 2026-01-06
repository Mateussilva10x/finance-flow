import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialService } from '../../core/services/financial.service';

import { ConfirmDialogService } from '../../shared/services/confirm-dialog.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-3xl space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Configurações</h1>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Personalize sua experiência</p>
      </div>

      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
      >
        <h2 class="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          🎯 Limite de Gastos Mensal
        </h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
          Defina um valor máximo para seus gastos. Isso afetará a barra de progresso no Dashboard.
        </p>

        <div class="flex items-center gap-4">
          <div class="relative w-full max-w-xs">
            <span
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold"
              >R$</span
            >
            <input
              type="number"
              [ngModel]="limitValue()"
              (ngModelChange)="updateLimit($event)"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 transition-colors"
            />
          </div>
          <span
            class="text-sm text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full border border-transparent dark:border-green-800/50"
          >
            Salvo automaticamente
          </span>
        </div>
      </div>

      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-red-100 dark:border-red-900/30 transition-colors"
      >
        <h2 class="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
          ⚠️ Zona de Perigo
        </h2>

        <div
          class="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30 transition-colors"
        >
          <div>
            <p class="font-bold text-gray-800 dark:text-white">Apagar todos os dados</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Isso removerá todas as transações e configurações salvas no seu navegador.
            </p>
          </div>

          <button
            (click)="clearAll()"
            class="px-4 py-2 bg-white dark:bg-gray-700 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-bold rounded-lg hover:bg-red-600 dark:hover:bg-red-600 hover:text-white dark:hover:text-white transition-all shadow-sm"
          >
            Resetar Sistema
          </button>
        </div>
      </div>
    </div>
  `,
})
export class SettingsComponent {
  financialService = inject(FinancialService);

  confirmService = inject(ConfirmDialogService);

  limitValue = this.financialService.getMonthlyLimit();

  updateLimit(newValue: number) {
    if (newValue >= 0) {
      this.financialService.setMonthlyLimit(newValue);
    }
  }

  clearAll() {
    this.confirmService.confirm({
      title: 'Resetar Sistema Completo',
      message:
        'Tem certeza absoluta? Isso apagará todo o seu histórico financeiro e não pode ser desfeito.',
      confirmText: 'Sim, apagar tudo',
      cancelText: 'Cancelar',
      onConfirm: () => {
        localStorage.removeItem('finance-flow-data');
        window.location.reload();
      },
    });
  }
}
