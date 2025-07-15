import { Component } from '@angular/core';
import { HomeNavbar } from '../../shared/home-navbar/home-navbar';
import { HomeFooter } from '../../shared/home-footer/home-footer';
import { HomeRating } from './components/home-rating/home-rating';
import { HomeInfo } from './components/home-info/home-info';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [HomeNavbar, HomeFooter, HomeRating, HomeInfo, NgOptimizedImage],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {



}
