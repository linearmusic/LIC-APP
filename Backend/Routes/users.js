const { Router } = require("express");
const userRouter = Router();
const { userModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

userRouter.post("/signin", async function (req, res) {
    try {
        const { dateofbirth, phonenumber } = req.body;
        
        if (!dateofbirth || !phonenumber) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        
        const user = await userModel.findOne({
            dateofbirth: dateofbirth.trim(),//trim function is used to trim the spaces
            MobileNo: phonenumber.trim()
        });
        
        if (user) {
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET);
            return res.json({
                token});
        } else {
            return res.status(403).json({
                message: "Incorrect Credentials"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token" });
    }
};

userRouter.get("/userdata", authMiddleware, async function (req, res) {
    try {
        const user = await userModel.findById(req.user.id).select("-password"); 
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error("User data retrieval error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = {
    userRouter
};