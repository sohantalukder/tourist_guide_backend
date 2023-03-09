import User from "../../Models/User/userModel.js";

const user = async (req, res, next) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await User.findOne(query);
    let isAdmin = false;
    if (user?.role === "admin") {
        isAdmin = true;
    }
    res.json({ admin: isAdmin });
};
const users = async (req, res, next) => {
    console.log("first");
    const user = req.body;
    const result = await User.save(user);
    res.json(result);
    console.log(result);
};
const userUpdate = async (req, res, next) => {
    console.log("second");
    const user = req.body;
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await User.updateOne(filter, updateDoc, options);
    res.json(result);
};

export { user, users, userUpdate };
