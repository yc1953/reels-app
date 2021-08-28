import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../components/firebase';
export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return function () {
      console.log('It is done');
      unsubscribe();
    };
  }, []);

  async function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  async function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  async function logout() {
    return auth.signOut();
  }

  let value = { login, logout, signup, user };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
