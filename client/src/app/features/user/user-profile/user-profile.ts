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
}



