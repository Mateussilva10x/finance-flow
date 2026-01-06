import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialService } from '../../core/services/financial.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-3xl space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Configurações</h1>
        <p class="text-gray-500 text-sm">Personalize sua experiência</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          🎯 Limite de Gastos Mensal
        </h2>
        <p class="text-gray-500 text-sm mb-4">
          Defina um valor máximo para seus gastos. Isso afetará a barra de progresso no Dashboard.
        </p>

        <div class="flex items-center gap-4">
          <div class="relative w-full max-w-xs">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">R$</span>
            <input
              type="number"
              [ngModel]="limitValue()"
              (ngModelChange)="updateLimit($event)"
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <span class="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
            Salvo automaticamente
          </span>
        </div>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-red-100">
        <h2 class="text-lg font-bold text-red-600 mb-4 flex items-center gap-2">
          ⚠️ Zona de Perigo
        </h2>

        <div
          class="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-red-50 rounded-lg border border-red-100"
        >
          <div>
            <p class="font-bold text-gray-800">Apagar todos os dados</p>
            <p class="text-sm text-gray-600">
              Isso removerá todas as transações e configurações salvas no seu navegador.
            </p>
          </div>
          <button
            (click)="clearAll()"
            class="px-4 py-2 bg-white border border-red-200 text-red-600 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
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

  limitValue = this.financialService.getMonthlyLimit();

  updateLimit(newValue: number) {
    if (newValue >= 0) {
      this.financialService.setMonthlyLimit(newValue);
    }
  }

  clearAll() {
    if (confirm('TEM CERTEZA? Isso apagará todo o seu histórico financeiro.')) {
      localStorage.removeItem('finance-flow-data');
      window.location.reload();
    }
  }
}
