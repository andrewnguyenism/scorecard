import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";

import firebase from "../firebase/client";

interface UserContextType {
  loadingUser: boolean;
  user: firebase.User | null;
}

export const UserContext = createContext<UserContextType>({
  loadingUser: true,
  user: null,
});

export const useUser = (): UserContextType => useContext(UserContext);

const UserContextComp: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true); // Helpful, to update the UI accordingly.

  useEffect(() => {
    const listenForAuth = async () => {
      // Listen authenticated user
      try {
        const { user } = await firebase.auth().signInAnonymously();
        if (user) {
          setUser(user);
          console.log("anonymously logged in", user.uid);
        }
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
};
export default UserContextComp;
