import mongoose from "mongoose";

const MonthSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      required: [true, "Month is required."],
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
MonthSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const Month =
  mongoose.models.Month ||
  mongoose.model("Month", MonthSchema);

export default Month;