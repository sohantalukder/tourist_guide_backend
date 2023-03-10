import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema({
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
        default: null,
    },
    description: {
        type: String,
        required: false,
        default: null,
        maxLength: [300, "Name cannot exceed 300 characters"],
        minLength: [50, "Name should have more than 50 characters"],
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
        default: null,
    },
    contactNumber: {
        type: String,
        required: false,
        default: null,
    },
    status: {
        type: String,
        required: false,
        default: "Active",
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

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    } else {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

const User = mongoose.model("Users", userSchema);
export default User;
