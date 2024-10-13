// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../firebase';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser({
          uid: authUser.uid,
          email: authUser.email,
          displayName: authUser.displayName,
          photoURL: authUser.photoURL,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const updateUserInfo = (newInfo) => {
    setUser((prevUser) => ({ ...prevUser, ...newInfo }));
  };

  return (
    <UserContext.Provider value={{ user, updateUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};