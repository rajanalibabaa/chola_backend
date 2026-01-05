import { uuid } from "../../utils/uuid/generateuuid.js";
import { EagleCeramicProductSize } from "../../model/eagleCeramicSchema/eagle_ceramic_product_size.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import mongoose from "mongoose";
import { deleteFromR2, uploadToR2 } from "../../services/r2Upload.service.js";
import { EagleCeramicCatalog } from "../../model/eagleCeramicSchema/eagle_ceramic_catalog.js";

export const eagleCeramicProductSizeCreate = async (req, res) => {
  try {
    const { productName, productSizes } = req.body;

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

    /* Parse JSON from FormData */
    if (typeof productSizes === "string") {
      productSizes = JSON.parse(productSizes);
    }
    if (typeof sizesToDelete === "string") {
      sizesToDelete = JSON.parse(sizesToDelete);
    }

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

    const images = req.files?.image || [];

    /* Clone current sizes */
    let updatedSizes = [...existingProduct.productSizes];

    /* DELETE SIZES */
    if (Array.isArray(sizesToDelete) && sizesToDelete.length > 0) {
      updatedSizes = updatedSizes.filter(
        (s) => !sizesToDelete.includes(s._id.toString())
      );
    }

    /* UPDATE / ADD SIZES */
    if (Array.isArray(productSizes)) {
      for (let i = 0; i < productSizes.length; i++) {
        const sizeItem = productSizes[i];

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

        /* UPDATE EXISTING SIZE */
        if (sizeItem._id) {
          const index = updatedSizes.findIndex(
            (s) => s._id.toString() === sizeItem._id.toString()
          );

          if (index === -1) {
            return res
              .status(404)
              .json(new ApiResponse(404, {}, "Product size not found"));
          }

          let imageUrl = updatedSizes[index].image;

          if (images[i]) {
            const uploadedImage = await uploadToR2({
              file: images[i],
              folderName: cholaClientsList.egleCeramic,
              fileType: "images",
              mimetype: images[i].mimetype,
            });

            imageUrl = uploadedImage.url;
          }

          updatedSizes[index] = {
            _id: updatedSizes[index]._id,
            size: sizeItem.size.trim(),
            title: sizeItem.title.trim(),
            description: sizeItem.description.trim(),
            image: imageUrl,
          };
        } else {
        /* ADD NEW SIZE */
          if (!images[i]) {
            return res
              .status(400)
              .json(
                new ApiResponse(
                  400,
                  {},
                  "Image is required for new product size"
                )
              );
          }

          const uploadedImage = await uploadToR2({
            file: images[i],
            folderName: cholaClientsList.egleCeramic,
            fileType: "images",
            mimetype: images[i].mimetype,
          });

          updatedSizes.push({
            _id: new mongoose.Types.ObjectId(),
            size: sizeItem.size.trim(),
            title: sizeItem.title.trim(),
            description: sizeItem.description.trim(),
            image: uploadedImage,
          });
        }
      }
    }

    /* PRODUCT NAME DUPLICATE CHECK */
    if (productName && productName.trim() !== existingProduct.productName) {
      const duplicate = await EagleCeramicProductSize.findOne({
        productName: productName.trim(),
        uuid: { $ne: uuid },
      });

      if (duplicate) {
        return res
          .status(409)
          .json(new ApiResponse(409, {}, "Product name already exists"));
      }
    }

    /* UPDATE DB */
    const updatedProduct = await EagleCeramicProductSize.findOneAndUpdate(
      { uuid },
      {
        $set: {
          ...(productName && { productName: productName.trim() }),
          productSizes: updatedSizes,
        },
      },
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedProduct, "Product updated successfully")
      );
  } catch (error) {
    console.error("Update Product Error:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, {}, "Internal server error"));
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
