import React, { useEffect, useState } from "react";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useCookies } from "react-cookie";
import axios from "axios";

export const Home = () => {
  const [cookies] = useCookies(["access_token"]);
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  const userID = useGetUserID();

  const fetchRecipes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/recipe/getAllRecipes",
        {
          headers: { authorization: cookies.access_token },
        }
      );
      setRecipes(response.data.allRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchFavoriteRecipes = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/recipes/favoriteRecipes/ids/${userID}`
      );
      setFavoriteRecipes(response.data.favoriteRecipes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRecipes();
    // fetchFavoriteRecipes();
  }, []);

  const toggleFavorite = async (recipeID) => {
    try {
      if (isRecipeFavorite(recipeID)) {
        // Remove from favorites
        await axios.delete(
          `http://localhost:5000/api/user/removeFavRecipe/${recipeID}`,
          {
            data: { userID, recipeID },
          }
        );
        setFavoriteRecipes((prevFavorites) =>
          prevFavorites.filter((id) => id !== recipeID)
        );
      } else {
        // Add to favorites
        await axios.put(
          `http://localhost:5000/api/user/addFavRecipe/${recipeID}`,
          {
            recipeID,
            userID,
          }
        );
        setFavoriteRecipes([...favoriteRecipes, recipeID]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeFavorite = (id) => favoriteRecipes.includes(id);

  const deleteRecipe = async (recipeID) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/recipe/deleteRecipe/${recipeID}`
      );
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== recipeID)
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-center text-3xl font-sans font-bold mb-4">Recipes</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recipes.map((recipe) => (
          <div
            key={recipe._id}
            className="bg-white p-4 shadow rounded-lg transition-transform transform hover:scale-105"
          >
            <h2 className="text-lg font-semibold">{recipe.name}</h2>
            <p className="mt-2 text-gray-700">{recipe.description}</p>
            <h3 className="text-lg mt-2 font-semibold">Ingredients:</h3>
            <ul className="pl-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">
                  {ingredient}
                </li>
              ))}
            </ul>
            <img
              src={recipe.imageUrl}
              alt={recipe.name}
              className="mt-4 w-full h-40 object-cover"
            />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => toggleFavorite(recipe._id)}
                className={`px-4 py-2 rounded ${
                  isRecipeFavorite(recipe._id)
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                }`}
              >
                {isRecipeFavorite(recipe._id)
                  ? "Remove Favorite"
                  : "Add to Favorites"}
              </button>
              <button
                onClick={() => deleteRecipe(recipe._id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};