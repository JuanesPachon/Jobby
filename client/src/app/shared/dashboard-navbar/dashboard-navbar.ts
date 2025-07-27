import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-dashboard-navbar',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dashboard-navbar.html',
  styleUrl: './dashboard-navbar.css'
})
export class DashboardNavbar {
  isDropdownOpen = false;

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
}