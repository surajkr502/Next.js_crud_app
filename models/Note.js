import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      maxlength: [100, "Title cannot exceed 100 characters"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      maxlength: [2000, "Content cannot exceed 2000 characters"],
      trim: true,
    },
  },
  {
    timestamps: true, // automatically creates createdAt & updatedAt
  }
);

export default mongoose.models.Note ||
  mongoose.model("Note", NoteSchema);