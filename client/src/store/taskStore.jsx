import { create } from 'zustand';
import { apiRequest } from '../lib/apiRequest';

const useTaskStore = create((set, get) => ({
  tasks: [],
  loading: false,
  error: null,
  selectedTask: null,

fetchTasks: async (projectId, status) => {
  set({ loading: true, error: null });
  try {
    const { data } = await apiRequest.get(`/task/project/${projectId}`, {
      params: { status: status !== "all" ? status : undefined }
    });
    set({ tasks: data.tasks, loading: false });
  } catch (error) {
    set({ error: error.response?.data?.message || 'Failed to fetch tasks', loading: false });
  }
},

createTask: async (projectId, taskData) => {
  set({ loading: true });
  try {
    const { data } = await apiRequest.post(`/task/project/${projectId}`, taskData);
    set(state => ({
      tasks: [data, ...state.tasks],
      loading: false
    }));
    return data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create task';
    set({ error: message, loading: false });
    throw new Error(message);
  }
},
  // Update existing task
  updateTask: async (taskId, updatedData) => {
    set({ loading: true });
    try {
      const { data } = await apiRequest.put(`/task/${taskId}`, updatedData);
      set(state => ({
        tasks: state.tasks.map(task => 
          task._id === taskId ? data : task
        ),
        loading: false
      }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update task', loading: false });
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    set({ loading: true });
    try {
      await apiRequest.delete(`/task/${taskId}`);
      set(state => ({
        tasks: state.tasks.filter(task => task._id !== taskId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete task', loading: false });
      console.log(error)
      throw error;
    }
  },

  // Set selected task for editing
  setSelectedTask: (task) => set({ selectedTask: task }),
  
  // Clear selected task
  clearSelectedTask: () => set({ selectedTask: null })
}));

export default useTaskStore;