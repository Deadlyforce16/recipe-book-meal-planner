import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MealPlanService } from '../../services/meal-plan.service';
import { RecipeService } from '../../services/recipe.service';
import { ShoppingListService } from '../../services/shopping-list.service'; // Add this import
import { CdkDragDrop, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { Recipe } from '../../models/recipe';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CdkDrag,
    CdkDropList,
    MatIconModule
  ],
  templateUrl: './meal-planner.component.html',
  styleUrls: ['./meal-planner.component.css'],
})
export class MealPlannerComponent {
  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  meals = ['Breakfast', 'Lunch', 'Dinner'];
  mealPlan: any = { meals: {} };
  recipes: any[] = [];

  constructor(
    private mealPlanService: MealPlanService,
    private recipeService: RecipeService,
    private shoppingListService: ShoppingListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecipes();
    this.loadMealPlan();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe((data) => {
      this.recipes = data;
      console.log('Recipes:', this.recipes);
    });
  }

  loadMealPlan(): void {
    this.mealPlanService.getMealPlans().subscribe((data) => {
      if (data.length > 0) {
        this.mealPlan = data[0];
      } else {
        this.initializeMealPlan();
      }
    });
  }

  initializeMealPlan(): void {
    this.daysOfWeek.forEach((day) => {
      this.mealPlan.meals[day] = {
        Breakfast: null,
        Lunch: null,
        Dinner: null,
      };
    });
    console.log('Initialized Meal Plan:', this.mealPlan);
  }

  drop(event: CdkDragDrop<any>, day: string, meal: string): void {
    if (event.previousContainer !== event.container) {
      const recipe: Recipe = event.item.data;
  
      if (!this.mealPlan.meals[day]) {
        this.mealPlan.meals[day] = {};
      }
  
      this.mealPlan.meals[day][meal] = recipe;
      this.saveMealPlan();
      this.mealPlan = { ...this.mealPlan };
    }
  }

  saveMealPlan(): void {
    if (this.mealPlan.id) {
      this.mealPlanService.updateMealPlan(this.mealPlan).subscribe();
    } else {
      this.mealPlanService.addMealPlan(this.mealPlan).subscribe((data) => {
        this.mealPlan.id = data.id;
      });
    }
  }

  clearMealSlot(day: string, meal: string): void {
    this.mealPlan.meals[day][meal] = null;
    this.saveMealPlan();
  }

  getDayMealIds(): string[] {
    return this.daysOfWeek.flatMap(day => 
      this.meals.map(meal => `${day}-${meal}`)
    );
  }

  getRecipeName(recipeId: number): string {
    const recipe = this.recipes.find((r) => r.id === recipeId);
    return recipe ? recipe.title : 'Unknown Recipe';
  }

  getConnectedDropLists(): string[] {
    return this.daysOfWeek.flatMap(day => 
      this.meals.map(meal => `${day}-${meal}`)
    );
  }

  onDragEnter() {
    document.body.style.cursor = 'copy';
  }
  
  onDragExit() {
    document.body.style.cursor = 'move';
  }

  generateShoppingList(): void {
    this.mealPlanService.getMealPlans().subscribe({
      next: (mealPlans) => {
        console.log('Raw meal plans:', mealPlans);
        
        const validPlans = mealPlans.filter(plan => 
          plan.meals && Object.keys(plan.meals).length > 0
        );
  
        if (validPlans.length === 0) {
          alert('No meal plans found!');
          return;
        }
  
        this.shoppingListService.generateShoppingList(validPlans).subscribe({
          next: () => {
            alert('Shopping list generated successfully!');
            this.loadMealPlan();
          },
          error: (err) => {
            console.error('Generation error:', err);
            alert('Error generating list. Check console for details.');
          }
        });
      },
      error: (err) => {
        console.error('Meal plans fetch error:', err);
        alert('Error loading meal plans!');
      }
    });
  }
}

