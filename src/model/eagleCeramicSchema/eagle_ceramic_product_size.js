import mongoose from "mongoose";

const eagleCeramicProductSizeSchema = new mongoose.Schema({

  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productSizes: [
    {
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
    },
  ],
});

export const EagleCeramicProductSize = mongoose.model("EagleCeramicProductSize", eagleCeramicProductSizeSchema)
