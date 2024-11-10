import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './dash.css'; // Custom CSS for additional styling
import { useNavigate } from 'react-router-dom';
//import RecipeCard from './RecipeCard';
import lg from './components/admin3.gif';
import ARC from './A-RecipeCard';
// import ParticleBackground from'./components/ParticleBackground.jsx';

const Dashboard = () => {
  const [recipes, setRecipes] = useState([]); // Holds recipe data
  const [formData, setFormData] = useState({
    label: '',
    image: '',
    totalTime: '',
    calories: '',
    ingredients: [''],
    procedure: '',
  });
  const [message, setMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes(); // Fetches recipes on initial load
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await axios.get('https://recipe-finder-zu80.onrender.com/recipes');
      setRecipes(res.data); // Update recipes state with fetched data
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleIngredientChange = (e, index) => {
    const updatedIngredients = formData.ingredients.map((ingredient, i) =>
      i === index ? e.target.value : ingredient
    );
    setFormData({
      ...formData,
      ingredients: updatedIngredients,
    });
  };

  const handleAddIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, ''],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://recipe-finder-zu80.onrender.com/recipes', formData);
      setMessage(res.data.message || 'Recipe saved successfully!');
      fetchRecipes(); // Refresh recipes after adding a new recipe
      handleCloseForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error saving recipe');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    navigate('/');
  };

  const handleDelete = async (recipeId) => {
    try {
      await axios.delete(`https://recipe-finder-zu80.onrender.com/recipes/${recipeId}`);
      setMessage('Recipe deleted successfully!');
      fetchRecipes(); // Refresh recipes after deletion
    } catch (error) {
      setMessage('Error deleting recipe');
    }
  };

  const handleAddRecipeClick = () => {
    setShowForm(true);
    setMessage('');
    document.body.classList.add('modal-open');
  };

  const handleCloseForm = () => {
    setTimeout(() => {
      setShowForm(false);
      setFormData({
        label: '',
        image: '',
        totalTime: '',
        calories: '',
        ingredients: [''],
        procedure: '',
      });
      document.body.classList.remove('modal-open');
    }, 300);
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img src={lg} alt="Logo" className="navbar-logo me-2" /> 
            <span>Recipe Admin</span>
          </a>

          <div className="mx-auto text-center">
            <h1 className="navbar-title mb-0">Recipe Dashboard</h1>
          </div>

          <button className="btn btn-outline-light ms-auto" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-wrapper mt-4">
        <h1 className="text-center mb-4">Welcome to the Recipe Dashboard</h1>
        <p className="lead text-center">
          Discover, add, and manage your recipes with ease. Here, you can create, view, and organize recipes to share with your friends and family.
        </p>

        <div className="d-flex justify-content-center mb-4">
          <button className="btn btn-success add-recipe-button" onClick={handleAddRecipeClick}>
            Add Recipe
          </button>
        </div>

        <div className="row">
        {recipes.map((recipe) => (
          <div className="col-md-4" key={recipe._id}>
            <ARC 
              recipe={recipe} 
              onDelete={() => handleDelete(recipe._id)} 
            />
          </div>
        ))}
      </div>
      </div>

      {showForm && (
        <div className="overlay-form">
          <div className="modal-content">
            <h2 className="text-center">Add a New Recipe</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Recipe Name</label>
                <input
                  type="text"
                  name="label"
                  className="form-control"
                  value={formData.label}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  name="image"
                  className="form-control"
                  value={formData.image}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="image-preview mt-2">
                {formData.image && <img src={formData.image} alt="Recipe Preview" className="img-fluid rounded" />}
              </div>
              <div className="form-group">
                <label>Total Time (minutes)</label>
                <input
                  type="number"
                  name="totalTime"
                  className="form-control"
                  value={formData.totalTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Calories</label>
                <input
                  type="number"
                  name="calories"
                  className="form-control"
                  value={formData.calories}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Ingredients</label>
                {formData.ingredients.map((ingredient, index) => (
                  <input
                    key={index}
                    type="text"
                    className="form-control mb-2"
                    value={ingredient}
                    onChange={(e) => handleIngredientChange(e, index)}
                    required
                  />
                ))}
                <button
                  type="button"
                  className="btn btn-secondary mt-2"
                  onClick={handleAddIngredient}
                >
                  Add Ingredient
                </button>
              </div>
              <div className="form-group">
                <label>Procedure</label>
                <textarea
                  name="procedure"
                  className="form-control"
                  value={formData.procedure}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-block">Save Recipe</button>
              <button
                type="button"
                className="btn btn-danger btn-block mt-2"
                onClick={handleCloseForm}
              >
                Close
              </button>
            </form>
            {message && <div className="alert alert-info mt-3 fade-in">{message}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
