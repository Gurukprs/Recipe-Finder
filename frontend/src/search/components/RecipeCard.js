// RecipeCard.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';

const RecipeCard = ({ recipe, userId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const removeLinks = (htmlString) => {
    return htmlString.replace(/<a[^>]*>(.*?)<\/a>/g, '$1');
  };

  const addToWishlist = async () => {
    try {
      await axios.post('http://localhost:5000/wishlist/add', { userId, recipeId: recipe._id });
      setWishlistAdded(true);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <>
      {/* Overlay background when expanded */}
      {isExpanded && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 10,
          }}
          onClick={toggleExpansion}
        />
      )}

      <div
        style={{
          maxWidth: '400px',
          margin: '10px',
          padding: '20px',
          borderRadius: '10px',
          background: isExpanded ? '#ffffff' : 'rgba(255, 255, 255, 0.1)', // Opaque when expanded
          color: isExpanded ? '#000' : '#ffffff',
          boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          transition: 'all 0.4s ease', // Transition for smooth expansion
          opacity: isExpanded ? '1' : '0.9', // Opaque when expanded
          transform: isExpanded ? 'scale(1.05)' : 'scale(1)',
          position: isExpanded ? 'fixed' : 'relative', // Fixed position to move in front
          top: isExpanded ? '50%' : 'initial',
          left: isExpanded ? '50%' : 'initial',
          transform: isExpanded ? 'translate(-50%, -50%) scale(1.05)' : 'scale(1)',
          zIndex: isExpanded ? 11 : 1, // Bring expanded card to the front
          maxHeight: isExpanded ? '80vh' : 'auto', // Limit height to viewport when expanded
          overflowY: isExpanded ? 'auto' : 'visible', // Enable scrolling in expanded mode
        }}
      >
        <h3>{recipe.label}</h3>
        <img src={recipe.image} alt={recipe.label} style={{ width: '100%', borderRadius: '5px' }} />
        <p>Calories: {Math.round(recipe.calories)} kcal</p>
        <p>Total Time: {recipe.totalTime ? `${recipe.totalTime} minutes` : 'N/A'}</p>
        <button 
          onClick={addToWishlist} 
          onMouseEnter={(e) => {
            e.target.querySelector('i').style.color = 'red'; // Change to desired hover color
          }}
          onMouseLeave={(e) => {
            e.target.querySelector('i').style.color = '#ddd'; // Original color
          }}
          style={{
            backgroundColor: '#333',
            color: '#ddd',
            border: 'none',
            padding: '8px 12px',
            cursor: 'pointer',
            marginTop: '10px',
            transition: 'background-color 0.3s ease'
          }}
          disabled={wishlistAdded}
        >
          <i className={`fa${wishlistAdded ? 's' : 'r'} fa-heart`}></i>
          {wishlistAdded ? ' Added to Wishlist' : ' Add to Wishlist'}
        </button>
        <button 
          onClick={toggleExpansion} 
          style={{
            backgroundColor: '#555',
            color: '#ddd',
            border: 'none',
            padding: '8px 12px',
            cursor: 'pointer',
            marginTop: '10px',
            marginLeft: '0px',
            transition: 'background-color 0.3s ease'
          }}
        >
          {isExpanded ? 'Close' : 'View More'}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
        <div className="expanded-content">
          <h3>Ingredients:</h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient.text || ingredient}</li>
            ))}
          </ul>
          <h3>Procedure:</h3>
          <p dangerouslySetInnerHTML={{ __html: removeLinks(recipe.procedure) || 'No instructions available.' }}></p>
          <p><strong>Total Time:</strong> {recipe.totalTime ? `${recipe.totalTime} minutes` : 'N/A'}</p>
          <p><strong>Calories:</strong> {Math.round(recipe.calories)}</p>
        </div>
)}
      </div>
    </>
  );
};

export default RecipeCard;
