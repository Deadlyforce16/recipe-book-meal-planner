# Recipe Book and Meal Planner Application

This project was developed using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.4 as the frontend and JSON Server as the backend in Visual Studio Code. It allows users to manage recipes, plan meals, generate shopping lists efficiently and manage ingredients.

## How to run it:

1. Clone or download the repository:

```
git clone <github url>
cd recipe-book-meal-planner
```
2. Install the necessary dependencies:
```
npm install
```
3. In one terminal start the JSON Server:
```
node server
```
you can access it on http://localhost:3000

4. In another terminal start the development server:
```
ng serve
```
5. Access the web application via http://localhost:4200

## Features:

### Recipe Management:
- Add, edit, delete, and view recipes.
- Switch between list and grid view.
- Search recipes by name.
- Sort and filter recipes by category, cooking time and difficulty.
- Mark favorite recipes.

### Meal Planning:
- Drag and drop available recipes into a weekly meal planner.
- Assign recipes to breakfast, lunch, or dinner(from top to bottom).
- Generate a shopping list based on the assigned recipes.
- Clear meal slots when needed.

### Shopping List:
- Mark items as purchased.
- Delete items.
- Transfer purchased items to your ingredient inventory.

### Ingredients Management:
- Add, edit, and delete ingredients.

## Known Issues:
- Meal plans may not persist after a page refresh.
- Some UI elements could be improved.
- Recipe images require a valid URL.

## Technologies Used:
- Visual Studio Code
- Angular
- JSON Server
- Typescript
- Javascript
- HTML
- CSS

## Author:
Marko Micovski (ID)
