import { createError } from "../lib/createError.js";
import Project from "../models/project.model.js";


export const createProject = async (req, res, next) => {
  try {
    const userId = req.userId;
    const { title, description } = req.body; 

    const existingProjectsCount = await Project.countDocuments({ userId });
    if (existingProjectsCount >= 4) {
      return next(createError(400, "You have reached the maximum limit of projects"));
    }

    const existingProjectWithSameTitle = await Project.findOne({ 
      userId, 
      title: { $regex: new RegExp(`^${title}$`, 'i') }
    });
    if (existingProjectWithSameTitle) {
      return next(createError(400, "Cannot create projects with the same title"));
    }

    const project = new Project({
      userId,
      title,
      description 
    });
    const savedProject = await project.save();

    res.status(201).json(savedProject);
  } catch (error) {
    console.log(error)
    next(error);
  }
};




// get all categories
export const getProjects = async (req, res, next) => {
 try {
  const projects = await Project.find({userId : req.userId});
  res.status(200).json({
   message : "All projects List",
   projects
  });
 } catch (error) {
  next(error)
 };
};

// get single project

export const getProject = async (req, res , next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) next(createError(404, "project not found"));

    if (project.userId.toString() !== req.userId) {
      return next(createError(403, "You can only access to  your own projects"));
    }
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
}



export const updateProject = async (req, res,next) => {
  try {
    const {id} = req.params;
    const project = await Project.findById(id);
    if (project.userId.toString() !== req.userId) {
      return next(createError(403, "You can only update your own projects"));
    }

    const existingProject = await Project.findOne({
      title: req.body.title,
      userId: req.userId,
      _id: { $ne: id } 
    });

    if (existingProject) {
      return next(createError(400, "Project title must be unique for your projects"));
    }

    const updateProject = await Project.findByIdAndUpdate(
      id, 
      {
        $set: req.body,
      },
      { new : true }
    );
    res.status(200).json(updateProject);
  } catch (error) {
    next(error)

  };
};



export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const project = await Project.findById(id);
    if (project.userId.toString() !== req.userId) {
      return next(createError(403, "You can only delete your own projects"));
    }
    await Project.findByIdAndDelete(id);
    res.status(200).json({ 
      success: true,
      message: "Project has been deleted successfully" 
    });

  } catch (err) {
    next(err);
  }
};