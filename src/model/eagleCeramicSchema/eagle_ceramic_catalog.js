import mongoose from "mongoose";

const eagleCeramicCatalogSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  productName: {
    type: String,
    // required: true,
  },
  productSize: {
    type: String,
    // required: true,
  },
  title: {
    type: String,
    // required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  buttonText: {
    type: String,
    // required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  pdfUrl: {
    type: String,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EagleCeramicProductSize",
  }
});

export const EagleCeramicCatalog = mongoose.model(
  "EagleCeramicCatalog",
  eagleCeramicCatalogSchema
);
