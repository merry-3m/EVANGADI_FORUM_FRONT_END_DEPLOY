import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./notFound.css"
import { AppState } from '../../App';

const NotFound = () => {
  const navigate = useNavigate();
  // ` import user
  const {user } = useContext(AppState)

  useEffect(() => {
    // Redirect to the auth page after 3 seconds
    const timer = setTimeout(() => {
      if(user){ 
        navigate('/');
      }else{
      navigate('/auth');
      }
    }, 3000);

    // Clean up the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="not-found-container">
      <h1>404 - Page Not Found</h1>
      <p>Redirecting to the {user ?  'home' : 'auth'}  page...</p>
    </div>
  );
};

export default NotFound;
