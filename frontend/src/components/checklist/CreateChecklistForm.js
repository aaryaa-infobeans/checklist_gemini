import React from 'react';
import { useForm } from 'react-hook-form';
import { createTemplate } from '../../api/templates';

const CreateChecklistForm = ({ onCreated }) => {
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      await createTemplate(data);
      reset();
      if (onCreated) {
        onCreated();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create checklist');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-96">
      <h2 className="text-2xl mb-4">Create Checklist</h2>
      <label className="block mb-2">Title</label>
      <input {...register('title')} className="w-full p-2 border mb-4" />
      <label className="block mb-2">Category</label>
      <input {...register('category')} className="w-full p-2 border mb-4" />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Create</button>
    </form>
  );
};

export default CreateChecklistForm;
