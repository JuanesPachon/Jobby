import { Component, output } from '@angular/core';

@Component({
  selector: 'app-edit-photo',
  imports: [],
  templateUrl: './edit-photo.html',
  styleUrl: './edit-photo.css'
})
export class EditPhoto {

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
