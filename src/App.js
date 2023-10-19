import { Routes, Route } from "react-router-dom";
import React from "react";
import SignIn from "./pages/Authentication/SignIn";
import SignUp from "./pages/Authentication/SignUp";
import { Landing } from "./pages/Home/Landing";
import Recipe from "./pages/CreateRecipe/Recipe";
function App() {
  return (
    <Routes>
      <Route path="/" exact element={<Landing />} />
      <Route path="/signup" exact element={<SignUp />} />
      <Route path="/signin" exact element={<SignIn />} />
      <Route path="/" exact element={<Landing />} />
      <Route path="/create-recipe" exact element={<Recipe />} />
      
    </Routes>
  );
}

export default App;
