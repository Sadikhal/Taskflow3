import React, { useEffect, useState } from 'react';
import useTaskStore from '../store/taskStore';
import ConfirmationDialog from './form/ConfirmationDialog';
import TaskForm from './form/TaskForm';
import { FaTrashArrowUp } from "react-icons/fa6";
import { BiSolidCalendarEdit } from "react-icons/bi";
import { formatTime } from '../lib/utils';
const TaskList = ({tasks}) => {
  const [taskToDelete, setTaskToDelete] = useState(null);

     const {      
       deleteTask, 
       setSelectedTask,
       selectedTask,
       clearSelectedTask 
     } = useTaskStore();



  const handleDelete = async () => {
    try {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
      setTaskToDelete(null);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {tasks.map(task => (
                <div
                  key={task._id}
                  className="h-[13rem] px-4 py-3 flex flex-col gap-4 shadow-sm bg-bgColor rounded-lg border-1  border-slate-200"
                >
                  <div className='flex flex-col justify-between  h-full'>
                    <div className='flex flex-col gap-2'>
                      
                    <h4 className="font-bold text-xl capitalize">{task.title}</h4>
                    <p className="text-gray-600">{task.description}</p>
                    
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium ">
                       Task created :  <span className='text-[#127461]'>{formatTime(task.createdAt)}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-medium capitalize">
                       Deadline : <span className=' text-[#647412] '>
                       {formatTime(task.completetionAt)}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400 text-[1.2rem]">
                      <button
                        className="text-navColor cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                      <BiSolidCalendarEdit />
                      </button>
                      <button
                        className="text-buttonColor cursor-pointer"
                        onClick={() => setTaskToDelete(task._id)}
                      >
                       <FaTrashArrowUp/>
                      </button>
                    </div>
                  </div>
                </div>
              ))}


            <button
          className="h-[13rem] cursor-pointer flex items-center justify-center rounded-md bg-white hover:bg-gray-100 relative border-2 border-dashed text-gray-500 hover:border-teal-700 hover:text-teal-700 transition-colors"
          onClick={() => setSelectedTask(true)} // Changed from {} to null
        >
          <div>Add Task</div>
        </button>
            </div>
      
            {/* Edit Form Modal */}
            {selectedTask && (
              <div className="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg w-full max-w-md">
                  <TaskForm onClose={clearSelectedTask} />
                </div>
              </div>
            )}
      
            {taskToDelete && (
              <ConfirmationDialog
                message="Are you sure you want to delete this task?"
                onConfirm={handleDelete}
                onCancel={() => setTaskToDelete(null)}
              />
            )}
    </div>
  )
}

export default TaskList