import crypto from "crypto";

interface SignedUploadParams {
  folder: string;
}

export function signCloudinaryUpload({ folder }: SignedUploadParams) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary credentials are not configured");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = { folder, timestamp };
  const signaturePayload = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(`${signaturePayload}${apiSecret}`)
    .digest("hex");

  return {
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
  };
}
