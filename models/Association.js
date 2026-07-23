import mongoose from "mongoose";

const AssociationSchema = new mongoose.Schema(
  {
    // Association Information
    associationName: {
      type: String,
      required: [true, "Association name is required."],
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
    associationTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssociationType",
      required: [true, "Association type is required."],
      index: true,
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
AssociationSchema.index({
  createdAt: -1,
});

// JSON Transform
AssociationSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const Association =
  mongoose.models.Association ||
  mongoose.model("Association", AssociationSchema);

export default Association;
