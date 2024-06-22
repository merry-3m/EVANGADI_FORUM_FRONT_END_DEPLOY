import { createContext, useEffect, useState } from "react";
import "./App.css";

import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "./axiosConfig";

import Routing from "./Router";
import LayOut from "./component/LayOut/LayOut";

import ResetPassword from "./pages/ResetPassword/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AppState = createContext();
function App() {
  const [user, setUser] = useState({});

  const navigate = useNavigate();
  // ` access token from local storage
  const token = localStorage.getItem("token");

  const checkUser = async () => {
    // ` to check if the user is logged in or not
    try {
      const response = await axios.get("/users/check", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // console.log(data);
      setUser(response.data);
    } catch (error) {
      console.log("Error", error.message);
      // navigate("/auth");
    }
  };

  // ` to protect the page
  useEffect(() => {
    checkUser();
  }, [navigate]);

  return (
    <AppState.Provider value={{ user, setUser }}>
      <ToastContainer theme="dark" />
      <LayOut>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/*" element={<Routing />} />
        </Routes>
      </LayOut>
    </AppState.Provider>
  );
}

export default App;
