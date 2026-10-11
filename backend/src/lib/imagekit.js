import { randomUUID } from "node:crypto";

const IMAGE_DATA_URI = /^data:image\/(png|jpe?g|webp|gif);base64,([a-z\d+/]+=*)$/i;
const extensions = { png: "png", jpg: "jpg", jpeg: "jpg", webp: "webp", gif: "gif" };

export const uploadImage = async (dataUri) => {
  const match = IMAGE_DATA_URI.exec(dataUri || "");
  if (!match) throw new Error("Please upload a PNG, JPEG, WebP, or GIF image");

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) throw new Error("Image uploads are not configured");

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
  const result = await response.json();
  if (!response.ok) {
    console.error("ImageKit upload failed:", result.message || response.statusText);
    throw new Error("Image upload failed. Please try again.");
  }
  return result.url;
};
