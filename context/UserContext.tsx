import { createContext, useContext, useEffect, useState } from "react";

import firebase from "../firebase/client";

type UserContextType = {
  loadingUser: boolean;
  user: {
    uid?: string;
  };
};

export const UserContext = createContext<UserContextType>({ loadingUser: true, user: {} });

export const useUser = () => useContext(UserContext);

export default function UserContextComp({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // Helpful, to update the UI accordingly.

  useEffect(() => {
    const listenForAuth = async () => {
      // Listen authenticated user
      try {
        const { user } = await firebase.auth().signInAnonymously();
        setUser(user);
        console.log("anonymously logged in", user.uid);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingUser(false);
      }
    };
    listenForAuth();
  }, []);

  return (
    <UserContext.Provider value={{ loadingUser, user }}>
      {user && children}
    </UserContext.Provider>
  );
}
