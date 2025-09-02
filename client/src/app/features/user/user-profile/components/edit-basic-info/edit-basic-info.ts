import { Component, input, output } from '@angular/core';
import { UserData } from '../../../interfaces/userData.interface';

@Component({
  selector: 'app-edit-basic-info',
  imports: [],
  templateUrl: './edit-basic-info.html',
  styleUrl: './edit-basic-info.css'
})
export class EditBasicInfo {
  
  close = output();
  userData = input<UserData>();

  closeModal(): void {
    this.close.emit();
  }

  onOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeModal();
    }
  }
}
