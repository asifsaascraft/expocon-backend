import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    // Company Information
    companyName: {
      type: String,
      required: [true, "Company name is required."],
      trim: true,
      unique: true,
      maxlength: 150,
    },

    companyEmail: {
      type: String,
      required: [true, "Email ID is required."],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 150,
    },

    companyTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompanyType",
      required: [true, "Company type is required."],
      index: true,
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

    featured: {
      type: Boolean,
      default: true,
      index: true,
    },

    mapLink: {
      type: String,
      trim: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      maxlength: 20,
      default: null,
    },

    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number."],
      default: null,
    },

    uploadLogo: {
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
CompanySchema.index({
  createdAt: -1,
});

// JSON Transform

CompanySchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export

const Company =
  mongoose.models.Company || mongoose.model("Company", CompanySchema);

export default Company;
