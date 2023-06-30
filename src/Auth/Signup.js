import React, { useState } from "react";
import Parse from "../service/parseApi";
const Signup = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleSubmit = () => {
    Parse.User.signUp(input.email, input.password).then((res) => {
      console.log(res);
    });
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <input
        type="text"
        placeholder="Email"
        onChange={(e) => {
          setInput((prev) => {
            let tempVar = { ...prev };
            tempVar.email = e.target.value;
            return tempVar;
          });
        }}
      />
      <input
        type="text"
        placeholder="Password"
        onChange={(e) => {
          setInput((prev) => {
            let tempVar = { ...prev };
            tempVar.password = e.target.value;
            return tempVar;
          });
        }}
      />
      <input
        type="text"
        placeholder="Confirm Password"
        onChange={(e) => {
          setInput((prev) => {
            let tempVar = { ...prev };
            tempVar.confirmPassword = e.target.value;
            return tempVar;
          });
        }}
      />
      <button onClick={handleSubmit}>Signup</button>
    </div>
  );
};

export default Signup;
