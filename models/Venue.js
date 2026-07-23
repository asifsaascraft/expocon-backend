import mongoose from "mongoose";

const VenueSchema = new mongoose.Schema(
  {
    // Venue Information
    venueName: {
      type: String,
      required: [true, "Venue name is required."],
      trim: true,
      unique: true,
      maxlength: 150,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: [true, "State is required."],
      index: true,
    },
    city: {
      type: String,
      required: [true, "City is required."],
      trim: true,
      maxlength: 100,
    },
    address: {
      type: String,
      required: [true, "Address is required."],
      trim: true,
      maxlength: 500,
    },
    website: {
      type: String,
      required: [true, "Website link is required."],
      trim: true,
      maxlength: 255,
    },
    mapLink: {
      type: String,
      required: [true, "Map link is required."],
      trim: true,
      maxlength: 255,
    },
    uploadVenuePhoto: {
      type: String,
      required: [true, "Photo is required."],
      trim: true,
    },
    featured: {
      type: Boolean,
      default: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: null,
    },
    uploadVenueLayout: {
      type: String,
      default: null,
    },

    // Approval Status
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // Audit Information

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    rejectedAt: {
      type: Date,
      default: null,
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
VenueSchema.index({
  createdAt: -1,
});

// JSON Transform
VenueSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const Venue = mongoose.models.Venue || mongoose.model("Venue", VenueSchema);

export default Venue;
