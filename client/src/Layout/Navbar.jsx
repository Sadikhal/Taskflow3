import { Link } from "react-router-dom";
import { IoNotificationsSharp } from "react-icons/io5";
import useStore from "../store/useStore";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';
import { BiChevronDown } from "react-icons/bi";
import { IoAdd } from "react-icons/io5";
import useTaskStore from "../store/taskStore";
import TaskForm from "../components/form/TaskForm";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/DropDown";
import { apiRequest } from "../lib/apiRequest";

const Navbar = () => {
  const { user, projects, currentProject, setCurrentProject, toggleProjectDialog, logout } = useStore();
  const { setSelectedTask, clearSelectedTask, selectedTask } = useTaskStore();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className='flex items-center justify-between p-4 bg-[#ffff] ml-2 rounded-lg mb-3 h-24 '>
      <div>
        <img src="/logo2.png" className="h-28 w-28 object-contain " alt="logo" />
      </div>
      <Select
        value={currentProject?._id || ""}
        onValueChange={(value) => {
          const project = projects.find(p => p._id === value);
          if (project) {
            setCurrentProject(project);
            navigate(`/${project._id}/home`);
          }
        }}
      >
        <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44 flex flex-row justify-between cursor-pointer">
          <SelectValue placeholder="Select Project" />
          <BiChevronDown className="h-4 w-4" />
        </SelectTrigger>
        
        <SelectContent className="bg-bgColor">
          <SelectGroup>
            {projects?.map(project => (
              <SelectItem 
                key={project._id}
                value={project._id}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <h3 className="font-semibold">{project.title}</h3>
              </SelectItem>
            ))}
            
            <div className="hover:bg-gray-50 w-full border-t border-slate-200 py-2 px-2 text-sm cursor-pointer">
              <button 
                onClick={() => toggleProjectDialog(true)} 
                className="flex flex-row justify-between items-center font-semibold"
              >
                <IoAdd className="text-2xl pr-2"/>
                <h3>Add Project</h3>
              </button>
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* User section */}
      <div className='flex items-center gap-6'>
        <button
          className="py-2 hidden md:flex bg-navColor cursor-pointer items-center text-sm justify-center rounded-md text-bgColor hover:bg-gray-100 relative border-2 px-3 hover:border-teal-700 hover:text-teal-700 transition-colors"
          onClick={() => setSelectedTask(true)}
        >
          Add Task
        </button>

        <div className="p-2 flex items-center gap-3 border rounded-full">
          <div className='flex flex-row gap-2'>
            <span className="text-xs font-medium">{user?.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer">
                <BiChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="mr-4 mt-2 border-none bg-bgColor cursor-pointer">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <TaskForm onClose={clearSelectedTask} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;