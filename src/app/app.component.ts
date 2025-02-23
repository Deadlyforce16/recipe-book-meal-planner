import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>Recipe Book & Meal Planner</span>
      <nav>
        <a mat-button routerLink="/recipes">Recipes</a>
        <a mat-button routerLink="/meal-planner">Meal Planner</a>
        <a mat-button routerLink="/shopping-list">Shopping List</a>
        <a mat-button routerLink="/ingredients">Ingredients</a>
      </nav>
    </mat-toolbar>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      mat-toolbar {
        display: flex;
        justify-content: space-between;
      }
      nav {
        display: flex;
        gap: 10px;
      }
    `,
  ],
})
export class AppComponent {
  title = 'recipe-book-meal-planner';
}
