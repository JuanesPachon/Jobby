import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-navbar',
  imports: [NgClass, RouterLink],
  templateUrl: './home-navbar.html',
  styleUrl: './home-navbar.css'
})
export class HomeNavbar {

  menuOpen = signal(false);

  toggleMenu() {
    this.menuOpen.update(open => !open);
  }

}
