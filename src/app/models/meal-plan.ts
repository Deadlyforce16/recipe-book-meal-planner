export interface MealPlan {
    id?: number;
    weekStartDate: string;
    meals: {
      [day: string]: {
        breakfast?: number;
        lunch?: number;
        dinner?: number;
      };
    };
  }