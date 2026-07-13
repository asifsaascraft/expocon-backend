import mongoose from "mongoose";

const ConferenceSegmentSchema = new mongoose.Schema(
  {
    conferenceSegmentName: {
      type: String,
      required: [true, "Conference segment name is required."],
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
ConferenceSegmentSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const ConferenceSegment =
  mongoose.models.ConferenceSegment ||
  mongoose.model("ConferenceSegment", ConferenceSegmentSchema);

export default ConferenceSegment;