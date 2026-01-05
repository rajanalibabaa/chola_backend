import mongoose from "mongoose";

const productSizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
});

const eagleCeramicProductSizeSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    productName: {
      type: String,
      required: true,
      unique: true, 
    },
    productSizes: [productSizeSchema],
  },
  { timestamps: true }
);

export const EagleCeramicProductSize = mongoose.model(
  "EagleCeramicProductSize",
  eagleCeramicProductSizeSchema
);
