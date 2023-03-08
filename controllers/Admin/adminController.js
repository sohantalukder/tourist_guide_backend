import User from "../../Models/userModel.js";

// Register a User
const adminLogin = async (req, res, next) => {
    const user = req.body;
    const requester = req.decodedEmail;
    if (requester) {
        const requesterAccount = await User.findOne({
            email: requester,
        });
        if (requesterAccount.role === "admin") {
            const filter = { email: user.email };
            const updateDoc = { $set: { role: "admin" } };
            const result = await User.updateOne(filter, updateDoc);
            res.json(result);
        }
    } else {
        res.status(401).json({
            message: "You do not have permission to make admin",
        });
    }
};

const admin = async (req, res, next) => {
    const email = req.params.email;
    const query = { email: email };
    const role = await User.findOne(query);
    let isAdmin = false;
    if (role?.role === "admin") {
        isAdmin = true;
    }
    res.json({ admin: isAdmin });
};

export { adminLogin, admin };
