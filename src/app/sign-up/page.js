"use client"
import React, { useCallback, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import debounce from 'lodash/debounce';
import Image from 'next/image';

const schema = yup.object().shape({
  username: yup.string().matches(/^[A-Za-z0-9]+$/, "Username must contain only letters and numbers, with no spaces")
  .required('Username is required')
  .min(3, 'Username must be at least 3 characters'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Users() {
  const { register, handleSubmit,watch,control,formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
  const user_name = watch('username');

  // Function to check username availability
  const checkUsernameAvailability = useCallback(debounce(async (username) => {
    try {
      if(username){
      await axios.get(`/api/check-username?username=${username}`);
      setIsUsernameAvailable(true);
      }
      else{
        setIsUsernameAvailable(false);
      }
    } catch (error) {
      setIsUsernameAvailable(false);
    }
  }, 300),[]);

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/sign-up', data); // Submit data to your API endpoint
      alert('Admin registered successfully');
    } catch (error) {
      console.error('Failed to register:', error);
      alert('Registration failed');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <Image width={20} height={20} className="mx-auto h-20 w-auto" src="https://cdn.bio.link/uploads/profile_pictures/2024-10-07/WpsNql0qow0baLnfnBowFm8v5fK9twVm.png" alt="Your Company" />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Add New Admin</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-900">Username</label>
            <div className="mt-2">
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    required
                    onChange={(e)=>{
                      field.onChange(e);
                       checkUsernameAvailability(e.target.value);
                    }}
                    className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                )}
              />

              { errors.username  ? <p className="mt-2 text-sm text-red-600">{errors.username.message}</p> : !isUsernameAvailable ?user_name && <p className="mt-2 text-sm text-red-600"> ✓ username not availbale</p> :<p className="mt-2 text-sm text-green-600"> ✓ username is available to use</p>
 }
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email address</label>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                {...register('email')}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              />
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                {...register('password')}
                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              />
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div>
            <button type="submit" disabled={(!isUsernameAvailable||isSubmitting)} className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              {isSubmitting ? 'Submitting...' : 'Add Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
