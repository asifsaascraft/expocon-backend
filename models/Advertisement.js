import mongoose from "mongoose";

const AdvertisementSchema = new mongoose.Schema(
  {
    // Advertisement Information
    advertisementLocationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdvertisementLocation",
      required: [true, "Advertisement is required."],
      index: true,
    },
    
    uploadAdvertisementLogo: {
      type: String,
      required: [true, "Logo is required."],
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
AdvertisementSchema.index({
  createdAt: -1,
});

// JSON Transform
AdvertisementSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const Advertisement =
  mongoose.models.Advertisement ||
  mongoose.model("Advertisement", AdvertisementSchema);

export default Advertisement;
