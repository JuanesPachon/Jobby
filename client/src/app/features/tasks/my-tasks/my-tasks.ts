import { Component } from '@angular/core';
import { DashboardNavbar } from '../../../shared/dashboard-navbar/dashboard-navbar';
import { RouterLink } from '@angular/router';
import { HelpButtonComponent } from '../../../shared/help-button/help-button';

@Component({
    selector: 'app-my-tasks',
    standalone: true,
    imports: [DashboardNavbar, RouterLink, HelpButtonComponent],
    templateUrl: './my-tasks.html',
    styleUrl: './my-tasks.css',
})
export default class MyTasksComponent {}
