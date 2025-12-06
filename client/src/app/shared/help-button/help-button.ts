import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-button',
  standalone: true,
  imports: [],
  templateUrl: './help-button.html'
})
export class HelpButtonComponent {
  private router = inject(Router);

  navigateToHelp(): void {
    this.router.navigate(['/help']);
  }
}
