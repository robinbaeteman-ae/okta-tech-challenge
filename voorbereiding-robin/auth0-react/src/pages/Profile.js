import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "../components/LogoutButton";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (isAuthenticated) {
    return (
      <>
        <div>{ user.email }</div>
        <LogoutButton>Logout</LogoutButton>
      </>
    );
  } else {
    return (
      <>
        <p>You should login to see this screen!</p>
      </>
    );
  }
  
};

export default Profile;