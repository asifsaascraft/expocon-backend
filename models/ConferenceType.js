import mongoose from "mongoose";

const ConferenceTypeSchema = new mongoose.Schema(
  {
    conferenceTypeName: {
      type: String,
      required: [true, "Conference type name is required."],
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
ConferenceTypeSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const ConferenceType =
  mongoose.models.ConferenceType ||
  mongoose.model("ConferenceType", ConferenceTypeSchema);

export default ConferenceType;