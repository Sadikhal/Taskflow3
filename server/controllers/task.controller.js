import { createError } from "../lib/createError.js";
import Task from "../models/task.model.js";



// controllers/task.controller.js
export const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;
    const { title } = req.body;
    const existingTask = await Task.findOne({ 
      projectId,
      title: { $regex: new RegExp(`^${title}$`, 'i') }
    });

    if (existingTask) {
      return next(createError(400, "Task title must be unique within the project"));
    }

    const task = new Task({
      userId,
      projectId,
      ...req.body
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { sort = 'newest', status } = req.query;
    
    const sortOptions = { createdAt: -1 };
    const filter = { 
      projectId, 
      userId: req.userId 
    };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (sort === "oldest") {
      sortOptions.createdAt = 1;
    }

    const tasks = await Task.find(filter).sort(sortOptions);
    
    res.status(200).json({
      message: "All Tasks List",
      tasks
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
// get single Task

export const getTask = async (req, res , next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) next(createError(404, "Task not found"));

    if (task.userId.toString() !== req.userId) {
      return next(createError(403, "You can only access to  your own tasks"));
    }
    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    next(error);
  }
}

export const updateTask = async (req, res,next) => {
  try {
    const {id} = req.params;
    const task = await Task.findById(id);
    if (task.userId.toString() !== req.userId) {
      return next(createError(403, "You can only update your own tasks"));
    }

    const existingTask = await Task.findOne({
      title: req.body.title,
      projectId : task.projectId,
      _id: { $ne: id } 
    });

    if (existingTask) {
      return next(createError(400, "Task title must be unique for your Tasks"));
    }

    const updateTask = await Task.findByIdAndUpdate(
      id, 
      {
        $set: req.body,
      },
      { new : true }
    );
    res.status(200).json(updateTask);
  } catch (error) {
    console.log(error);
    next(error)

  };
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const task = await Task.findById(id);
    if (task.userId.toString() !== req.userId) {
      return next(createError(403, "You can only delete your own Tasks"));
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ 
      success: true,
      message: "Task has been deleted successfully" 
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};