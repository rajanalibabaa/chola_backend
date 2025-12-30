import mongoose from "mongoose";

const eagleCeramicCatalogSchema = new mongoose.Schema({
  uuid: {
    type: String,
    required: true,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productSize: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  ButtonText: {
    type: String,
    required: true,
  },
  ImageUrl: {
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
    required: true,
  }
});

export const EagleCeramicCatalog = mongoose.model(
  "EagleCeramicCatalog",
  eagleCeramicCatalogSchema
);
