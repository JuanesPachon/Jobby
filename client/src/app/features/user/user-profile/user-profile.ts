import { Component } from '@angular/core';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-profile', standalone: true,
  imports: [DashboardNavbar, RouterLink, CommonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export default class UserProfile {

  userExperiences: { title: string; period: string }[] = [
    { title: 'Auxiliar El Prado', period: '2020 - 2023' },
    { title: 'Auxiliar El Prado', period: '2018 - 2020' }
  ];

  userDocuments: { name: string }[] = [
    { name: 'HojaDeVida.pdf' },
    { name: 'Antecedentes.pdf' }
  ];

  userSkills: string[] = ["JavaScript", "TypeScript", "Angular", "React", "Node.js", "Python", "HTML/CSS", "Git"];

}



