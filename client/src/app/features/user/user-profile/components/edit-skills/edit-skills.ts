import { Component, output } from '@angular/core';

@Component({
  selector: 'app-edit-skills',
  imports: [],
  templateUrl: './edit-skills.html',
  styleUrl: './edit-skills.css'
})
export class EditSkills {

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
