import React, { useState } from "react";
import axios from "../../axiosConfig";
import { useNavigate } from "react-router-dom";
import "./resetPassword.css";
import ShowPassword from "../../component/context/ShowPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { toggleVisibility, Icon, InputType } = ShowPassword();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/users/reset-password", { email, newPassword });
      toast("Password reset successful!");
      navigate("/auth"); // Redirect to login page after successful password reset
    } catch (error) {
      console.error("Error resetting password:", error);
      toast("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword} className="reset-password-form">
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="password-container">
          <input
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type={InputType}
            placeholder="New Password"
            className="password_input"
          />
          <span onClick={toggleVisibility} className="password_icon">
            {Icon}
          </span>
        </div>
        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
