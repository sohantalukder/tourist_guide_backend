import multer from "multer";
import path from "path";
import { response } from "../utlis/generateResponse.js";
const storage = multer.memoryStorage();

const multerConfig = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const acceptableExtensions = ["png", "jpg", "jpeg", "jpg", "svg"];
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
const uploadField = multerConfig.any();
const upload = (req, res, next) => {
    uploadField(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(
                response({
                    code: 500,
                    message: "Image size must be less than 2 MB",
                })
            );
        } else if (err) {
            return res
                .status(500)
                .json(response({ code: 500, message: err.message }));
        }
        next();
    });
};
export { upload };
