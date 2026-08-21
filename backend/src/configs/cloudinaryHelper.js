// Cloudinary utility helpers used to clean up previously uploaded receipt files.
export const getPublicIdFromUrl = (url) => {
  if (!url) return null;

  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    let pathParts = urlParts.slice(uploadIndex + 1);

    if (pathParts[0] && pathParts[0].startsWith("v")) {
      pathParts = pathParts.slice(1);
    }

    const publicIdWithExtension = pathParts.join("/");

    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, "");

    return publicId;
  } catch (error) {
    return null;
  }
};

export const deleteImageFromUrl = async (cloudinary, imageUrl) => {
  const publicId = getPublicIdFromUrl(imageUrl);

  if (!publicId) {
    return false;
  }

  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    return false;
  }
};
