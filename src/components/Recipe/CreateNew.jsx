import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { storage } from "../firebase/firebase.init";
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";

 const CreateNew = () => {
  const [cookies, _] = useCookies(["access_token"]);
  const [recipe, setRecipe] = useState({
    name: "",
    description: "",
    ingredients: [],
    instructions: "",
    imageUrl: "",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    const val = name === "photo" ? event.target.files[0] : value;
    setRecipe({ ...recipe, [name]: val });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    const ingredients = [...recipe.ingredients, ""];
    setRecipe({ ...recipe, ingredients });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      if (recipe.photo !== null) {
        const imageRef = ref(storage, `images/${recipe.photo.name}`);
        const url = await getDownloadURL(imageRef);

        setRecipe({ ...recipe, imageUrl: url });

        await axios.post(
          "http://localhost:5000/api/recipe/createRecipe",
          { ...recipe },
          {
            headers: { authorization: cookies.access_token },
          }
        );

        alert("Recipe Created");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={recipe.name}
          onChange={handleChange}
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={recipe.description}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="ingredients">Ingredients</label>
        {recipe.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            name="ingredients"
            value={ingredient}
            onChange={(event) => handleIngredientChange(event, index)}
          />
        ))}
        <button type="button" onClick={handleAddIngredient}>
          Add Ingredient
        </button>
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="imageUrl">Image URL</label>
        <input
          onChange={handleChange}
          type="file"
          accept="image/*"
          name="photo"
        />

        <button type="submit">Create Recipe</button>
      </form>
    </div>
  );
};

export default CreateNew;