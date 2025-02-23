import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IngredientService } from '../../services/ingredient.service';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ingredient-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css']
})
export class IngredientFormComponent implements OnInit {
  ingredientForm: FormGroup;
  isEditMode = false;
  isLoading = false;
  ingredientId?: number;

  constructor(
    private route: ActivatedRoute,
    private ingredientService: IngredientService,
    private router: Router
  ) {
    this.ingredientForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z ]+$/)
      ]),
      quantity: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.ingredientId = +id;
      this.loadIngredient(this.ingredientId);
    }
  }

  private loadIngredient(id: number): void {
    this.isLoading = true;
    this.ingredientService.getIngredients().subscribe({
      next: (ingredients) => {
        const ingredient = ingredients.find(i => i.id === id);
        if (ingredient) {
          this.ingredientForm.patchValue(ingredient);
        }
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }

  onSubmit(): void {
    if (this.ingredientForm.valid) {
      const ingredientData = {
        name: this.ingredientForm.value.name!.trim(),
        quantity: this.ingredientForm.value.quantity!
      };

      if (this.isEditMode && this.ingredientId) {
        this.ingredientService.updateIngredient(this.ingredientId, ingredientData)
          .subscribe({
            next: () => {
              alert('Ingredient updated successfully!');
              this.router.navigate(['/ingredients']);
            },
            error: (err) => console.error('Update error:', err)
          });
      } else {
        this.ingredientService.addIngredient(ingredientData)
          .subscribe({
            next: () => {
              alert('Ingredient added successfully!');
              this.router.navigate(['/ingredients']);
            },
            error: (err) => console.error('Add error:', err)
          });
      }
    }
  }
}


