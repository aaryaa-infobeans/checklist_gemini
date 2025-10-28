import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      if (!user) {
        alert('Invalid credentials');
        navigate('/');
        return;
      }
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'project_manager') navigate('/manager');
      else if (user.role === 'auditor') navigate('/auditor');
      else navigate('/');
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4">Sign in</h2>
        <label className="block mb-2">Email</label>
        <input {...register('email')} className="w-full p-2 border mb-4" />
        <label className="block mb-2">Password</label>
        <input type="password" {...register('password')} className="w-full p-2 border mb-4" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
