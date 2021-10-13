import React, { useContext, useEffect, useState } from 'react';
import { auth, database, authCreateUser } from '../firebase';

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return authCreateUser.createUserWithEmailAndPassword(email, password);
  }

  async function login(email, password) {
    const user = await auth.signInWithEmailAndPassword(email, password);
    setIsLoggedIn(null);
    return user;
  }

  function logout() {
    return auth.signOut();
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        database.users
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              const data = {
                uid: doc.id,
                ...doc.data(),
              };
              if (!data.isActive) {
                logout()
                  .then(function (docRef) {
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                    setLoading(false);
                  })
                  .catch(function (error) {
                    console.log(error);
                  });
              } else {
                setCurrentUser(data);
                setIsLoggedIn(true);
                setLoading(false);
              }
            } else {
              logout()
                .then(function (docRef) {
                  setIsLoggedIn(false);
                  setCurrentUser(null);
                  setLoading(false);
                })
                .catch(function (error) {
                  console.log(error);
                });
            }
          })
          .catch(function (error) {
            logout()
              .then(function (docRef) {
                setIsLoggedIn(false);
                setCurrentUser(null);
                setLoading(false);
              })
              .catch(function (error) {
                console.log(error);
              });
          });
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    isLoggedIn,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
  );
};
