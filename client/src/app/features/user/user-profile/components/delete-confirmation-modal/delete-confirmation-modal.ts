import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation-modal',
  imports: [],
  templateUrl: './delete-confirmation-modal.html',
  styleUrl: './delete-confirmation-modal.css'
})
export class DeleteConfirmationModal {
  
  resourceType = input<string>('');
  resourceName = input<string>('');
  
  confirm = output<void>();
  cancel = output<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}
