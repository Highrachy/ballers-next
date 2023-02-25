import { clearStorage, storeToken } from '@/utils/localStorage';
import { useState, createContext } from 'react';

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  async function loginUser(user, token = null) {
    setUser(user);
    token && storeToken(token);
  }

  const logoutUser = async () => {
    clearStorage();
    setUser(null);
  };

  const useract = {
    user: user,
    setUser: setUser,
    userState: user,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  return (
    <UserContext.Provider value={useract}>{children}</UserContext.Provider>
  );
};

export default UserProvider;
