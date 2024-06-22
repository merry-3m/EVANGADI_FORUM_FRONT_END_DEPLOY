import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ShowPassword = () => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const Icon = visible ? <FaEye /> : <FaEyeSlash />;

  const InputType = visible ? "text" : "password";

  return { toggleVisibility, Icon, InputType };
};

export default ShowPassword;
