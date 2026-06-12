import { cloudinary } from "./cloudinaryClient";

const ALLOWED_UPLOAD_FOLDERS = new Set(["posts", "avatars"]);

function getCloudinaryCredentials() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured");
  }

  return { cloudName, apiKey, apiSecret };
}

export function getCloudinaryUploadConfig(folder: string) {
  const { cloudName, apiKey } = getCloudinaryCredentials();

  if (!ALLOWED_UPLOAD_FOLDERS.has(folder)) {
    throw new Error("Invalid upload folder");
  }

  return { cloudName, apiKey, folder };
}

export function signCloudinaryParams(
  paramsToSign: Record<string, string | number>
): string {
  const { apiSecret } = getCloudinaryCredentials();

  const folder = paramsToSign.folder;
  if (typeof folder === "string" && !ALLOWED_UPLOAD_FOLDERS.has(folder)) {
    throw new Error("Invalid upload folder");
  }

  return cloudinary.utils.api_sign_request(paramsToSign, apiSecret);
}
