import { Routes } from '@angular/router';
import { RecipeListComponent } from './components/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './components/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { MealPlannerComponent } from './components/meal-planner/meal-planner.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';
import { IngredientListComponent } from './components/ingredient-list/ingredient-list.component';
import { IngredientFormComponent } from './components/ingredient-form/ingredient-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'recipes', component: RecipeListComponent },
  { path: 'recipes/add', component: RecipeFormComponent },
  { path: 'recipes/:id', component: RecipeDetailComponent },
  { path: 'recipes/edit/:id', component: RecipeFormComponent },
  { path: 'meal-planner', component: MealPlannerComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'ingredients', component: IngredientListComponent },
  { path: 'ingredients/add', component: IngredientFormComponent },
  { path: 'ingredients/edit/:id', component: IngredientFormComponent }
];
