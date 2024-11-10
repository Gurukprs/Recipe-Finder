// A-RecipeCard.js
import React from 'react';
import './A-RecipeCard.css'; // Import the CSS file specific to this component

const ARecipeCard = ({ recipe, onDelete }) => {
  return (
    <div className="a-recipe-card">
      <h3>{recipe.label}</h3>
      <img src={recipe.image} alt={recipe.label} className="recipe-img" />
      <p><strong>Calories:</strong> {recipe.calories}</p>
      <p><strong>Total Time:</strong> {recipe.totalTime} mins</p>
      <p><strong>Ingredients:</strong></p>
      <ul>
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <p><strong>Procedure:</strong> {recipe.procedure}</p>
      <button className="delete-btn" onClick={onDelete}>
        Delete Recipe
      </button>
    </div>
  );
};

export default ARecipeCard;
