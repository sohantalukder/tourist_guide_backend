import asyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import getDataURI from "../../utlis/dataUri.js";
import { response } from "../../utlis/generateResponse.js";
import Blog from "../../Models/Blogs/blogModel.js";
import { getImageName } from "../../utlis/getImageName.js";

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
                imagePath.content,
                { public_id: file?.originalname?.split(".")[0] }
            );
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
            createAt: Date.now(),
        });
        return res.status(201).json(
            response({
                code: 201,
                message: "Successfully created blog!",
            })
        );
    } catch (error) {
        return res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
        );
    }
});
const allBlogsList = asyncHandler(async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.page) || 1;
        const sortbyID = { _id: -1 };
        const sortByRating = { react: -1 };
        const keyword = req.query.keyword
            ? {
                  name: {
                      $regex: req.query.keyword,
                      $options: "i",
                  },
              }
            : {};
        const count = await Blog.countDocuments({ ...keyword });
        const blogs = await Blog.find(
            { ...keyword },
            {
                _id: 1,
                "creatorInfo.id": "$creatorId",
                "creatorInfo.name": "$creatorName",
                "creatorInfo.image": "$creatorImage",
                "creatorInfo.location": "$creatorLocation",
                title: 1,
                images: 1,
                description: 1,
                react: 1,
                createdAt: "$createAt",
            }
        )
            .sort(sortByRating)
            .sort(sortbyID)
            .skip(pageSize * (page - 1))
            .limit(pageSize);

        return res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: {
                    data: blogs,
                    PageNumber: page,
                    Pages: Math.ceil(count / pageSize),
                },
            })
        );
    } catch (error) {
        return res
            .status(500)
            .json(response({ code: 500, message: error.message }));
    }
});
const updateBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id });
        const { description, title, updateImageIndex, deleteImageIndex } =
            req.body;
        const files = req.files;

        if (!blog) {
            return res
                .status(404)
                .json(response({ code: 404, message: "Blog not found!" }));
        }

        if (blog.creatorId != req.user._id && req.user.role !== "admin") {
            return res.status(401).json(
                response({
                    code: 401,
                    message: "You are not able to update this blog!",
                })
            );
        }

        let index = 0;
        if (files?.length > 0) {
            for (const file of files) {
                const imagePath = await getDataURI(file);
                const cloudImage = await cloudinary.v2.uploader.upload(
                    imagePath.content,
                    { public_id: file?.originalname?.split(".")[0] }
                );

                if (updateImageIndex) {
                    if (
                        cloudImage?.secure_url &&
                        cloudImage?.secure_url !==
                            getImageName(blog.images[updateImageIndex[index]])
                    ) {
                        await cloudinary.v2.uploader.destroy(
                            getImageName(blog.images[updateImageIndex[index]])
                        );
                    }
                    blog.images[updateImageIndex[index]] =
                        cloudImage.secure_url;
                    index++;
                } else {
                    blog.images.push(cloudImage.secure_url);
                }
            }
        }

        if (deleteImageIndex) {
            for (const index of deleteImageIndex) {
                await cloudinary.v2.uploader.destroy(
                    getImageName(blog.images[index])
                );
                blog.images?.splice(index, 1);
            }
        }

        blog.description = description || blog.description;
        blog.title = title || blog.title;
        blog.images = blog.images;
        blog.updatedAt = Date.now();
        await blog.save();

        return res.status(200).json(
            response({
                code: 200,
                message: "Successfully updated blog details!",
            })
        );
    } catch (error) {
        return res
            .status(500)
            .json(response({ code: 500, message: error.message }));
    }
});
const userBlogsList = asyncHandler(async (req, res) => {
    try {
        const pageSize = Number(req.query.pageSize) || 10;
        const page = Number(req.query.page) || 1;
        const sortbyID = { _id: -1 };
        const sortByRating = { react: -1 };
        const keyword = req.query.keyword
            ? {
                  name: {
                      $regex: req.query.keyword,
                      $options: "i",
                  },
              }
            : {};

        const count = await Blog.countDocuments({ ...keyword });
        const blogs = await Blog.find(
            { creatorId: req.user._id, ...keyword },
            {
                _id: 1,
                "creatorInfo.id": "$creatorId",
                "creatorInfo.name": "$creatorName",
                "creatorInfo.image": "$creatorImage",
                "creatorInfo.location": "$creatorLocation",
                title: 1,
                images: 1,
                description: 1,
                react: 1,
                createdAt: "$createAt",
            }
        )
            .sort(sortByRating)
            .sort(sortbyID)
            .skip(pageSize * (page - 1))
            .limit(pageSize);
        return res.status(200).json(
            response({
                code: 200,
                message: "Ok",
                records: {
                    data: blogs,
                    PageNumber: page,
                    Pages: Math.ceil(count / pageSize),
                },
            })
        );
    } catch (error) {
        return res
            .status(500)
            .json(response({ code: 500, message: error.message }));
    }
});
const deleteBlog = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findOne({ _id: req.params.id });

        if (blog) {
            if (blog.creatorId == req.user._id || req.user.role === "admin") {
                for (const image of blog.images) {
                    await cloudinary.v2.uploader.destroy(getImageName(image));
                }
                await blog.remove();
                return res.status(200).json(
                    response({
                        code: 200,
                        message: "Successfully delete this blog!",
                    })
                );
            } else {
                return res.status(401).json(
                    response({
                        code: 401,
                        message: "You are not able to delete this blog!",
                    })
                );
            }
        } else {
            return res
                .status(404)
                .json(response({ code: 404, message: "Blog not found!" }));
        }
    } catch (error) {
        return res
            .status(500)
            .json(response({ code: 500, message: error.message }));
    }
});
const getBlogById = asyncHandler(async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            const manipulateComment = (comments) => {
                return comments?.length > 0
                    ? comments.map((comment) => {
                          return {
                              commentUserInfo: {
                                  id: comment.commentatorId,
                                  name: comment.commentatorName,
                              },
                              comment: comment.comment,
                              createdAt: comment.createAt,
                          };
                      })
                    : [];
            };
            return res.status(200).json(
                response({
                    code: 200,
                    message: "Ok",
                    records: {
                        _id: blog._id,
                        creatorInfo: {
                            id: blog.creatorId,
                            name: blog.creatorName,
                            image: blog.creatorImage,
                            location: blog.creatorLocation,
                        },
                        title: blog.title,
                        images: blog.images,
                        description: blog.description,
                        react: blog.react,
                        createAt: blog.createAt,
                        comments: manipulateComment(blog.comments),
                    },
                })
            );
        } else {
            return res
                .status(404)
                .json(response({ code: 404, message: "Blog not found!" }));
        }
    } catch (error) {
        return res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
        );
    }
});
const createBlogComment = asyncHandler(async (req, res) => {
    try {
        const { comment } = req.body;
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            const newComment = {
                commentatorId: req.user.id,
                commentatorName: req.user.name,
                comment: comment,
            };
            blog.comments.push(newComment);
            await blog.save();
            return res
                .status(201)
                .json(response({ code: 201, message: "Comment Added!" }));
        } else {
            return res
                .status(404)
                .json(response({ code: 404, message: "Blog not found!" }));
        }
    } catch (error) {
        return res.status(500).json(
            response({
                code: 500,
                message: error.message,
            })
        );
    }
});
export {
    createBlog,
    updateBlog,
    userBlogsList,
    allBlogsList,
    deleteBlog,
    createBlogComment,
    getBlogById,
};
