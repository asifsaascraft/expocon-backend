import mongoose from "mongoose";

const UserSessionSchema = new mongoose.Schema(
  {
    // User Reference
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Session
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      select: false,
    },

    // Device Information
    deviceId: {
      type: String,
      default: null,
    },

    deviceName: {
      type: String,
      default: null,
    },

    browser: {
      type: String,
      default: null,
    },

    operatingSystem: {
      type: String,
      default: null,
    },

    platform: {
      type: String,
      default: null,
    },

    appVersion: {
      type: String,
      default: null,
    },

    // Network Information
    ipAddress: {
      type: String,
      default: null,
    },

    location: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    // Session Status
    isActive: {
      type: Boolean,
      default: true,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    loggedOutAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
UserSessionSchema.index({
  user: 1,
  isActive: 1,
});


UserSessionSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

// Virtual
UserSessionSchema.virtual("isExpired").get(function () {
  return this.expiresAt < new Date();
});

// Method
UserSessionSchema.methods.touch = async function () {
  const now = new Date();

  const diff = now - this.lastActivityAt;

  if (diff > 5 * 60 * 1000) {
    this.lastActivityAt = now;
    await this.save();
  }
};

const UserSession =
  mongoose.models.UserSession ||
  mongoose.model("UserSession", UserSessionSchema);

export default UserSession;
