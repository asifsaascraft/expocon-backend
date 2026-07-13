import mongoose from "mongoose";

const AdvertisementLocationSchema = new mongoose.Schema(
  {
    advertisementLocationName: {
      type: String,
      required: [true, "Advertisement Location name is required."],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);


// JSON Transform
AdvertisementLocationSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.__v;
    return ret;
  },
});

// Export
const AdvertisementLocation =
  mongoose.models.AdvertisementLocation ||
  mongoose.model("AdvertisementLocation", AdvertisementLocationSchema);

export default AdvertisementLocation;