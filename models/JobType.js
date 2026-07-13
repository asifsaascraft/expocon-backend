import mongoose from "mongoose";

const JobTypeSchema = new mongoose.Schema(
  {
    jobTypeName: {
      type: String,
      required: [true, "Job type name is required."],
      trim: true,
      unique: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  },
);


// JSON Transform
JobTypeSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const JobType =
  mongoose.models.JobType ||
  mongoose.model("JobType", JobTypeSchema);

export default JobType;