import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IngredientService } from '../../services/ingredient.service';
import { Ingredient } from '../../models/ingredient';

@Component({
  selector: 'app-ingredient-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.css']
})
export class IngredientListComponent implements OnInit {
  ingredients: Ingredient[] = [];

  constructor(private ingredientService: IngredientService) {}

  ngOnInit(): void {
    console.log('Ingredient List Component Loaded!');
    this.loadIngredients();
  }

  loadIngredients(): void {
    this.ingredientService.getIngredients().subscribe(
      data => {
        console.log('Loaded Ingredients:', data);
        this.ingredients = data;
      },
      error => console.error('Error loading ingredients:', error)
    );
  }

  deleteIngredient(id: number): void {
      this.ingredientService.deleteIngredient(id).subscribe(
        () => {
          console.log(`Deleted ingredient with ID: ${id}`);
          this.loadIngredients();
        },
        error => console.error('Error deleting ingredient:', error)
      );
  }
}
