import { Pipe, PipeTransform } from '@angular/core';
import { Recipe } from '../../models/recipe';

@Pipe({ name: 'filterRecipes' })
export class FilterRecipesPipe implements PipeTransform {
  transform(recipes: Recipe[], search: string, category: string): Recipe[] {
    if (!recipes) return [];
    return recipes.filter(recipe => {
      const matchesSearch = !search || 
        recipe.title.toLowerCase().includes(search.toLowerCase()) ||
        recipe.ingredients.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
      
      const matchesCategory = !category || recipe.category === category;
      
      return matchesSearch && matchesCategory;
    });
  }
}