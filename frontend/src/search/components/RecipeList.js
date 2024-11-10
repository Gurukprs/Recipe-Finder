import React, { useEffect } from 'react';
import RecipeCard from './RecipeCard';
import './RecipeList.css';

const RecipeList = ({ recipes, userId }) => {
  useEffect(() => {
    const cards = document.querySelectorAll('.recipe-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    });
    cards.forEach((card) => observer.observe(card));
  }, []);

  return (
    <div className="recipe-list">
      {recipes && recipes.length > 0 ? (
        recipes.map((recipe) => (
          <RecipeCard key={recipe.uri || recipe._id} recipe={recipe} userId={userId} className="recipe-card" />
        ))
      ) : (
        <p>No recipes found. Please try another search.</p>
      )}
    </div>
  );
};

export default RecipeList;
