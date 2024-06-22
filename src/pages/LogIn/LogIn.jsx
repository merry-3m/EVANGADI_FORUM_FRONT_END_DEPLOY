import React, { useContext, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import classes from "./login.module.css";
import axios from "../../axiosConfig";
import { PropagateLoader } from "react-spinners";

import ShowPassword from "../../component/context/ShowPassword";
import { AppState } from "../../App";
import { toast } from "react-toastify";

const LogIn = ({ setIsLogin }) => {
  const { setUser } = useContext(AppState);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const passwordRef = useRef("");
  const emailRef = useRef("");
  const { toggleVisibility, Icon, InputType } = ShowPassword();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const emailValue = emailRef.current.value;
    const passwordValue = passwordRef.current.value;

    if (!emailValue || !passwordValue) {
      toast("Please fill in all the fields");
      return;
    }

    setIsLoading(true);

    try {
      const { data } = await axios.post("/users/login", {
        email: emailValue,
        password: passwordValue,
      });

      localStorage.setItem("token", data.token);
      setIsLoading(false);
      navigate("/"); // Redirect to home page
    } catch (error) {
      setIsLoading(false);
      toast(error?.response?.data.msg);
     
      // console.error("Login error:", error);
    }
  };

  return (
    <section className={classes.login_section}>
      <div className={classes.login_container}>
        {isLoading ? (
          <div className={classes.loader_container}>
            <PropagateLoader color="#ff8500" />
          </div>
        ) : (
          <>
            <div className={classes.login_msg}>
              Please log in to your account first
            </div>
            <div className={classes.login_text}>
              <h3>Log in to your account</h3>
              <p>
                Don't have an account?{" "}
                <Link onClick={() => setIsLogin(false)}>
                  Create a new account
                </Link>
              </p>
              <p>
                Forgot your password?{" "}
                <Link to="/reset-password">Reset Password</Link>
              </p>
            </div>
            <form onSubmit={handleLoginSubmit} className={classes.form}>
              <div className={classes.form_group}>
                <input
                  ref={emailRef}
                  type="email"
                  id="email"
                  placeholder="Email"
                  className={classes.full_width}
                />
              </div>
              <div className={classes.form_group}>
                <div className={classes.password_container}>
                  <input
                    ref={passwordRef}
                    type={InputType}
                    placeholder="Password"
                    className={classes.password_input}
                  />
                  <span
                    onClick={toggleVisibility}
                    className={classes.password_icon}
                  >
                    {Icon}
                  </span>
                </div>
              </div>
              <div className={classes.button_wrapper}>
                <button
                  type="submit"
                  className={`${classes.button} ${classes.full_width}`}
                >
                  Log In
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
};

export default LogIn;
