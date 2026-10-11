const MAX_DATA_URI_LENGTH = 3_500_000;
const SUPPORTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

const readAsDataUri = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = () => reject(new Error("Could not read that image. Please try another file."));
  reader.readAsDataURL(file);
});

export const prepareImage = async (file) => {
  if (!SUPPORTED_TYPES.has(file.type)) throw new Error("Choose a PNG, JPG, WebP, or GIF image.");

  // Preserve animation while keeping GIFs below the serverless request limit.
  if (file.type === "image/gif") {
    const dataUri = await readAsDataUri(file);
    if (dataUri.length > MAX_DATA_URI_LENGTH) throw new Error("That GIF is too large. Choose one under 2.5 MB.");
    return dataUri;
  }

  let image;
  try {
    image = await createImageBitmap(file);
  } catch {
    throw new Error("Could not open that image. Please choose another file.");
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    image.close();
    throw new Error("Image preparation is unavailable in this browser.");
  }

  try {
    for (const maxDimension of [1600, 1280, 1024]) {
      const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      for (const quality of [0.86, 0.76, 0.66]) {
        const dataUri = canvas.toDataURL("image/webp", quality);
        if (dataUri.length <= MAX_DATA_URI_LENGTH) return dataUri;
      }
    }
  } finally {
    image.close();
  }

  throw new Error("That image is too large to upload. Choose a smaller image.");
};
