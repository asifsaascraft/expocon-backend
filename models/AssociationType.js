import mongoose from "mongoose";

const AssociationTypeSchema = new mongoose.Schema(
  {
    associationTypeName: {
      type: String,
      required: [true, "Association type name is required."],
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
AssociationTypeSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const AssociationType =
  mongoose.models.AssociationType ||
  mongoose.model("AssociationType", AssociationTypeSchema);

export default AssociationType;