import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RecipeService } from '../../services/recipe.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    RouterLink
  ],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  isEditMode = false;
  recipeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: this.fb.array([]),
      instructions: this.fb.array([]),
      cookingTime: [null, [Validators.required, Validators.min(0)]],
      difficulty: ['', Validators.required],
      imageUrl: ['', Validators.required],
      category: [''],
      isFavorite: [false]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.recipeId = +id;
      this.recipeService.getRecipe(+id).subscribe((recipe) => {
        this.recipeForm.patchValue({
          title: recipe.title,
          description: recipe.description,
          cookingTime: recipe.cookingTime,
          difficulty: recipe.difficulty,
          imageUrl: recipe.imageUrl,
          category: recipe.category,
          isFavorite: recipe.isFavorite
        });

        while (this.ingredients.length) this.ingredients.removeAt(0);
        while (this.instructions.length) this.instructions.removeAt(0);

        recipe.ingredients.forEach(ing => this.addIngredient(ing));
        recipe.instructions.forEach(inst => this.addInstruction(inst));
      });
    }

    this.recipeForm.get('cookingTime')?.valueChanges.subscribe(value => {
      if (value !== null && value !== undefined) {
        const formattedValue = Math.abs(Math.round(Number(value)));
        this.recipeForm.patchValue(
          { cookingTime: formattedValue },
          { emitEvent: false }
        );
      }
    });
  }

  validateNumberInput(event: KeyboardEvent): boolean {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (allowedKeys.includes(event.key) || 
        (event.key >= '0' && event.key <= '9')) {
      return true;
    }
    event.preventDefault();
    return false;
  }

  get ingredients(): FormArray {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructions(): FormArray {
    return this.recipeForm.get('instructions') as FormArray;
  }

  addIngredient(ingredient: { name: string; quantity: string } | null = null): void {
    this.ingredients.push(
      this.fb.group({
        name: [ingredient?.name || '', Validators.required],
        quantity: [ingredient?.quantity || '', Validators.required],
      })
    );
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  addInstruction(instruction: string | null = null): void {
    this.instructions.push(this.fb.control(instruction || '', Validators.required));
  }

  removeInstruction(index: number): void {
    this.instructions.removeAt(index);
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      const recipe = this.recipeForm.value;
      if (this.isEditMode && this.recipeId) {
        this.recipeService.updateRecipe({ ...recipe, id: this.recipeId }).subscribe(() => {
          this.router.navigate(['/recipes']);
        });
      } else {
        this.recipeService.addRecipe(recipe).subscribe(() => {
          this.router.navigate(['/recipes']);
        });
      }
    }
  }
}