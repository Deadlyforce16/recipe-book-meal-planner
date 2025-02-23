import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../../models/recipe';

@Pipe({ name: 'sortRecipes' })
export class SortRecipesPipe implements PipeTransform {
  transform(recipes: Recipe[], sortBy: string): Recipe[] {
    if (!recipes) return [];
    const sorted = [...recipes];
    const difficulties = ['Easy', 'Medium', 'Hard'];
    
    return sorted.sort((a, b) => {
      switch(sortBy) {
        case 'time': return a.cookingTime - b.cookingTime;
        case 'difficulty': 
          return difficulties.indexOf(a.difficulty) - difficulties.indexOf(b.difficulty);
        default: return 0;
      }
    });
  }
}
