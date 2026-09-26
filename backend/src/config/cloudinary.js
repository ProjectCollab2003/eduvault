import { v2 as cloudinary } from "cloudinary";

const requiredSettings = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];

const ensureConfigured = () => {
  const missing = requiredSettings.filter((setting) => !process.env[setting]);
  if (missing.length) {
    const error = new Error(`Cloudinary is not configured. Missing: ${missing.join(", ")}`);
    error.statusCode = 503;
    throw error;
  }
};

export const configureCloudinary = () => {
  ensureConfigured();
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  return cloudinary;
};

export const uploadToCloudinary = (buffer, { originalName, mimetype }) => {
  const client = configureCloudinary();
  const resourceType = mimetype?.startsWith("image/") ? "image" : "raw";

  return new Promise((resolve, reject) => {
    const stream = client.uploader.upload_stream(
      {
        folder: "eduvault/materials",
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
        filename_override: originalName,
      },
      (error, result) => (error ? reject(error) : resolve({ ...result, resource_type: resourceType }))
    );
    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  if (!publicId) return;
  const client = configureCloudinary();
  await client.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
};

export const getMaterialDeliveryUrl = (publicId, resourceType, fallbackUrl) => {
  if (!publicId || resourceType !== "raw") return fallbackUrl;

  const client = configureCloudinary();
  return client.utils.private_download_url(publicId, "", {
    resource_type: "raw",
    type: "upload",
  });
};