import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-cancel-task-modal',
  imports: [],
  templateUrl: './cancel-task-modal.html',
  standalone: true
})
export class CancelTaskModal {
  @Input() isOpen = signal<boolean>(false);
  @Input() isLoading = signal<boolean>(false);
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  handleConfirm(): void {
    this.onConfirm.emit();
  }

  handleCancel(): void {
    this.onCancel.emit();
  }

  handleBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.handleCancel();
    }
  }
}