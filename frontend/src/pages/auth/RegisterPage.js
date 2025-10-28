import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

/**
 * RegisterPage
 * Controlled form using react-hook-form. On successful registration the user
 * is redirected to /login. Shows inline success/error messages.
 */
const RegisterPage = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setMessage(null);
    try {
      await axiosInstance.post('/auth/register/', data);
      setMessage({ type: 'success', text: 'Registration successful. Please check your email to verify your account.' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const text = err?.response?.data?.detail || err.message || 'Registration failed';
      setMessage({ type: 'error', text });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Create account</h2>

        {message && (
          <div className={`p-2 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

  <label htmlFor="name" className="block mb-2">Full name</label>
  <input id="name" {...register('name', { required: true })} className="w-full p-2 border mb-4" />
        {errors.name && <div className="text-red-500 text-sm mb-2">Name is required</div>}

  <label htmlFor="email" className="block mb-2">Email</label>
  <input id="email" {...register('email', { required: true })} className="w-full p-2 border mb-4" />
        {errors.email && <div className="text-red-500 text-sm mb-2">Email is required</div>}

  <label htmlFor="password" className="block mb-2">Password</label>
  <input id="password" type="password" {...register('password', { required: true, minLength: 6 })} className="w-full p-2 border mb-4" />
        {errors.password && <div className="text-red-500 text-sm mb-2">Password (min 6 chars) is required</div>}

        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded">
          {isSubmitting ? 'Creating...' : 'Create account'}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
