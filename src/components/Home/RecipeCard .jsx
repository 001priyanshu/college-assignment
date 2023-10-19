import React from "react";

const RecipeCard = ({ recipe, isFavorite, onToggleFavorite, onDelete }) => {
  return (
    <div className="bg-white p-4 shadow rounded-lg transition-transform transform hover:scale-105">
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
        className="mt-4 w-full h-60 object-cover"
      />
      <div className="mt-4 flex justify-between">
        <button
          onClick={onToggleFavorite}
          className={`px-4 py-2 rounded ${
            isFavorite ? "bg-red-500 text-white" : "bg-green-500 text-white"
          }`}
        >
          {isFavorite ? "Remove Favorite" : "Add to Favorites"}
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
