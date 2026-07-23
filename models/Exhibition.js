import mongoose from "mongoose";

const ExhibitionSchema = new mongoose.Schema(
  {
    // Exhibition Information
    eventTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EventType",
      required: [true, "Event Type is required."],
      index: true,
    },
    eventName: {
      type: String,
      required: [true, "Event name is required."],
      trim: true,
      unique: true,
      maxlength: 150,
    },
    eventShortName: {
      type: String,
      required: [true, "Event short name is required."],
      trim: true,
      unique: true,
      maxlength: 20,
    },
    startDate: {
      type: Date,
      required: [true, "Start Date is required"],
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          if (!this.startDate || !value) return true;
          return value >= this.startDate;
        },
        message: "End date must be greater than or equal to start date",
      },
      required: [true, "End Date is required"],
    },
    month: {
      type: String,
      required: [true, "Month is required."],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "year is required."],
      trim: true,
    },
    entryTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EntryType",
      required: [true, "Entry Type is required."],
      index: true,
    },
    city: {
      type: String,
      required: [true, "City is required."],
      trim: true,
      maxlength: 100,
    },
    stateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: [true, "State is required."],
      index: true,
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: [true, "Venue is required."],
      index: true,
    },
    website: {
      type: String,
      required: [true, "Website link is required."],
      trim: true,
      maxlength: 255,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    exhibitionTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExhibitionType",
    },
    uploadEventLogo: {
      type: String,
      default: null,
    },
    frequency: {
      type: String,
      trim: true,
    },
    aboutExhibition: {
      type: String,
      trim: true,
    },
    exhibitorProfile: {
      type: String,
      trim: true,
    },
    speciality: {
      type: String,
      trim: true,
    },
    visitorProfile: {
      type: String,
      trim: true,
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
ExhibitionSchema.index({
  createdAt: -1,
});

// JSON Transform
ExhibitionSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const Exhibition =
  mongoose.models.Exhibition || mongoose.model("Exhibition", ExhibitionSchema);

export default Exhibition;
