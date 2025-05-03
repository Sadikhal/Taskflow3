import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useStore from '../store/useStore';
import useTaskStore from '../store/taskStore';
import TaskList from '../components/TaskList';

function Home() {
  const { currentProject } = useStore();
  const { tasks, loading, error, fetchTasks } = useTaskStore();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "all";

  useEffect(() => {
    if (currentProject?._id) {
      fetchTasks(currentProject._id, status);
    }
  }, [currentProject?._id, status]);
  return (
    <div className="relative">
      {loading ? (
        <div className="h-screen w-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navColor"></div>
        </div>
      ) : error ? (
        <div className="h-screen w-full flex items-center justify-center text-red-500 text-xl">
          ⚠️ Error: {error}
        </div>
      ) : tasks.length === 0 ? (
        <div className="h-screen w-full flex items-center justify-center text-sm text-neutral-500">
          No task is available
        </div>
      ) : (
        <TaskList tasks={tasks} />
      )}
    </div>
  );
};

export default Home;