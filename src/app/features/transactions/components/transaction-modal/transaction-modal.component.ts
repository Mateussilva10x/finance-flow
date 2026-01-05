import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FinancialService } from '../../../../core/services/financial.service';

@Component({
  selector: 'app-transaction-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-modal.component.html',
  styleUrls: ['./transaction-modal.component.scss'],
})
export class TransactionModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private financialService = inject(FinancialService);

  constructor() {}

  ngOnInit() {}

  transactionForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    type: ['expense', Validators.required],
    category: ['Outros', Validators.required],
    date: [new Date().toISOString().substring(0, 10), Validators.required],
  });

  isInvalid(controlName: string): boolean {
    const control = this.transactionForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;

      this.financialService.addTransaction({
        title: formValue.title!,
        amount: Number(formValue.amount),
        type: formValue.type as 'income' | 'expense',
        category: formValue.category!,
        date: new Date(formValue.date!),
      });

      this.close();
    }
  }

  close() {
    this.closeModal.emit();
  }
}
