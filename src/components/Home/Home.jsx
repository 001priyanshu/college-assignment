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

  useEffect(() => {
    fetchRecipes();
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
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button onClick={() => toggleFavorite(recipe._id)}>
                {isRecipeFavorite(recipe._id)
                  ? "Remove Favorite"
                  : "Add to Favorites"}
              </button>
            </div>
            <div className="instructions">
              <p>{recipe.instructions}</p>
            </div>
            <img src={recipe.imageUrl} alt={recipe.name} />
            <button onClick={() => deleteRecipe(recipe._id)}>delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
