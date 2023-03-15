import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import getDataURI from "../../utlis/dataUri.js";
import { response } from "../../utlis/generateResponse.js";
import Blog from "../../Models/Blogs/blogModel.js";

const createBlog = asyncHandler(async (req, res) => {
    try {
        const { description, title } = req.body;
        const files = req.files;
        const creatorId = req.user._id;
        const creatorName = req.user.name;
        const creatorLocation = req.user?.location;
        const creatorImage = req.user?.image;
        const imagesURL = [];
        for (const file of files) {
            const imagePath = await getDataURI(file);
            const cloudImage = await cloudinary.v2.uploader.upload(
                imagePath.content
            );
            console.log(cloudImage.secure_url);
            imagesURL.push(cloudImage.secure_url);
        }
        await Blog.create({
            creatorId,
            title,
            creatorImage,
            creatorName,
            creatorLocation,
            description,
            images: imagesURL,
        });
        res.status(201).json(
            response({
                code: 201,
                message: "Successfully created blog!",
            })
        );
    } catch (error) {
        res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
        );
    }
});

export { createBlog };
