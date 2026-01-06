import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinancialService } from '../../core/services/financial.service';
import { Goal } from '../../core/models/transaction.model';

import { ConfirmDialogService } from '../../shared/services/confirm-dialog.service';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, DatePipe, DecimalPipe],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Metas Financeiras</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            Planeje seus sonhos e acompanhe o progresso
          </p>
        </div>
        <button
          (click)="showForm.set(true)"
          class="bg-green-600 dark:bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors shadow-md shadow-green-200 dark:shadow-none font-medium"
        >
          + Nova Meta
        </button>
      </div>

      @if (showForm()) {
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border-l-4 border-green-500 animate-fade-in transition-colors"
      >
        <h3 class="font-bold text-gray-800 dark:text-white mb-4">Criar Nova Meta</h3>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            [(ngModel)]="newGoal.title"
            placeholder="Nome da meta (ex: Carro Novo)"
            class="border border-gray-200 dark:border-gray-600 p-2 rounded outline-none focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />

          <input
            type="number"
            [(ngModel)]="newGoal.target"
            placeholder="Valor Alvo (R$)"
            class="border border-gray-200 dark:border-gray-600 p-2 rounded outline-none focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />

          <input
            type="date"
            [(ngModel)]="newGoal.deadline"
            class="border border-gray-200 dark:border-gray-600 p-2 rounded outline-none focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white dark:[color-scheme:dark] transition-colors"
          />

          <div class="flex gap-2">
            <button
              (click)="add()"
              class="flex-1 bg-green-600 dark:bg-green-500 text-white rounded hover:bg-green-700 dark:hover:bg-green-600 font-medium transition-colors"
            >
              Salvar
            </button>
            <button
              (click)="showForm.set(false)"
              class="px-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
      }

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (goal of financialService.getGoals()(); track goal.id) {

        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full group hover:shadow-md dark:hover:border-gray-600 transition-all"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="font-bold text-lg text-gray-800 dark:text-white">{{ goal.title }}</h3>
              <p class="text-xs text-gray-400 dark:text-gray-500">
                Prazo: {{ goal.deadline | date : 'dd/MM/yyyy' }}
              </p>
            </div>
            <button
              (click)="delete(goal.id)"
              class="text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
              title="Excluir Meta"
            >
              🗑️
            </button>
          </div>

          <div class="mb-4">
            <div class="flex justify-between items-end mb-1">
              <span class="text-2xl font-bold text-gray-800 dark:text-white">{{
                goal.currentAmount | currency : 'BRL'
              }}</span>
              <span class="text-sm text-gray-500 dark:text-gray-400"
                >de {{ goal.targetAmount | currency : 'BRL' }}</span
              >
            </div>

            <div
              class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-3 overflow-hidden transition-colors"
            >
              <div
                class="h-full bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700 transition-all duration-1000"
                [style.width.%]="(goal.currentAmount / goal.targetAmount) * 100"
              ></div>
            </div>

            <p class="text-right text-xs text-green-600 dark:text-green-400 font-bold mt-1">
              {{ (goal.currentAmount / goal.targetAmount) * 100 | number : '1.0-0' }}% concluído
            </p>
          </div>

          <div
            class="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50 mb-4 transition-colors"
          >
            <p class="text-xs text-blue-800 dark:text-blue-200">
              💡 Guarde
              <span class="font-bold">{{ getMonthlySuggestion(goal) | currency : 'BRL' }}</span> por
              mês para atingir a meta no prazo.
            </p>
          </div>

          <div class="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
            <button
              (click)="addMoney(goal, 100)"
              class="flex-1 py-2 text-xs font-bold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            >
              + R$ 100
            </button>
            <button
              (click)="addMoney(goal, 500)"
              class="flex-1 py-2 text-xs font-bold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 rounded hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
            >
              + R$ 500
            </button>
          </div>
        </div>
        } @empty {
        <div
          class="col-span-full py-12 text-center text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 transition-colors"
        >
          <p class="text-lg font-medium">Você ainda não tem metas.</p>
          <p class="text-sm">Clique em "+ Nova Meta" para começar a sonhar.</p>
        </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export class GoalsComponent {
  financialService = inject(FinancialService);

  confirmService = inject(ConfirmDialogService);
  toastService = inject(ToastService);

  showForm = signal(false);

  newGoal = {
    title: '',
    target: null as number | null,
    deadline: '',
  };

  add() {
    if (this.newGoal.title && this.newGoal.target && this.newGoal.deadline) {
      this.financialService.addGoal({
        title: this.newGoal.title,
        targetAmount: Number(this.newGoal.target),
        currentAmount: 0,
        deadline: new Date(this.newGoal.deadline),
      });

      this.newGoal = { title: '', target: null, deadline: '' };
      this.showForm.set(false);

      this.toastService.show('Meta criada com sucesso!', 'success');
    } else {
      this.toastService.show('Preencha todos os campos corretamente.', 'error');
    }
  }

  delete(id: string) {
    this.confirmService.confirm({
      title: 'Excluir Meta',
      message: 'Tem certeza que deseja desistir desta meta? Todo o progresso será perdido.',
      confirmText: 'Excluir Meta',
      cancelText: 'Manter',
      onConfirm: () => {
        this.financialService.removeGoal(id);
        this.toastService.show('Meta removida.', 'success');
      },
    });
  }

  addMoney(goal: Goal, amount: number) {
    const newVal = goal.currentAmount + amount;
    if (newVal <= goal.targetAmount) {
      this.financialService.updateGoalAmount(goal.id, newVal);
      this.toastService.show(`+ R$ ${amount} adicionado à meta!`, 'success');
    } else {
      this.financialService.updateGoalAmount(goal.id, goal.targetAmount);
      this.toastService.show('Parabéns! Meta atingida! 🎉', 'success');
    }
  }

  getMonthlySuggestion(goal: Goal): number {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const monthsLeft =
      (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth());

    const remainingAmount = goal.targetAmount - goal.currentAmount;

    if (remainingAmount <= 0) return 0;
    if (monthsLeft <= 0) return remainingAmount;

    return remainingAmount / monthsLeft;
  }
}
