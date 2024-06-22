import React, { useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import classes from "./register.module.css";

// ` axios from our file
import axios from "../../axiosConfig";
import ShowPassword from "../../component/context/ShowPassword";
import { toast } from "react-toastify";

const Register = ({ setIsLogin }) => {
  // ` to navigate
  const navigate = useNavigate();

  // ` to store the input data
  const userName = useRef("");
  const firstName = useRef("");
  const lastName = useRef("");
  const password = useRef("");
  const email = useRef("");

  async function handleSubmit(e) {
    e.preventDefault();
    // console.log(userName.current.value); //` to access the data

    //` Access the data from refs
    const usernameValue = userName.current.value;
    const firstnameValue = firstName.current.value;
    const lastnameValue = lastName.current.value;
    const emailValue = email.current.value;
    const passwordValue = password.current.value;

    //` Check if all fields are filled
    if (
      !usernameValue ||
      !firstnameValue ||
      !lastnameValue ||
      !emailValue ||
      !passwordValue
    ) {
      toast("Please fill in all the fields");
      return;
    }

    try {
      //` post request (to send the data to the back end)
      await axios.post("/users/register", {
        // # store the input value in the db(by using their name from db)
        username: usernameValue,
        firstname: firstnameValue,
        lastname: lastnameValue,
        email: emailValue,
        password: passwordValue,
      });
      toast("Registration Successful. Please login");
      //` Switch to login form on successful registration
      setIsLogin(true);
    } catch (error) {
      toast(error?.response?.data.msg);
      console.log(error.response); //` if there is no input in the form
    }
  }

  // ` import show password functionality
  const { toggleVisibility, Icon, InputType } = ShowPassword();

  return (
    <section>
      <div className={classes.register_container}>
        <div className={classes.form_text}>
          <h3>Join the network</h3>
          <p>
            Already have an account?
            <Link onClick={() => setIsLogin(true)}>Sign in</Link>
          </p>
        </div>
        <form className={classes.form} onSubmit={handleSubmit}>
          <div className={classes.form_group}>
            <input
              ref={email}
              type="email"
              placeholder="Email"
              className={classes.full_width}
            />
          </div>
          <div className={`${classes.form_group} ${classes.name_fields}`}>
            <input
              ref={firstName}
              type="text"
              placeholder="First Name"
              className={classes.half_width}
            />
            <input
              ref={lastName}
              type="text"
              placeholder="Last Name"
              className={classes.half_width}
            />
          </div>
          <div className={classes.form_group}>
            <input
              ref={userName}
              type="text"
              placeholder="Username"
              className={classes.full_width}
            />
          </div>
          <div className={classes.form_group}>
            <div className={classes.password_container}>
              <input
                ref={password}
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
          <button type="submit" className={classes.full_width}>
            Agree and Join
          </button>
        </form>
        <div className={classes.termPrivacy_container}>
          <p>
            I agree to the <Link>privacy policy</Link> and{" "}
            <Link>terms of service</Link>
          </p>
        </div>
        <div className={classes.alreadyAccount_container}>
          <Link onClick={() => setIsLogin(true)}>Already have an account?</Link>
        </div>
      </div>
    </section>
  );
};

export default Register;
