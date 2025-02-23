import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { IngredientService } from './ingredient.service';

@Injectable({
  providedIn: 'root',
})
export class ShoppingListService {
  private apiUrl = 'http://localhost:3000/shoppingLists';

  constructor(
    private http: HttpClient,
    private ingredientService: IngredientService
  ) {}

  getShoppingList(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addItem(item: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, item);
  }

  updateItem(itemId: number, updatedItem: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${itemId}`, updatedItem);
  }

  deleteItem(itemId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${itemId}`);
  }

  generateShoppingList(mealPlans: any[]): Observable<any> {
    return this.clearShoppingList().pipe(
      switchMap(() => {
        const ingredientsMap = new Map<string, { quantity: number, unit: string }>();

        mealPlans.forEach(plan => {
          Object.values(plan.meals).forEach((day: any) => {
            Object.values(day).forEach((meal: any) => {
              if (meal?.ingredients) {
                meal.ingredients.forEach((ingredient: any) => {
                  const key = ingredient.name.toLowerCase();
                  const parsed = this.parseQuantity(ingredient.quantity);
                  
                  if (ingredientsMap.has(key)) {
                    const existing = ingredientsMap.get(key)!;
                    if (existing.unit === parsed.unit) {
                      ingredientsMap.set(key, {
                        quantity: existing.quantity + parsed.quantity,
                        unit: existing.unit
                      });
                    } else {
                      ingredientsMap.set(key, {
                        quantity: existing.quantity + parsed.quantity,
                        unit: existing.unit || parsed.unit
                      });
                    }
                  } else {
                    ingredientsMap.set(key, parsed);
                  }
                });
              }
            });
          });
        });

        const shoppingList = Array.from(ingredientsMap).map(([name, { quantity, unit }]) => ({
          name,
          quantity: `${quantity}${unit ? ' ' + unit : ''}`,
          purchased: false
        }));

        return this.http.post(this.apiUrl, shoppingList);
      })
    );
  }

  private parseQuantity(quantity: string): { quantity: number, unit: string } {
    const match = quantity.match(/(\d+\.?\d*)\s*(\D*)/);
    return {
      quantity: match ? parseFloat(match[1]) || 0 : 0,
      unit: match?.[2]?.trim() || ''
    };
  }

  private clearShoppingList(): Observable<void> {
    return this.getShoppingList().pipe(
      switchMap(items => {
        if (items.length === 0) return of(undefined);
        const deleteRequests = items.map(item => 
          this.http.delete(`${this.apiUrl}/${item.id}`)
        );
        return forkJoin(deleteRequests).pipe(map(() => undefined));
      })
    );
  }

  transferPurchasedItems(): Observable<any> {
    return this.getShoppingList().pipe(
      switchMap((items: any[]) => {
        const purchasedItems = items.filter(item => item.purchased);
        const transferRequests = purchasedItems.map(item => 
          this.ingredientService.addIngredient({ 
            name: item.name,
            quantity: item.quantity
          })
        );
        return forkJoin(transferRequests);
      })
    );
  }
}