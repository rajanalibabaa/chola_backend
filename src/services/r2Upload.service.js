import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "../config/r2.config.js";
import fs from "fs/promises";
import path from "path";

export const uploadToR2 = async ({ file, folderName, fileType = "images", mimetype }) => {
  const buffer = await fs.readFile(file.path);
  const timestamp = Date.now();
  const randomNum = Math.floor(Math.random() * 1000);
  const ext = path.extname(file.originalname);
  const baseName = path.basename(file.originalname, ext);
  const key = `${folderName}/${fileType}/${timestamp}-${randomNum}-${baseName}${ext}`;
  const contentType = mimetype || file.mimetype || "application/octet-stream";

  try {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await r2.send(command);

    fs.unlink(file.path).catch((err) => {
      console.error(`Failed to delete temp file ${file.path}:`, err);
    });

   
    const fileUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return fileUrl;

  } catch (err) {
    console.error(`R2 upload failed for ${file.originalname}:`, err);
    throw new Error("Upload to Cloudflare R2 failed");
  }
};

export const deleteFromR2 = async (fileUrl) => {
  try {
    const url = new URL(fileUrl);
    const key = url.pathname.slice(1);
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    await r2.send(command);
    console.log(`Successfully deleted ${fileUrl} from R2`);
  } catch (err) {
    console.error(`Failed to delete ${fileUrl} from R2:`, err);
  } 
};
