// src/components/CreateProjectDialog.jsx
import React, { useState } from 'react';
import { apiRequest } from '../../lib/apiRequest';
import useStore from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';


const CreateProjectDialog = () => {
 const { register, handleSubmit, formState: { errors } } = useForm();
  const { addProject, toggleProjectDialog, setCurrentProject,projects } = useStore();
  const navigate = useNavigate();
  const userId = useStore(state => state.user?._id);

  const onSubmit = async (formData) => {
    try {
      const { data } = await apiRequest.post('/project', { 
        ...formData
      });
      
      addProject(data);
      setCurrentProject(data);
      toggleProjectDialog(false);
      navigate(`/${data._id}/home`);
    } catch (error) {
      console.log('Error creating project:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-100 bg-black/90  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl mb-4">Create New Project</h2>
        <form onSubmit={handleSubmit(onSubmit)}>

        <div>
        <label className="block mb-2 font-medium">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
        />
        {errors.title && <span className="text-buttonColor text-sm">{errors.title.message}</span>}
      </div>

          <div>
        <label className="block mb-2 font-medium mt-4">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          className="peer h-15 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
        />
        {errors.description && <span className="text-buttonColor text-sm">{errors.description.message}</span>}
      </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => toggleProjectDialog(false)}
              className="px-4 py-2 bg-buttonColor cursor-pointer text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 cursor-pointer bg-navColor text-white rounded"
              disabled={projects.length >= 4}
            >
              {projects.length >= 4 ? 'Max 4 Projects' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectDialog;