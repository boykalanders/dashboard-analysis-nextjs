'use client';

import { supabase } from '@/client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event: any) => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const email = isValidEmail(formData.email);

  const handleSubmit = async () => {
    try {
      //email
      if (formData.email.trim() === '') {
        toast('Email cannot be empty!', { type: 'error' });
        return;
      } else if (!email) {
        toast('Please enter valid email!', { type: 'error' });
        return;
      }
      //password
      if (formData.password.trim() === '') {
        toast('Password cannot be empty!', { type: 'error' });
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      console.log(data);
      localStorage.setItem('token', JSON.stringify(data));
      router.push('/');
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#414557]">
      <div className="text-[#FFF] max-w-screen-md mx-auto rounded-lg overflow-hidden lg:p-10 flex justify-center items-center ">
        <div className="w-[100%] mt-36">
          <h2 className="text-center text-[#ABEB78] text-4xl font-bold">
            LOGIN
          </h2>
          <div className="mt-5">
            <label
              htmlFor="email"
              className="block mb-2 mt-3 text-white text-lg font-normal"
            >
              EMAIL
            </label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              className="bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg  block p-2.5 mb-2"
              placeholder="email@hotmail.com"
            />
            <label
              htmlFor="name"
              className="block mb-2 text-white text-lg font-normal"
            >
              PASSWORD
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              className="bg-[#F1F1F1] w-full text-gray-900 text-sm rounded-lg  block p-2.5 mb-4"
              placeholder="*******"
            />

            <div className="flex justify-between">
              <button
                onClick={() => handleSubmit()}
                className="w-[150px] h-10 bg-[#C742C1] rounded-[10px] text-white text-lg font-bold "
              >
                LOGIN
              </button>

              <Link href="/signup">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
