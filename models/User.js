import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    // Basic Information
    fullName: {
      type: String,
      required: [true, "Full name is required."],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      minlength: 3,
      maxlength: 30,
      match: [
        /^[a-zA-Z0-9_.]+$/,
        "Username can contain only letters, numbers, underscore and dot.",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 150,
    },

    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid mobile number."],
    },

    profileImage: {
      type: String,
      default: null,
    },

    // Authentication
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: 8,
      maxlength: 128,
      select: false,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    passwordHistory: [
      {
        password: {
          type: String,
          select: false,
        },

        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Authorization
    role: {
      type: String,
      enum: ["user", "partner", "staff", "admin"],
      required: true,
      default: "user",
    },

    // Account Status
    status: {
      type: String,
      enum: ["pending", "active", "blocked"],
      default: "pending",
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    // Email Verification
    isEmailVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    emailVerificationToken: {
      type: String,
      select: false,
      default: null,
    },

    emailVerificationExpires: {
      type: Date,
      default: null,
    },

    // Login Security
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    loginCount: {
      type: Number,
      default: 0,
    },

    // Password Reset
    passwordResetToken: {
      type: String,
      select: false,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    // Two Factor Authentication (Future)
    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    twoFactorSecret: {
      type: String,
      select: false,
      default: null,
    },

    // Audit Information
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Preferences
    language: {
      type: String,
      trim: true,
      default: "en",
    },

    timezone: {
      type: String,
      trim: true,
      default: "Asia/Kolkata",
    },
  },
  {
    timestamps: true,
  },
);

// Indexes

UserSchema.index({ role: 1 });

UserSchema.index({
  role: 1,
  status: 1,
});

UserSchema.index({
  createdAt: -1,
});

// Virtuals
UserSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre Save Hook
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);

  if (!this.isNew) {
    this.passwordChangedAt = new Date();
  }
});

// Instance Methods

// Compare Password
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Check Password Changed After JWT
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

// Increase Failed Login Attempts
UserSchema.methods.incrementLoginAttempts = async function () {
  this.failedLoginAttempts += 1;

  if (this.failedLoginAttempts >= 3) {
    this.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
  }

  await this.save();
};

//  Reset Login Attempts
UserSchema.methods.resetLoginAttempts = async function () {
  this.failedLoginAttempts = 0;
  this.lockUntil = null;

  await this.save();
};

// Update Login Information
UserSchema.methods.updateLoginInfo = async function () {
  this.lastLoginAt = new Date();
  this.loginCount += 1;
  this.failedLoginAttempts = 0;
  this.lockUntil = null;

  await this.save();
};

// JSON Transform
UserSchema.set("toJSON", {
  virtuals: true,

  transform(doc, ret) {
    [
      "password",
      "passwordHistory",
      "passwordResetToken",
      "passwordResetExpires",
      "emailVerificationToken",
      "emailVerificationExpires",
      "twoFactorSecret",
      "__v",
    ].forEach((field) => delete ret[field]);

    return ret;
  },
});

// Export
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
