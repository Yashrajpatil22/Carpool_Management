
import User from "../models/user.model"
const userAuth = async (req, res, next) => {
    try {
        const email = req.header("x-user-email") || req.body.email;

        if (!email) {
            return res.status(401).send("Unauthorized: Email missing");
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("Unauthorized: User not found");
        }

        req.user = user;
        next();

    } catch (err) {
        res.status(500).send("Server error in middleware");
    }
};

export default userAuth;
