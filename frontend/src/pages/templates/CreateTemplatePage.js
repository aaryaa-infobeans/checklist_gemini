import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { createTemplate } from '../../api/templates';
import { toast } from 'react-toastify';

const CreateTemplatePage = () => {
  const navigate = useNavigate();
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      title: '',
      category: '',
      items: [{ description: '' }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const onSubmit = async (data) => {
    try {
      await createTemplate(data);
      toast.success('Checklist template created successfully!');
      navigate('/');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create checklist template.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create Checklist Template</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md">
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input {...register('title')} className="w-full p-2 border" />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <input {...register('category')} className="w-full p-2 border" />
        </div>

        <h2 className="text-xl font-bold mb-4">Checklist Items</h2>
        {fields.map((item, index) => (
          <div key={item.id} className="flex items-center mb-2">
            <input
              {...register(`items.${index}.description`)}
              className="w-full p-2 border"
              placeholder={`Item ${index + 1}`}
            />
            <button type="button" onClick={() => remove(index)} className="ml-2 text-red-500">
              Remove
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ description: '' })}
          className="mb-4 text-blue-600"
        >
          + Add Item
        </button>

        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 text-white p-2 rounded">
            Create Template
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplatePage;
