import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
 
const StudentRoute = ({ children }) => {
  const { isLoggedIn, user } = useContext(AuthContext);
 
  if (!isLoggedIn) {
    // Redirect them to the login page if not logged in
    return <Navigate to="/login" replace />;
  }
 
  // Assuming all logged-in users can access the student portal,
  // unless you have a specific role check like `user.isStudent`.
  // If needed, you can add: `if (user && user.isAdmin) return <Navigate to="/admin" replace />;`
 
  return children;
};
 
export default StudentRoute;