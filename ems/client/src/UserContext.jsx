/* eslint-disable react/prop-types */
import {createContext, useEffect, useState} from "react";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';


export const UserContext = createContext({});

export function UserContextProvider({children}){
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in when the app loads
    fetch(`${API_URL}/profile`, {
      credentials: 'include',
    }).then(response => {
      if (response.ok) {
        response.json().then(userData => {
          setUser(userData);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    })
    .catch(error => {
      console.error('Failed to fetch profile:', error);
      setLoading(false);  // Make sure to set loading to false even if there's an error
    });
  }, []);

  // Add a loading indicator or return children if not loading
  if (loading) {
    return <div>Loading...</div>;  // Or your preferred loading component
  }

  const logout = async () => {
    try {
      await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <UserContext.Provider value={{user, setUser, loading, logout}}>
      {children}
    </UserContext.Provider>
  )
}
