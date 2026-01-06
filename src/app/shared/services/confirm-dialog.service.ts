import { Injectable, signal } from '@angular/core';

export interface ConfirmData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  isOpen = signal(false);
  data = signal<ConfirmData | null>(null);

  confirm(data: ConfirmData) {
    this.data.set(data);
    this.isOpen.set(true);
  }

  close() {
    this.isOpen.set(false);
    this.data.set(null);
  }

  executeConfirm() {
    const data = this.data();
    if (data && data.onConfirm) {
      data.onConfirm();
    }
    this.close();
  }
}
