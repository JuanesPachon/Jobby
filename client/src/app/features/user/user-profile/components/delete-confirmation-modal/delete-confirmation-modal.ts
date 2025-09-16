import { Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [],
  templateUrl: './delete-confirmation-modal.html',
  styleUrl: './delete-confirmation-modal.css'
})
export class DeleteConfirmationModal {
  
  resourceType = input<string>('');
  resourceName = input<string>('');
  isDeleting = signal<boolean>(false);
  
  confirm = output<void>();
  cancel = output<void>();

  onConfirm(): void {
    if (this.isDeleting()) return;
    this.isDeleting.set(true);
    this.confirm.emit();
  }

  onCancel(): void {
    if (this.isDeleting()) return;
    this.cancel.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
