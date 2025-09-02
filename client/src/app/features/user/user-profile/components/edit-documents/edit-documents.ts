import { Component, output } from '@angular/core';

@Component({
  selector: 'app-edit-documents',
  imports: [],
  templateUrl: './edit-documents.html',
  styleUrl: './edit-documents.css'
})
export class EditDocuments {

  close = output();

  closeModal(): void {
    this.close.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }

}
