import { randomUUID } from "node:crypto";

const IMAGE_DATA_URI = /^data:image\/(png|jpe?g|webp|gif);base64,([a-z\d+/]+=*)$/i;
const extensions = { png: "png", jpg: "jpg", jpeg: "jpg", webp: "webp", gif: "gif" };

export const getImageKitPrivateKey = () =>
  process.env.IMAGEKIT_PRIVATE_KEY?.trim() || process.env.IMAGE_KIT_PRIVATE_KEY?.trim() || "";

export const uploadImage = async (dataUri) => {
  const match = IMAGE_DATA_URI.exec(dataUri || "");
  if (!match) {
    const error = new Error("Please upload a PNG, JPEG, WebP, or GIF image");
    error.status = 400;
    throw error;
  }
  if (dataUri.length > 3_500_000) {
    const error = new Error("That image is too large to upload. Choose a smaller image.");
    error.status = 413;
    throw error;
  }

  const privateKey = getImageKitPrivateKey();
  if (!privateKey) {
    const error = new Error("Image uploads need an ImageKit key. Add IMAGEKIT_PRIVATE_KEY in deployment settings.");
    error.status = 503;
    throw error;
  }

  const [, rawFormat] = match;
  const format = rawFormat.toLowerCase();
  const form = new FormData();
  form.set("file", dataUri);
  form.set("fileName", `mingle-${randomUUID()}.${extensions[format]}`);
  form.set("useUniqueFileName", "true");

  const authorization = Buffer.from(`${privateKey}:`).toString("base64");
  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: { Authorization: `Basic ${authorization}` },
    body: form,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("ImageKit upload failed:", response.status, result.message || response.statusText);
    const error = new Error(response.status === 401 ? "ImageKit rejected the private key. Check IMAGEKIT_PRIVATE_KEY in deployment settings." : "Image upload failed. Please try again.");
    error.status = response.status === 401 ? 503 : 502;
    throw error;
  }
  if (!result.url) {
    const error = new Error("ImageKit did not return an image URL. Please try again.");
    error.status = 502;
    throw error;
  }
  return result.url;
};
