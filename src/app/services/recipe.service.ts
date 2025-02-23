import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from '../models/recipe';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/recipes';

  constructor(private http: HttpClient) {}

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.apiUrl);
  }

  getRecipe(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${recipe.id}`, recipe);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<string[]> {
    return this.getRecipes().pipe(
      map(recipes => [
        ...new Set(
          recipes
            .filter(r => r.category)
            .map(r => r.category!)
        )
      ])
    );
  }

  toggleFavorite(recipeId: number): Observable<Recipe> {
    return this.getRecipe(recipeId).pipe(
      switchMap((recipe: Recipe) => {
        const updated = { ...recipe, isFavorite: !recipe.isFavorite };
        return this.http.patch<Recipe>(`${this.apiUrl}/${recipeId}`, updated);
      })
    );
  }
}
