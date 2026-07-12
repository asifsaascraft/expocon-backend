import mongoose from "mongoose";

const EntryTypeSchema = new mongoose.Schema(
  {
    entryTypeName: {
      type: String,
      required: [true, "Entry type name is required."],
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
EntryTypeSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const EntryType =
  mongoose.models.EntryType ||
  mongoose.model("EntryType", EntryTypeSchema);

export default EntryType;