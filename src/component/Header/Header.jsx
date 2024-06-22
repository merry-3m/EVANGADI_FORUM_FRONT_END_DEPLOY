import React, { useContext, useEffect, useState } from "react";
import classes from "./header.module.css";

import evanLogo from "../../assets/images/evangadi-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { AppState } from "../../App";
// import { AuthContext } from "../context/AuthContext";
const Header = () => {
  // # side bar state

  const [sidebar, setSidebar] = useState(false);
const navigate = useNavigate()

  const { user, setUser } = useContext(AppState);
  console.log(user);

  // # function to toggle the sidebar

  const toggleSidebar = () => {
    setSidebar(!sidebar);
  };

  //   ~ Function to remove the sidebar when it is clicked outside
  const closeSidebar = (e) => {
    if (
      !e.target.closest(`.${classes.sidebar}`) &&
      !e.target.closest(`.${classes.dropDown}`)
    ) {
      setSidebar(false);
    }
  };

  useEffect(() => {
    if (sidebar) {
      document.addEventListener("click", closeSidebar);
    } else {
      document.removeEventListener("click", closeSidebar);
    }
    return () => {
      document.removeEventListener("click", closeSidebar);
    };
  }, [sidebar]);

const handleLogOut = ()=> {
  localStorage.removeItem("token")
  navigate("/auth")
  setUser(null)
  
}

  return (
    <div>
      <header className={classes.header_container}>
        <div className={classes.logo}>
          <Link to="/">
            <img src={evanLogo} alt="Evangadi Logo" />
          </Link>
        </div>
        <div className={classes.dropDown} onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className={`${classes.sidebar} ${sidebar ? classes.open : ""}`}>
          <div className={classes.sidebar_overlay}></div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/">Community</Link>
            </li>

            {!user? (
            <Link to="/auth">
              <button>Sign In</button>
            </Link>
          ) : (
            <Link to="/auth">
              <button onClick={handleLogOut}>Log Out</button>
            </Link> 
          )}
          </ul>
        </div>
        <div className={classes.text_container}>
          <nav className={classes.text_nav}>
            <ul className="scrollnav">
              <li>
                <Link to="">Home</Link>
              </li>
              <li>
                <Link to="/">Community</Link>
              </li>
              <li>
               {/* sign in / log out based on the path */}
{!user? (
            <Link to="/auth">
              <button>Sign In</button>
            </Link>
          ) : (
            <Link to="/auth">
              <button onClick={handleLogOut}>Log Out</button>
            </Link> 
          )}
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default Header;
