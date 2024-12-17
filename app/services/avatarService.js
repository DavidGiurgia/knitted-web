export const uploadAvatarToImgBB = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=f69c7bfed22263d58809551d09e9ad28`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    if (data.success) {
      return {
        imageUrl: data.data.url,
        deleteUrl: data.data.delete_url, // Salvează și deleteUrl
      };
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const deleteAvatarFromImgBB = async (deleteUrl) => {
  try {
    const response = await fetch(deleteUrl, { method: "DELETE" });
    if (response.ok) {
      console.log("Avatar deleted successfully.");
    } else {
      throw new Error("Failed to delete avatar");
    }
  } catch (error) {
    console.error("Error deleting avatar:", error);
    throw error;
  }
};

