import { clearStorage, storeToken } from '@/utils/localStorage';
import { useState, createContext } from 'react';

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  async function loginUser(user, token = null) {
    setUser({ ...user, isLoggedIn: true });
    token && storeToken(token);
  }

  const logoutUser = async () => {
    clearStorage();
    setUser(null);
  };

  async function userDispatch(payload) {
    if (payload?.user) {
      setUser({ ...user, ...payload.user, isLoggedIn: true });
    }
  }

  const useract = {
    user: user,
    setUser: setUser,
    userState: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
    userDispatch: userDispatch,
  };

  return (
    <UserContext.Provider value={useract}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
