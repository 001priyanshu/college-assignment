import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import RecipeCard from "./RecipeCard ";

export const Home = () => {
  const [cookies] = useCookies(["access_token"]);
  const [recipes, setRecipes] = useState([]);
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

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

  useEffect(() => {
    fetchRecipes();
  }, []);

  const isRecipeFavorite = (id) => favoriteRecipes.includes(id);

  const toggleFavorite = async (recipeID) => {
    try {
      if (isRecipeFavorite(recipeID)) {
        // Remove from favorites
        await axios.put(
          `http://localhost:5000/api/user/removeFavRecipe/${recipeID}`,
          {},
          {
            headers: { Authorization: cookies.access_token },
          }
        );
        setFavoriteRecipes((prevFavorites) =>
          prevFavorites.filter((id) => id !== recipeID)
        );
      } else {
        // Add to favorites
        await axios.put(
          `http://localhost:5000/api/user/addFavRecipe/${recipeID}`,
          {},
          {
            headers: { Authorization: cookies.access_token },
          }
        );
        setFavoriteRecipes([...favoriteRecipes, recipeID]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRecipe = async (recipeID) => {
    console.log(recipeID);
    try {
      await axios.delete(
        `http://localhost:5000/api/recipe/deleteRecipe/${recipeID}`,
        {
          headers: { authorization: cookies.access_token },
        }
      );
      fetchRecipes();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-center text-3xl font-sans font-bold mt-8">Recipes</h1>
      <div className="bg-gray-100 min-h-screen p-8 flex justify-center">
        <div className="space-y-8 flex flex-col w-1/3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              isFavorite={isRecipeFavorite(recipe._id)}
              onToggleFavorite={() => toggleFavorite(recipe._id)}
              onDelete={() => deleteRecipe(recipe._id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
