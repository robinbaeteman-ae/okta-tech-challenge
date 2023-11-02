import React from "react";
import LoginButton from "../components/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";

const Login = () => {
  return (<>
    <p>Welcome to the Login page!</p>
    <LoginButton>Login</LoginButton>
  </>);
};

export default Login;