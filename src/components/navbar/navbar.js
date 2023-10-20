import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useGetUserID } from "../../hooks/useGetUserID";

const NavBar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigation = useNavigate();
  const user = useGetUserID();

  const handleLogOut = () => {
    setCookies("access_token", JSON.stringify(""));
    window.localStorage.removeItem("userID");

    navigation("/");
  };

  return (
    <nav className="text-blue-500 bg-black w-screen">
      <div className="nav-wrapper teal lighten-2 w-full ">
        {cookies.access_token?.length > 0 ? (
          <ul
            id="nav-mobile"
            className="hide-on-med-and-down flex  w-full items-center justify-center "
          >
            <li>
              <Link to="/">Recipes</Link>
            </li>
            <li>
              <Link to="/create-recipe">Create New Recipe</Link>
            </li>
            <li>
              <Link to="/fav-recipe">My Favourite</Link>
            </li>
            <li onClick={handleLogOut}>
              <Link>Log Out</Link>
            </li>
            <li>
              <Link>
                <img
                  src={JSON.parse(user).avatar}
                  alt=""
                  className="w-10 h-10 rounded-full mr-4"
                />
              </Link>
            </li>
          </ul>
        ) : (
          <ul
            id="nav-mobile"
            className=" hide-on-med-and-down flex  w-full items-center justify-center "
          >
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
