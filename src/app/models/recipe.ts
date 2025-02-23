export interface Recipe {
    id: string | number;
    title: string;
    description: string;
    ingredients: { name: string; quantity: string }[];
    instructions: string[];
    cookingTime: number;
    difficulty: string;
    imageUrl: string;
    category?: string;
    isFavorite?: boolean;
  }