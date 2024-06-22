import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AppState } from '../../App';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AppState);

  if (loading) {
    // Show a loading indicator or spinner while checking authentication
    return <div>Loading...</div>;
  }

  if (!user || !user.username) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/auth" />;
  }

  // Render the children if the user is authenticated
  return children;
};

export default PrivateRoute;
