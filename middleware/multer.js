import multer from "multer";
import path from "path";
const storage = multer.memoryStorage();

const singleUpload = multer({ storage }).single("image");
const multipleUpload = multer({ storage }).array("image");
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const acceptableExtensions = ["png", "jpg", "jpeg", "jpg"];
        if (
            !acceptableExtensions.some(
                (extension) =>
                    path.extname(file.originalname).toLowerCase() ===
                    `.${extension}`
            )
        ) {
            return callback(
                new Error(
                    `Extension not allowed, accepted extensions are ${acceptableExtensions.join(
                        ","
                    )}`
                )
            );
        }
        callback(null, true);
    },
});

export { singleUpload, multipleUpload, upload };
