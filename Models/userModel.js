const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { default: eventSchema } = require("./eventsModel");
const { default: blogSchema } = require("./blogModel");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should have more than 4 characters"],
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
    },
    emailVerify: {
        type: Boolean,
        required: true,
        default: false,
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than 8 characters"],
        select: false,
    },
    image: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
        maxLength: [300, "Name cannot exceed 30 characters"],
        minLength: [30, "Name should have more than 4 characters"],
    },
    fvtFoods: {
        type: Array,
        required: false,
    },
    fvtPlace: {
        type: Array,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    blogs: [blogSchema],
    events: [eventSchema],
    contactNumber: {
        type: Number,
        required: false,
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

// Compare Password

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
// module.exports = mongoose.model('General_Setting', generalSettingSchema);
