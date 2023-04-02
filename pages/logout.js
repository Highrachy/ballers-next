import { UserContext } from '@/context/UserContext';
import { useRouter } from 'next/router';
import React from 'react';

const Logout = () => {
  let { logoutUser } = React.useContext(UserContext);
  const router = useRouter();
  React.useEffect(() => {
    logoutUser();
    router.push('/login');
  }, [logoutUser, router]);
  return <div>Logging Out</div>;
};

export default Logout;
