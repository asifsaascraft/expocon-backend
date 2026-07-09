import mongoose from "mongoose";

const CompanyTypeSchema = new mongoose.Schema(
  {
    companyTypeName: {
      type: String,
      required: [true, "Company type name is required."],
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
CompanyTypeSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const CompanyType =
  mongoose.models.CompanyType ||
  mongoose.model("CompanyType", CompanyTypeSchema);

export default CompanyType;