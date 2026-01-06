import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (service.isOpen()) {
    <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        (click)="service.close()"
      ></div>

      <div
        class="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all scale-100 border border-gray-100 dark:border-gray-700"
      >
        <div class="flex flex-col items-center text-center">
          <div
            class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center text-2xl mb-4"
          >
            ⚠️
          </div>

          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {{ service.data()?.title }}
          </h3>

          <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {{ service.data()?.message }}
          </p>

          <div class="flex gap-3 w-full">
            <button
              (click)="service.close()"
              class="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {{ service.data()?.cancelText || 'Cancelar' }}
            </button>

            <button
              (click)="service.executeConfirm()"
              class="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 shadow-lg shadow-red-200 dark:shadow-none transition-colors"
            >
              {{ service.data()?.confirmText || 'Confirmar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    }
  `,
})
export class ConfirmDialogComponent {
  service = inject(ConfirmDialogService);
}
