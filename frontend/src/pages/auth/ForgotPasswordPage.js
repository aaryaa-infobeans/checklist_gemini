import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../api/axiosInstance';

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [message, setMessage] = useState(null);

  const onSubmit = async (data) => {
    setMessage(null);
    try {
      await axiosInstance.post('/auth/password-reset/', data);
      setMessage({ type: 'success', text: 'If the email exists, a reset link has been sent.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to request password reset. Please try later.' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Reset password</h2>
        {message && (
          <div className={`p-2 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
  <label htmlFor="email" className="block mb-2">Email</label>
  <input id="email" {...register('email', { required: true })} className="w-full p-2 border mb-4" />
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white p-2 rounded">
          {isSubmitting ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
