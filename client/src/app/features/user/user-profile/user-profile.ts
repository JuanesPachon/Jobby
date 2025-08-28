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
  /**
   * Lista de experiencias laborales del usuario. Cada objeto contiene el
   * título del puesto y el período trabajado. Se utiliza en la
   * plantilla con *ngFor para mostrar y administrar dinámicamente la
   * experiencia del usuario.
   */
  userExperiences: { title: string; period: string }[] = [
    { title: 'Auxiliar El Prado', period: '2020 - 2023' },
    { title: 'Auxiliar El Prado', period: '2018 - 2020' }
  ];

  /**
   * Lista de documentos adjuntos del usuario. Cada elemento sólo
   * contiene el nombre del archivo. Se pueden extender con
   * propiedades adicionales como URL de descarga.
   */
  userDocuments: { name: string }[] = [
    { name: 'HojaDeVida.pdf' },
    { name: 'Antecedentes.pdf' }
  ];
  





















userSkills: string[] = ["JavaScript", "TypeScript", "Angular", "React", "Node.js", "Python", "HTML/CSS", "Git"]

  // Method to open skills modal
  openSkillsModal(): void {
    // This will trigger the existing modal to open
    // The modal implementation is already done according to user
    console.log("Opening skills modal")
  }

  // Method to add new skill from modal
  addSkill(skillName: string): void {
    if (skillName && skillName.trim() && !this.userSkills.includes(skillName.trim())) {
      this.userSkills.push(skillName.trim())
    }
  }

  // Method to remove skill
  removeSkill(skillName: string): void {
    const index = this.userSkills.indexOf(skillName)
    if (index > -1) {
      this.userSkills.splice(index, 1)
    }
  }

  // Get only first 6 skills for display
  getDisplayedSkills(): string[] {
    return this.userSkills.slice(0, 6)
  }

  // Check if there are more skills than displayed
  hasMoreSkills(): boolean {
    return this.userSkills.length > 6
  }

  /**
   * Remove an experience by index from the userExperiences array.
   * Called from the template when the user clicks the delete button.
   */
  removeExperience(index: number): void {
    if (index >= 0 && index < this.userExperiences.length) {
      this.userExperiences.splice(index, 1)
    }
  }

  /**
   * Add a new experience entry to the userExperiences array.
   * In a real application these values would come from a form or modal.
   */
  addExperience(title: string, period: string): void {
    if (title && period) {
      this.userExperiences.push({
        title: title.trim(),
        period: period.trim()
      })
    }
  }

  /**
   * Remove a document by its index from the userDocuments array.
   * Called from the template when the user clicks the delete button.
   */
  removeDocument(index: number): void {
    if (index >= 0 && index < this.userDocuments.length) {
      this.userDocuments.splice(index, 1)
    }
  }

  /**
   * Add a new document to the userDocuments array.
   * In a real application this would handle file input and upload logic.
   */
  uploadDocument(fileName: string): void {
    if (fileName && fileName.trim()) {
      this.userDocuments.push({
        name: fileName.trim()
      })
    }
  }
}



