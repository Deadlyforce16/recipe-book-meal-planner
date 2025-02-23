import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { Ingredient } from '../models/ingredient';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  private apiUrl = 'http://localhost:3000/ingredients';

  constructor(private http: HttpClient) {}

  private parseQuantity(quantity: string): { quantity: number, unit: string } {
    const match = quantity.match(/(\d+\.?\d*)\s*(\D*)/);
    return {
      quantity: match ? parseFloat(match[1]) || 0 : 0,
      unit: match?.[2]?.trim() || ''
    };
  }

  getIngredients(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.apiUrl);
  }

  addIngredient(ingredient: Ingredient): Observable<Ingredient> {
    return this.getIngredients().pipe(
      switchMap((existingIngredients: Ingredient[]) => {
        const existing = existingIngredients.find((i: Ingredient) => 
          i.name.toLowerCase() === ingredient.name.toLowerCase()
        );
        
        if (existing) {
          const existingQty = this.parseQuantity(existing.quantity);
          const newQty = this.parseQuantity(ingredient.quantity);
          
          if (existingQty.unit === newQty.unit) {
            const total = existingQty.quantity + newQty.quantity;
            const updatedIngredient = {
              ...existing,
              quantity: `${total}${existingQty.unit ? ' ' + existingQty.unit : ''}`
            };
            return this.http.put<Ingredient>(`${this.apiUrl}/${existing.id}`, updatedIngredient);
          }
        }
        return this.http.post<Ingredient>(this.apiUrl, ingredient);
      }),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => new Error('Failed to add ingredient.'));
      })
    );
  }

  deleteIngredient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateIngredient(id: number, ingredient: Ingredient): Observable<Ingredient> {
    return this.http.put<Ingredient>(`${this.apiUrl}/${id}`, ingredient);
  }
}

