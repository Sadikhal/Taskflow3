import mongoose from "mongoose";

  const projectSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
    }
  },
  {timestamps : true}
)

export default mongoose.model("Project", projectSchema);