
import  {uuid}  from "../../utils/uuid/generateuuid.js";
import { EagleCeramicProductSize } from "../../model/eagleCeramicSchema/eagle_ceramic_product_size.js";
import { ApiResponse } from "../../utils/ApiResponse/ApiResponse.js";
import mongoose from "mongoose";


export const eagleCeramicProductSizeCreate = async (req, res) => {
  try {
    const { productName, productSizes } = req.body;

    /* Validation */
    if (!productName) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }


    if (!productSizes || !Array.isArray(productSizes) || productSizes.length === 0) {
      return res.status(400).json( new ApiResponse(400, {}, "Product sizes array is required"));
    }
   

    /* Validate each size object */
    for (const sizeItem of productSizes) {
      if (!sizeItem.size || !sizeItem.title || !sizeItem.description) {
        return res.status(400).json( new ApiResponse(400, {}, "Each product size must include size, title, and description"));
      }
    }
  
    /* Check for duplicate product name */
    const existingProduct = await EagleCeramicProductSize.findOne({ productName });

    if (existingProduct) {
      return res.status(409).json(new ApiResponse(409, {}, "Product already exists",));
    }

      const generateuuid = uuid()

    /* Create document */
    const newProductSize = await EagleCeramicProductSize.create({
      uuid: generateuuid,
      productName,
      productSizes,
    });

    return res.status(201).json(new ApiResponse(201, newProductSize, "Product sizes created successfully",));
    
  } catch (error) {
    console.error("Create Product Size Error:", error);

    return res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};

export const eagleCeramicProductSizeGetAll = async (req, res) => {
  try {
    const productSizesdatas = await EagleCeramicProductSize.find().sort({ createdAt: -1 });

    if (!productSizesdatas || productSizesdatas.length === 0) {
      return res
        .status(404)
        .json(new ApiResponse(404, [], "No product sizes found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, productSizesdatas, "Product sizes fetched successfully"));
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
    const { productName, productSizes, sizesToDelete } = req.body;

    console.log('Update request received:', { uuid, productName, productSizes, sizesToDelete });

    if (!uuid) {
      return res.status(400).json({
        success: false,
        message: "Product UUID is required",
      });
    }

    const existingProduct = await EagleCeramicProductSize.findOne({ uuid });

    if (!existingProduct) {
      return res.status(404).json(
        new ApiResponse(404, {}, "Product not found")
      );
    }

    console.log('Existing product sizes:', JSON.stringify(existingProduct.productSizes, null, 2));

    // Get current product sizes
    const currentSizes = existingProduct.productSizes || [];
    
    // Start with existing sizes
    let updatedSizes = [...currentSizes];

    // Handle deletions
    if (sizesToDelete && Array.isArray(sizesToDelete)) {
      console.log('Sizes to delete:', sizesToDelete);
      
      // Filter out sizes to delete
      updatedSizes = updatedSizes.filter(size => {
        if (!size || !size._id) return true;
        
        const sizeIdStr = size._id.toString();
        return !sizesToDelete.some(deleteId => {
          const deleteIdStr = String(deleteId).trim();
          return sizeIdStr === deleteIdStr;
        });
      });
    }

    // Handle updates and additions
    if (productSizes && Array.isArray(productSizes)) {
      console.log('Processing productSizes:', JSON.stringify(productSizes, null, 2));
      
      for (let i = 0; i < productSizes.length; i++) {
        const sizeItem = productSizes[i];
        
        if (!sizeItem || typeof sizeItem !== 'object') {
          console.log(`Skipping invalid size item at index ${i}:`, sizeItem);
          continue;
        }
        
        console.log(`Processing size item ${i}:`, sizeItem);
        
        // Check if this is an update (has _id) or new (no _id)
        if (sizeItem._id) {
          // UPDATE EXISTING SIZE
          console.log(`Updating existing size with ID: ${sizeItem._id}`);
          
          // Validate required fields for update
          if (!sizeItem.size || !sizeItem.title || !sizeItem.description) {
            return res.status(400).json(
              new ApiResponse(400, {}, "Updated product size must include size, title, and description")
            );
          }

          if (!sizeItem.size.trim() || !sizeItem.title.trim() || !sizeItem.description.trim()) {
            return res.status(400).json(
              new ApiResponse(400, {}, "Size, title, and description cannot be empty")
            );
          }

          // Convert the incoming ID to string for comparison
          const incomingIdStr = String(sizeItem._id).trim();
          
          // Find the index of the size to update
          let foundIndex = -1;
          
          for (let j = 0; j < updatedSizes.length; j++) {
            const existingSize = updatedSizes[j];
            if (!existingSize || !existingSize._id) continue;
            
            const existingIdStr = existingSize._id.toString();
            
            // Compare string representations
            if (existingIdStr === incomingIdStr) {
              foundIndex = j;
              break;
            }
          }
          
          if (foundIndex !== -1) {
            // Update the existing size
            console.log(`Found and updating size at index ${foundIndex}`);
            updatedSizes[foundIndex] = {
              _id: updatedSizes[foundIndex]._id, // Keep the original ObjectId
              size: sizeItem.size.trim(),
              title: sizeItem.title.trim(),
              description: sizeItem.description.trim()
            };
          } else {
            console.log(`Size with ID ${incomingIdStr} not found. Available IDs:`, 
              updatedSizes.map(s => s?._id?.toString()).filter(Boolean));
            return res.status(404).json(
              new ApiResponse(404, {}, `Size with ID ${sizeItem._id} not found`)
            );
          }
        } else {
          // ADD NEW SIZE
          console.log(`Adding new size at index ${i}`);
          
          // Validate required fields for new size
          if (!sizeItem.size || !sizeItem.title || !sizeItem.description) {
            return res.status(400).json(
              new ApiResponse(400, {}, "New product size must include size, title, and description")
            );
          }
          
          if (!sizeItem.size.trim() || !sizeItem.title.trim() || !sizeItem.description.trim()) {
            return res.status(400).json(
              new ApiResponse(400, {}, "Size, title, and description cannot be empty")
            );
          }
          
          // Add new size with new ObjectId
          updatedSizes.push({
            _id: new mongoose.Types.ObjectId(),
            size: sizeItem.size.trim(),
            title: sizeItem.title.trim(),
            description: sizeItem.description.trim()
          });
        }
      }
    }

    console.log('Final updatedSizes:', JSON.stringify(updatedSizes, null, 2));

    // Check for duplicate product name if changing
    if (productName !== undefined && productName !== existingProduct.productName) {
      if (!productName.trim()) {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty",
        });
      }

      const duplicateProduct = await EagleCeramicProductSize.findOne({
        productName: productName.trim(),
        uuid: { $ne: uuid }
      });

      if (duplicateProduct) {
        return res.status(409).json(
          new ApiResponse(409, {}, "Product name already exists")
        );
      }
    }

    // Prepare update data
    const updateData = {};
    
    if (productName !== undefined) {
      updateData.productName = productName.trim();
    }
    
    // Always update productSizes if provided (even if empty after deletions)
    if (productSizes !== undefined || sizesToDelete !== undefined) {
      updateData.productSizes = updatedSizes;
    }

    // If no data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json(
        new ApiResponse(400, {}, "No data provided for update")
      );
    }

    console.log('Update data to apply:', JSON.stringify(updateData, null, 2));

    // Update the document
    const updatedProduct = await EagleCeramicProductSize.findOneAndUpdate(
      { uuid },
      { $set: updateData },
      { 
        new: true,
        runValidators: true
      }
    );

    console.log('Update successful, updated product:', JSON.stringify(updatedProduct, null, 2));

    return res.status(200).json(
      new ApiResponse(200, updatedProduct, "Product updated successfully")
    );

  } catch (error) {
    console.error("Update Product Size Error:", error);
    console.error("Error stack:", error.stack);
    console.error("Request body:", req.body);
    console.error("Request params:", req.params);

    if (error.name === 'ValidationError') {
      return res.status(400).json(
        new ApiResponse(400, {}, "Validation error: " + error.message)
      );
    }

    if (error.name === 'CastError') {
      return res.status(400).json(
        new ApiResponse(400, {}, "Invalid product ID format")
      );
    }

    return res.status(500).json(
      new ApiResponse(500, {}, "Internal server error: " + error.message)
    );
  }
};

export const eagleCeramicProductSizeDeletebyID = async (req, res) => {

  try {
    const { uuid } = req.params;
    if (!uuid) {
      return res.status(400).json(new ApiResponse(400, {}, "Product UUID is required"));
    }
    const existingProduct = await EagleCeramicProductSize.findOne({ uuid });

    if (!existingProduct) {
      return res.status(404).json(new ApiResponse(404, {}, "Product not found"));
    }
    await EagleCeramicProductSize.deleteOne({ uuid });

    return res.status(200).json(new ApiResponse(200, {}, "Product deleted successfully"));
  } catch (error) {
    console.error("Delete Product Size Error:", error);
    return res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  } 
};





