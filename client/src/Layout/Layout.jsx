import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Menu from './Menu';
import Navbar from './Navbar';
import Mobilenav from './MobileNav';
import useStore from '../store/useStore';
import CreateProjectDialog from '../components/form/CreateProjectDialog';
import { apiRequest } from '../lib/apiRequest';
import { BiChevronDown } from 'react-icons/bi';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../components/ui/Select';

const Layout = () => {
  const { 
    user, 
    projects, 
    currentProject, 
    setCurrentProject, 
    setProjects,
    showProjectDialog, 
    toggleProjectDialog,
    checkAuth
  } = useStore();
  
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) return;

      try {
        const { data } = await apiRequest.get('/project');
        setProjects(data.projects || []);

        if (data?.projects?.length > 0 && !currentProject) {
          setCurrentProject(data.projects[0]);
          navigate(`/${data.projects[0]._id}/home`);
        }
      } catch (error) {
        console.log('Failed to fetch projects:', error);
      }
    };

    initialize();
  }, [user, checkAuth, navigate, setCurrentProject, setProjects]);

  return (
    <div className="h-screen flex">
      {showProjectDialog && <CreateProjectDialog />}
      <div className={`p-4 ${open ? "w-[14%]" : "w-[14%] md:w-[8%]"}`}>
        <div className="block lg:hidden w-full">
          <Mobilenav/>
        </div>
        <Menu />
      </div>
      
      <div className="w-[86%] md:w-[92%] bg-[#F7F8FA] overflow-scroll flex flex-col">
        <Navbar />
        {currentProject ? (
          <Outlet />
        ) : (
          <div className="p-4">
            {projects?.length === 0 ? (
              <div className="text-center py-8">
                <h2 className="text-xl mb-4">No Projects Found</h2>
                <button 
                  onClick={() => toggleProjectDialog(true)}
                  className="bg-navColor text-white px-4 py-2 rounded cursor-pointer"
                >
                  Create New Project
                </button>
              </div>
            ) : (
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
                <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44">
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
                        <div className="flex flex-col">
                          <h3 className="font-semibold">{project.title}</h3>
                          <p className="text-xs text-gray-500 truncate">
                            {project.description}
                          </p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;