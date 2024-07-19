'use client'
import React, { useState } from 'react';
import { supabase } from '../client';
import Link from 'next/link';
import { Console } from 'console';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import { SessionProvider } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}
// const SignUpPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     username: ''
//   });
const SignUpPage = () => {
  
  // const { data: session } = useSession();

  const params = useSearchParams()
  const router = useRouter()
  let callbackUrl = params.get('callbackUrl') || '/'
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  // useEffect(() => {
  //   if (session && session.user) {
  //     router.push(callbackUrl)
  //   }
  // }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form

    try {
      const res = await fetch('/pages/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
      if (res.ok) {
        return router.push(
          `/signin?callbackUrl=${callbackUrl}&success=Account has been created`
        )
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (err: any) {
      const error =
        err.message && err.message.indexOf('E11000') === 0
          ? 'Email is duplicate'
          : err.message
      toast.error(error || 'error')
    }
  }
  // const [termsChecked, setTermsChecked] = useState(false);

  // const router = useRouter();

  // const handleChange = (event: any) => {
  //   setFormData((prevFormData) => {
  //     return {
  //       ...prevFormData,
  //       [event.target.name]: event.target.value,
  //     };
  //   });
  // };

  // const handleCheckboxChange = () => {
  //   setTermsChecked(!termsChecked);
  // };

  // const isValidEmail = (email: string) => {
  //   const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  //   return regex.test(email);
  // };

  // const email = isValidEmail(formData.email);

  // const dataStore = async (username: any, userEmail: any, password: any) => {
  //   const { data, error } = await supabase
  //     .from('users')
  //     .upsert([
  //       {
  //         username:username,
  //         email: userEmail,
  //         password: password,
  //       },
  //     ])
  //     .select();
  //   if (error) {
  //     console.error('Supabase Error:', error.message);
  //     return;
  //   }
  // };

  // const handleSubmit = async () => {
  //   const { username, email, password } = formData;
  //   try {
  //     //name
  //     if (formData.username.trim() === '') {
  //       toast('Username cannot be empty!', { type: 'error' });
  //       return;
  //     }
  //     //email
  //     if (formData.email.trim() === '') {
  //       toast('Email cannot be empty!', { type: 'error' });
  //       return;
  //     } else if (!email) {
  //       toast('Please enter valid email!', { type: 'error' });
  //       return;
  //     }
  //     // //companySize
  //     // if (formData.companySize.trim() === '') {
  //     //   toast('Please select a company size!', { type: 'error' });
  //     //   return;
  //     // }
  //     //password
  //     if (formData.password.trim() === '') {
  //       toast('Password cannot be empty!', { type: 'error' });
  //       return;
  //     }
  //     // //checked
  //     // if (!termsChecked) {
  //     //   toast('Please accept the Terms & Conditions!', { type: 'error' });
  //     //   return;
  //     // }

  //     // const { data, error } = await supabase.auth.signUp({
  //     //   email: formData.email,
  //     //   password: formData.password,
  //     //   options: {
  //     //     data: {
  //     //       username: formData.username,
  //     //     },
  //     //   },
  //     // });     
  //     // if (error) throw error;
  //     // router.push('/');
      
  //   const userDetails = await dataStore(
  //         formData.username,
  //         formData.email,
  //         formData.password,

  //       // data.user?.user_metadata.username,
  //       // data.user?.user_metadata.password,
  //       // data.user?.email
        
  //     );
  //   } catch (error) {
  //   //   alert(error);
  //    }
  // };

  return (
    <div className="max-w-sm  mx-auto card bg-base-300 my-4">
      <div className="card-body">
        <h1 className="card-title">Register</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <label className="label" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Name is required',
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.name?.message && (
              <div className="text-error">{errors.name.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Email is invalid',
                },
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.email?.message && (
              <div className="text-error"> {errors.email.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.password?.message && (
              <div className="text-error">{errors.password.message}</div>
            )}
          </div>
          <div className="my-2">
            <label className="label" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Confirm Password is required',
                validate: (value) => {
                  const { password } = getValues()
                  return password === value || 'Passwords should match!'
                },
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.confirmPassword?.message && (
              <div className="text-error">{errors.confirmPassword.message}</div>
            )}
          </div>
          <div className="my-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              Register
            </button>
          </div>
        </form>

        <div className="divider"> </div>
        <div>
          Already have an account?{' '}
          <Link className="link" href={`/signin?callbackUrl=${callbackUrl}`}>
            Login
          </Link>
        </div>
      </div>
    </div>
  )
};

export default SignUpPage;
