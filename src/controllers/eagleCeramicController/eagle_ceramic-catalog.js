import { EagleCeramicCatalog } from "../../model/eagleCeramicSchema/eagle_ceramic_catalog.js";
import { EagleCeramicProductSize } from "../../model/eagleCeramicSchema/eagle_ceramic_product_size.js";
import { deleteFromR2, uploadToR2 } from "../../services/r2Upload.service.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import { cholaClientsList } from "../../utils/cholaClient/cholaClientsList.js";
import { uuid } from "../../utils/uuid/generateuuid.js";

export const eagleCeramicCatalogCreate = async (req, res) => {
  const {
    productName,
    productSize,
    title,
    description,
    buttonText,
  } = req.body;

  const id = req.body.id || req.body.productId;

  try {
    const imageFile = req.files["image"] ? req.files["image"][0] : null;
    const pdfFile = req.files["pdf"] ? req.files["pdf"][0] : null;

    if (!imageFile || !pdfFile) {
      return res.json(
        new ApiResponse(404, null, "Image and PDF files are required")
      );
    }

    const uploadedImage = await uploadToR2({
      file: imageFile,
      folderName: cholaClientsList.egleCeramic,
      fileType: "images",
      mimetype: imageFile.mimetype,
    });

    if (!uploadedImage) {
      return res.json(new ApiResponse(500, null, "Failed to upload image"));
    }

    const uploadedPdf = await uploadToR2({
      file: pdfFile,
      folderName: cholaClientsList.egleCeramic,
      fileType: "pdfs",
      mimetype: pdfFile.mimetype,
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
      productId: id,
    });

    const savedCatalogEntry = await newCatalogEntry.save();

    if (!savedCatalogEntry) {
      return res.json(
        new ApiResponse(500, null, "Failed to create catalog entry")
      );
    }

    return res.json(
      new ApiResponse(
        200,
        savedCatalogEntry,
        "Catalog entry created successfully"
      )
    );
  } catch (error) {
    console.error("Error creating catalog entry:", error);
    return res.json(new ApiResponse(500, null, "Internal server error"));
  }
};

export const getAllEagleCeramicCatalogbyProduct = async (req, res) => {
  const { productName, productSize } = req.query;

  try {
    let catalogData = [];
    let filterdata = [];

    let match = {};

    if (productName && productSize) {
      match = { productName, productSize };
    } else {
      filterdata = await EagleCeramicProductSize.find({}).select("-_id -__v");
      if (filterdata?.length > 0) {
        match = {
          productName: filterdata[0].productName,
          productSize: filterdata[0].productSizes?.[0]?.size || "",
        };
      } else {
        return res
          .status(404)
          .json(new ApiResponse(404, null, "No products available"));
      }
    }

    catalogData = await EagleCeramicCatalog.find(match).select("-_id -__v");

    const data = {};
    if (catalogData?.length > 0) data.catalogData = catalogData;
    if (filterdata?.length > 0) data.filterdata = filterdata;

    if (!catalogData?.length && !filterdata?.length) {
      return res
        .status(404)
        .json(new ApiResponse(404, null, "No catalog entries found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, data, "Catalog entries retrieved successfully")
      );
  } catch (error) {
    console.error("Error retrieving catalog entries:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Internal server error"));
  }
};

export const getEagleCeramicCatalogbyId = async (req, res) => {
  const catalogId = req.params.catalogId || req.params.id;
  try {
    const catalogEntry = await EagleCeramicCatalog.findOne({ uuid: catalogId });
    return res.json(
      new ApiResponse(200, catalogEntry, "Catalog entry retrieved successfully")
    );
  } catch (error) {
    console.error("Error retrieving catalog entry:", error);
    return res.json(new ApiResponse(500, null, "Internal server error"));
  }
};

export const deleteEagleCeramicCatalogById = async (req, res) => {
  const catalogId = req.params.id;
  try {
    const deletedEntry = await EagleCeramicCatalog.findOneAndDelete({
      uuid: catalogId,
    });
    console.log("Deleted catalog entry:", deletedEntry);

    if (!deletedEntry) {
      return res.json(new ApiResponse(404, null, "Catalog not found"));
    }
    if (deletedEntry.imageUrl) {
      await deleteFromR2(deletedEntry.imageUrl);
    }

    if (deletedEntry.pdfUrl) {
      await deleteFromR2(deletedEntry.pdfUrl);
    }
    return res.json(
      new ApiResponse(200, deletedEntry, "Catalog entry deleted successfully")
    );
  } catch (error) {
    console.error("Error deleting catalog entry:", error);
    return res.json(new ApiResponse(500, null, "Internal server error"));
  }
};

export const updateEagleCeramicCatalog = async (req, res) => {
  const id = req.params.id || req.body.id;

  const { productName, productSize, title, description, buttonText } = req.body;

  const imageFile = req.files?.image?.[0] || null;
  const pdfFile = req.files?.pdf?.[0] || null;

  try {
    const catalog = await EagleCeramicCatalog.findOne({ uuid: id });

    console.log("Found catalog entry:", catalog);
    if (!catalog) {
      return res.json(new ApiResponse(404, null, "Catalog entry not found"));
    }

    if (productName) catalog.productName = productName;
    if (productSize) catalog.productSize = productSize;
    if (title) catalog.title = title;
    if (description) catalog.description = description;
    if (buttonText) catalog.buttonText = buttonText;

    if (imageFile) {
      const uploadedImage = await uploadToR2({
        file: imageFile,
        folderName: cholaClientsList.egleCeramic,
        fileType: "images",
        mimetype: imageFile.mimetype,
      });

      await deleteFromR2(catalog.imageUrl);

      if (!uploadedImage) {
        return res.json(new ApiResponse(500, null, "Failed to upload image"));
      }

      catalog.imageUrl = uploadedImage;
    }

    if (pdfFile) {
      const uploadedPdf = await uploadToR2({
        file: pdfFile,
        folderName: cholaClientsList.egleCeramic,
        fileType: "pdfs",
      });
      await deleteFromR2(catalog.pdfUrl);

      if (!uploadedPdf) {
        return res.json(new ApiResponse(500, null, "Failed to upload PDF"));
      }

      catalog.pdfUrl = uploadedPdf;
    }

    const updatedEntry = await catalog.save();

    return res.json(
      new ApiResponse(200, updatedEntry, "Catalog entry updated successfully")
    );
  } catch (error) {
    console.error("Error updating catalog entry:", error);
    return res.json(new ApiResponse(500, null, "Internal server error"));
  }
};
