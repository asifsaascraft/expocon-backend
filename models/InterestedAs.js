import mongoose from "mongoose";

const InterestedAsSchema = new mongoose.Schema(
  {
    interestedAsName: {
      type: String,
      required: [true, "Interested As name is required."],
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
InterestedAsSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const InterestedAs =
  mongoose.models.InterestedAs ||
  mongoose.model("InterestedAs", InterestedAsSchema);

export default InterestedAs;
