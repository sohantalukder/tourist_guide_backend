export const getImageName = (imageURL) => {
    const urlArray = imageURL?.split("/");
    const image = urlArray[urlArray?.length - 1];
    const imageName = image?.split(".")[0];
    return imageName;
};
