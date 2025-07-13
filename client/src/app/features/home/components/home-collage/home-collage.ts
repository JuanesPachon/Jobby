import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-collage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-collage.html',
  styleUrls: ['./home-collage.css']
})
export class HomeCollage {
  activeTab: number = 0;

  setTab(tabNumber: number): void {
    if (this.activeTab === tabNumber) {
      this.activeTab = 0;
    } else {
      this.activeTab = tabNumber;
    }
  }
}