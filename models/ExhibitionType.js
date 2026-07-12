import mongoose from "mongoose";

const ExhibitionTypeSchema = new mongoose.Schema(
  {
    exhibitionTypeName: {
      type: String,
      required: [true, "Exhibition type name is required."],
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
ExhibitionTypeSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const ExhibitionType =
  mongoose.models.ExhibitionType ||
  mongoose.model("ExhibitionType", ExhibitionTypeSchema);

export default ExhibitionType;