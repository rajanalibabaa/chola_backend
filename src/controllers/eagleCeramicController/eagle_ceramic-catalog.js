import { EagleCeramicCatalog } from "../../model/eagleCeramicSchema/eagle_ceramic_catalog.js";
import { uploadToR2 } from "../../services/r2Upload.service.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import { uuid } from "../../utils/uuid/generateuuid.js";


export const eagleCeramicCatalogCreate = async (req, res) => {
  const { productName, productSize, title, description, buttonText, productId } = req.body;

  try {
    const imageFile = req.files['image'] ? req.files['image'][0] : null;
    const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;

    if (!imageFile || !pdfFile) {
      return res.json(new ApiResponse(404, null, "Image and PDF files are required"));
    }

    
    const uploadedImage = await uploadToR2({
      file: imageFile,
      folderName: 'eagle-ceramic',
      fileType: 'images',
      mimetype: imageFile.mimetype
    });

    if (!uploadedImage) {
      return res.json(new ApiResponse(500, null, "Failed to upload image"));
    }

    const uploadedPdf = await uploadToR2({
      file: pdfFile,
      folderName: 'eagle-ceramic',
      fileType: 'pdfs',
      mimetype: pdfFile.mimetype
    });

    if (!uploadedPdf) {
      return res.json(new ApiResponse(500, null, "Failed to upload PDF"));
    }    

    const newCatalogEntry = new EagleCeramicCatalog({
      uuid: uuid(),
      productName,
      productSize,
      title,
      description,
      buttonText,
      imageUrl: uploadedImage,
      pdfUrl: uploadedPdf,
      productId
    });

    const savedCatalogEntry = await newCatalogEntry.save();

    if (!savedCatalogEntry) {
      return res.json(new ApiResponse(500, null, "Failed to create catalog entry"));
    }

    return res.json(new ApiResponse(200, savedCatalogEntry, "Catalog entry created successfully"));

  } catch (error) {
    console.error("Error creating catalog entry:", error);
    return res.json(new ApiResponse(500, null, "Internal server error"));
  }
};
