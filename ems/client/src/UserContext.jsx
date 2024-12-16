/* eslint-disable react/prop-types */
import {createContext, useEffect, useState} from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}){
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in when the app loads
    fetch('https://campuse.onrender.com/profile', {
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
    });
  }, []);

  const logout = async () => {
    try {
      await fetch('https://campuse.onrender.com/logout', {
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
