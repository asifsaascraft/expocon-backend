import mongoose from "mongoose";

const StateSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: [true, "State is required."],
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
StateSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const State =
  mongoose.models.State ||
  mongoose.model("State", StateSchema);

export default State;