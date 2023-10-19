import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faTrash,
  faList,
  faBook,
} from "@fortawesome/free-solid-svg-icons";

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
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-center p-8 text-4xl font-serif font-extrabold m-y-8 text-emerald-300">
        Recipes
      </h1>
      <div className="flex justify-center">
        <div className="space-y-8 w-full md:w-1/2">
          {recipes.map((recipe) => (
            <div
              key={recipe._id}
              className="bg-white p-4 shadow-lg rounded-lg transition-transform transform hover:scale-105"
            >
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => toggleFavorite(recipe._id)}
                  className={`px-4 py-2 rounded ${
                    isRecipeFavorite(recipe._id)
                      ? "bg-red-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <button
                  onClick={() => deleteRecipe(recipe._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-indigo-800">
                    {recipe.name}
                  </h2>
                  <p className="mt-2 text-gray-700">{recipe.description}</p>
                </div>
                <div>
                  <div className="text-right">
                    <FontAwesomeIcon
                      icon={faBook}
                      className="text-indigo-500 text-2xl"
                    />
                    <h3 className="text-lg mt-2 font-semibold text-indigo-800">
                      Instructions
                    </h3>
                    <p className="text-gray-700 text-lg">
                      {recipe.instructions}
                    </p>
                  </div>
                </div>
              </div>
              <hr className="my-4 border-t border-gray-300" />
              <div>
                <div className="text-right">
                  <FontAwesomeIcon
                    icon={faList}
                    className="text-indigo-500 text-2xl"
                  />
                  <h3 className="text-lg mt-2 font-semibold text-indigo-800">
                    Ingredients
                  </h3>
                  <ul className="pl-4 text-gray-700">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="text-lg">
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="mt-4 w-full h-96 object-cover rounded"
              />
                        
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
