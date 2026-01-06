import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-5 right-5 z-[70] flex flex-col gap-2">
      @for (toast of service.toasts(); track toast.id) {
      <div
        class="px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-slide-in"
        [class.bg-green-600]="toast.type === 'success'"
        [class.text-white]="toast.type === 'success'"
        [class.bg-red-600]="toast.type === 'error'"
        [class.text-white]="toast.type === 'error'"
      >
        <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <p class="font-medium text-sm flex-1">{{ toast.message }}</p>
        <button (click)="service.remove(toast.id)" class="opacity-70 hover:opacity-100">✕</button>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .animate-slide-in {
        animation: slideIn 0.3s ease-out;
      }
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class ToastComponent {
  service = inject(ToastService);
}
