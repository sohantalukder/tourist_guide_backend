import multer from "multer";

const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single("image");
const multipleUpload = multer({ storage }).array("image");

export { singleUpload, multipleUpload };
