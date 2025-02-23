import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { RecipeService } from '../../services/recipe.service';
import { FilterRecipesPipe } from '../../shared/pipes/filter-recipes.pipe';
import { SortRecipesPipe } from '../../shared/pipes/sort-recipes.pipe';
import { Recipe } from '../../models/recipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    FilterRecipesPipe,
    SortRecipesPipe,
    RouterLink
  ],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  categories: string[] = [];
  viewMode: 'grid' | 'list' = 'grid';
  searchTerm = '';
  selectedCategory = '';
  sortBy = '';

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadRecipes();
    this.loadCategories();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe(data => this.recipes = data);
  }

  loadCategories(): void {
    this.recipeService.getCategories().subscribe(cats => this.categories = cats);
  }

  toggleFavorite(recipe: Recipe): void {
    this.recipeService.toggleFavorite(+recipe.id!).subscribe(() => {
      recipe.isFavorite = !recipe.isFavorite;
    });
  }

  deleteRecipe(id: number): void {
    this.recipeService.deleteRecipe(id).subscribe(() => this.loadRecipes());
  }
}
