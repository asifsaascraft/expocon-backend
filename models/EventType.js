import mongoose from "mongoose";

const EventTypeSchema = new mongoose.Schema(
  {
    eventTypeName: {
      type: String,
      required: [true, "Event type name is required."],
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
EventTypeSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const EventType =
  mongoose.models.EventType ||
  mongoose.model("EventType", EventTypeSchema);

export default EventType;