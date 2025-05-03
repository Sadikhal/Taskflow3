import React from 'react';
import { useForm } from 'react-hook-form';
import useTaskStore from '../../store/taskStore';
import useStore from '../../store/useStore';
import { Button } from '../ui/button';

const TaskForm = ({ onClose }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { currentProject } = useStore();
  const { createTask, updateTask, selectedTask, clearSelectedTask } = useTaskStore();

  const onSubmit = async (data) => {
    try {
      if (!currentProject?._id) {
        alert("No project selected");
        return;
      }
      
      const taskData = {
        title: data.title,
        description: data.description,
        completetionAt: data.completetionAt
      };

      if (selectedTask && selectedTask._id) {
        await updateTask(selectedTask._id, taskData);
      } else {
        await createTask(currentProject._id, taskData);
      }
      
      onClose();
      clearSelectedTask();
    } catch (error) {
      console.log('Operation failed:', error);
    };
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block mb-2 font-medium">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          defaultValue={selectedTask?.title}
          className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
        />
        {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
      </div>

      <div>
        <label className="block mb-2 font-medium">Description</label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          defaultValue={selectedTask?.description}
          className="peer h-15 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
        />
        {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
      </div>

      <div>
        <label className="block mb-2 font-medium">Status</label>
        <select
          {...register('status', { required: 'Status is required' })}
          defaultValue={selectedTask?.status || 'pending'}
          className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && <span className="text-red-500 text-sm">{errors.status.message}</span>}
      </div>

      <div>
        <label className="block mb-2 font-medium">Completion Date</label>
        <input
          type="date"
          {...register('completetionAt', { 
            required: 'Completion date is required',
            validate: value => {
              const selectedDate = new Date(value);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return selectedDate >= today || 'Date must be today or in the future';
            }
          })}
          defaultValue={selectedTask?.completetionAt?.slice(0, 10)}
          className="peer h-10 w-full border border-gray-100 text-sm text-slate-900 p-2 -z-50 placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos font-medium shadow-sm rounded-sm"
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.completetionAt && (
          <span className="text-red-500 text-sm">{errors.completetionAt.message}</span>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          onClick={() => {
            onClose();
            clearSelectedTask();
          }}
          className="px-4 py-2 text-slate-100 bg-buttonColor cursor-pointer hover:bg-buttonColor/60"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="px-4 py-2 bg-navColor text-white rounded cursor-pointer hover:bg-navColor/60"
        >
          {selectedTask ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;