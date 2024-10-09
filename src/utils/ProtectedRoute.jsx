import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get token from localStorage
        const getToken = JSON.parse(localStorage.getItem("token"));

        // Check if the token exists
        if (getToken !== "" || getToken !== undefined) {
          // Send a request to the backend to verify the token
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/verify-token`,
            {
              headers: {
                Authorization: `Bearer ${getToken}`,
              },
            }
          );

          // If the token is valid, set authentication to true
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false); // If there's an error (e.g., token is invalid)
      } finally {
        setLoading(false); // Stop the loading state
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
