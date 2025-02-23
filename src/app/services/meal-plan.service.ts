import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MealPlan } from '../models/meal-plan';

@Injectable({
  providedIn: 'root',
})
export class MealPlanService {
  private apiUrl = 'http://localhost:3000/mealPlans';

  constructor(private http: HttpClient) {}

  getMealPlans(): Observable<MealPlan[]> {
    return this.http.get<MealPlan[]>(this.apiUrl);
  }

  getMealPlan(id: number): Observable<MealPlan> {
    return this.http.get<MealPlan>(`${this.apiUrl}/${id}`);
  }

  addMealPlan(mealPlan: MealPlan): Observable<MealPlan> {
    return this.http.post<MealPlan>(this.apiUrl, mealPlan);
  }

  updateMealPlan(mealPlan: MealPlan): Observable<MealPlan> {
    return this.http.put<MealPlan>(`${this.apiUrl}/${mealPlan.id}`, mealPlan);
  }

  deleteMealPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
