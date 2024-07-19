import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const router = useRouter();

  const [token, setToken] = useState({
    user: {
      user_metadata: {
        name: '',
      },
    },
  });

  useEffect(() => {
    if (localStorage.getItem('token')) {
      const data = localStorage.getItem('token');
      const parsedData = JSON.parse(data || '');
      console.log(parsedData);
      setToken(parsedData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <section>
      <div className="flex flex-col justify-center mt-32">
        <h1 className="h-24 text-center text-white text-[80px] font-bold">
          Welcome Back, {token.user.user_metadata.name}
        </h1>

        <div className="flex justify-center mt-10">
          <button
            onClick={() => handleLogout()}
            className="w-[210px] h-14 bg-[#C742C1] rounded-[10px] text-white text-lg font-bold "
          >
            LOGOUT
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
