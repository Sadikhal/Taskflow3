import mongoose from "mongoose";

  const taskSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
      
    },
    description: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    },
    completetionAt:{
      type:String,
      required:true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  },
  {timestamps : true}
)

export default mongoose.model("Task", taskSchema);