import { uuid } from "../../utils/uuid/generateuuid.js";
import { EagleCeramicProductSize } from "../../model/eagleCeramicSchema/eagle_ceramic_product_size.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import mongoose from "mongoose";
import {uploadToR2} from "../../services/r2Upload.service.js";
import { cholaClientsList } from "../../utils/cholaClient/cholaClientsList.js";

import { deleteFromR2 } from "../../services/r2Upload.service.js";
import { EagleCeramicCatalog } from "../../model/eagleCeramicSchema/eagle_ceramic_catalog.js";

export const eagleCeramicProductSizeCreate = async (req, res) => {
  try {
    const { productName, productSizes } = req.body;


    console.log('Create request received:', { productName, productSizes });
    console.log('Files received:', req.files);

    /* Validation */
    if (!productName) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Product name is required"));
    }

    if (
      !productSizes ||
      !Array.isArray(productSizes) ||
      productSizes.length === 0
    ) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Product sizes array is required"));
    }

    for (const sizeItem of productSizes) {
      if (!sizeItem.size || !sizeItem.title || !sizeItem.description) {
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              {},
              "Each product size must include size, title, and description"
            )
          );
      }
    }

    /* Duplicate check */
    const existingProduct = await EagleCeramicProductSize.findOne({
      productName,
    });
    if (existingProduct) {
      return res
        .status(409)
        .json(new ApiResponse(409, {}, "Product already exists"));
    }

    /* Images */
    const images = req.files?.image || [];

    if (images.length !== productSizes.length) {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            {},
            "Number of images must match number of product sizes"
          )
        );
    }

    /* Upload images to R2 and map to sizes */
    const updatedProductSizes = [];

    for (let i = 0; i < productSizes.length; i++) {
      const imageFile = images[i];

      const uploadedImage = await uploadToR2({
        file: imageFile,
        folderName: cholaClientsList.egleCeramic,
        fileType: "images",
        mimetype: imageFile.mimetype,
      });

      updatedProductSizes.push({
        ...productSizes[i],
        image: uploadedImage,
      });
    }

    /* Create document */
    const newProductSize = await EagleCeramicProductSize.create({
      uuid: uuid(),
      productName,
      productSizes: updatedProductSizes,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          newProductSize,
          "Product sizes created successfully"
        )
      );
  } catch (error) {
    console.error("Create Product Size Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
};

export const eagleCeramicProductSizeGetAll = async (req, res) => {
  try {
    const productSizesdatas = await EagleCeramicProductSize.find().sort({
      createdAt: -1,
    });

    if (!productSizesdatas || productSizesdatas.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No product sizes found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          productSizesdatas,
          "Product sizes fetched successfully"
        )
      );
  } catch (error) {
    console.error("Get Product Sizes Error:", error);

    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
};

export const eagleCeramicProductSizeUpdate = async (req, res) => {
  try {
    const { uuid } = req.params;
    let { productName, productSizes, sizesToDelete } = req.body;

    if (typeof productSizes === "string") productSizes = JSON.parse(productSizes);
    if (typeof sizesToDelete === "string") sizesToDelete = JSON.parse(sizesToDelete);

    if (!Array.isArray(productSizes)) productSizes = [];
    if (!Array.isArray(sizesToDelete)) sizesToDelete = [];

    if (!uuid) {
      return res.status(400).json(new ApiResponse(400, {}, "UUID required"));
    }

    const existingProduct = await EagleCeramicProductSize.findOne({ uuid });
    if (!existingProduct) {
      return res.status(404).json(new ApiResponse(404, {}, "Product not found"));
    }

    const images = req.files?.image || [];
    let updatedSizes = [...existingProduct.productSizes];

    /* 🔥 DELETE SIZE IMAGES FROM R2 */
    if (sizesToDelete.length > 0) {
      const deletedSizes = existingProduct.productSizes.filter((s) =>
        sizesToDelete.includes(s._id.toString())
      );

      await Promise.all(
        deletedSizes.map(async (size) => {
          if (size.image) await deleteFromR2(size.image);
        })
      );

      updatedSizes = updatedSizes.filter(
        (s) => !sizesToDelete.includes(s._id.toString())
      );
    }

    let imageIndex = 0;

    /* UPDATE / ADD SIZES */
    for (let i = 0; i < productSizes.length; i++) {
      const sizeItem = productSizes[i];

      if (!sizeItem.size || !sizeItem.title || !sizeItem.description) {
        return res.status(400).json(
          new ApiResponse(400, {}, "Size, title & description required")
        );
      }

      if (sizeItem._id) {
        const index = updatedSizes.findIndex(
          (s) => s._id.toString() === sizeItem._id.toString()
        );

        let imageUrl = index !== -1 ? updatedSizes[index].image : null;

        /* 🔥 REPLACE IMAGE */
        if (sizeItem.hasNewImage && images[imageIndex]) {
          if (imageUrl) {
             await deleteFromR2(imageUrl);
          }

          const uploaded = await uploadToR2({
            file: images[imageIndex],
            folderName: cholaClientsList.egleCeramic,
            fileType: "images",
            mimetype: images[imageIndex].mimetype,
          });

          imageUrl = uploaded.url || uploaded;
          imageIndex++;
        } else if (sizeItem.existingImage) {
          imageUrl = sizeItem.existingImage;
        }

        if (index !== -1) {
          updatedSizes[index] = {
            _id: updatedSizes[index]._id,
            size: sizeItem.size.trim(),
            title: sizeItem.title.trim(),
            description: sizeItem.description.trim(),
            image: imageUrl,
          };
        }
      } else {
        if (!sizeItem.hasNewImage || !images[imageIndex]) {
          return res.status(400).json(
            new ApiResponse(400, {}, "Image required for new size")
          );
        }

        const uploaded = await uploadToR2({
          file: images[imageIndex],
          folderName: cholaClientsList.egleCeramic,
          fileType: "images",
          mimetype: images[imageIndex].mimetype,
        });

        updatedSizes.push({
          _id: new mongoose.Types.ObjectId(),
          size: sizeItem.size.trim(),
          title: sizeItem.title.trim(),
          description: sizeItem.description.trim(),
          image: uploaded.url || uploaded,
        });

        imageIndex++;
      }
    }

    const updatedProduct = await EagleCeramicProductSize.findOneAndUpdate(
      { uuid },
      {
        $set: {
          ...(productName && { productName: productName.trim() }),
          productSizes: updatedSizes,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatedProduct, "Updated successfully"));
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error")
    );
  }
};

export const eagleCeramicProductSizeDeletebyID = async (req, res) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      return res
        .status(400)
        .json(new ApiResponse(400, {}, "Product UUID is required"));
    }

    const existingProduct = await EagleCeramicProductSize.findOne({ uuid });

    if (!existingProduct) {
      return res
        .status(404)
        .json(new ApiResponse(404, {}, "Product not found"));
    }

    
    await Promise.all(
      existingProduct.productSizes.map(async (data) => {
        const children = await EagleCeramicCatalog.find({
          productName: existingProduct.productName,
          productSize: data.size,
        });

        await Promise.all(
          children.map(async (child) => {
            if (child?.imageUrl) {
              await deleteFromR2(child.imageUrl);
            }
            if (child?.pdfUrl) {
              await deleteFromR2(child.pdfUrl);
            }

            await EagleCeramicCatalog.deleteOne({ _id: child._id });
          })
        );
      })
    );

    await EagleCeramicProductSize.deleteOne({ uuid });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Product deleted successfully"));

  } catch (error) {
    console.error("Delete Product Size Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
};

export const eagleCeramicProductSizeDropdown = async (req, res) => {
  try {
    const data = [];

    const products = await EagleCeramicProductSize.find({});

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, data, "No products found"));
    }
    products.forEach((product) => {
      const obj = {
        id: product.uuid,
        productName: product.productName,
        productSizes: [],
      };
      product.productSizes.forEach((sizeItem) => {
        obj.productSizes.push(sizeItem.size);
      });
      data.push(obj);
    });

    return res
      .status(200)
      .json(new ApiResponse(200, data, "Products retrieved successfully"));
  } catch (error) {
    console.error("Error retrieving products:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
  }
};