import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";

const NavBar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);

  const handleLogOut = () => {
    setCookies("access_token", JSON.stringify(""));
  };

  return (
    <nav>
      <div className="nav-wrapper teal lighten-2">
        {cookies.access_token.length > 0 ? (
          <ul id="nav-mobile" className="left hide-on-med-and-down">
            <li>
              <Link to="/">Recipes</Link>
            </li>
            <li>
              <Link to="/create-recipe">Create New Recipe</Link>
            </li>
            <li>
              <Link to="">My Favourite</Link>
            </li>
            <li onClick={handleLogOut}>
              <Link to="collapsible.html">Log Out</Link>
            </li>
          </ul>
        ) : (
          <ul id="nav-mobile" className="left hide-on-med-and-down">
            <li>
              <Link to="/">Recipes</Link>
            </li>
            <li>
              <Link to="/signin">Sign In</Link>
            </li>
            <li>
              <Link to="/signup">Sign Up</Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
