import { create } from 'zustand';
import { apiRequest } from '../lib/apiRequest';

const useStore = create((set, get) => ({
  user: null,
  projects: [],
  currentProject: null,
  showProjectDialog: false,
  isAuthenticated: false,

  // Auth actions
  login: (userData, projects) => set({ 
    user: userData, 
    projects,
    isAuthenticated: true 
  }),
  logout: () => {
    set({ 
      user: null, 
      projects: [], 
      currentProject: null, 
      isAuthenticated: false 
    });
  },
  
  // Project actions
  setProjects: (projects) => set({ projects }),
  addProject: (project) => set((state) => ({ 
    projects: [...state.projects, project],
    currentProject: project,
    showProjectDialog: false 
  })),
  setCurrentProject: (project) => set({ currentProject: project }),
  toggleProjectDialog: (show) => set({ showProjectDialog: show }),
  
  // Auth check
  checkAuth: async () => {
    try {
      const { data } = await apiRequest.get('/auth/me');
      const currentState = get();
      
      // Preserve existing current project if valid
      let currentProject = currentState.currentProject;
      const projectExists = data.projects?.some(p => p._id === currentProject?._id);
      
      if (!projectExists) {
        currentProject = data.projects?.[0] || null;
      }

      set({
        user: data.user,
        projects: data.projects || [],
        currentProject,
        isAuthenticated: true
      });
      return true;
    } catch (error) {
      get().logout();
      return false;
    }
  },
}));

export default useStore;