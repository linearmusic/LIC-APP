const { Router } = require("express");
const adminRouter = Router();
const { adminModel, userModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

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
        res.status(401).json({ message: "Invalid Token" });
    }
};


adminRouter.post("/signup", async (req, res) => {
    try {
        const { userId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await adminModel.create({ userId, password: hashedPassword });
        res.json({ message: "Admin created"});
    } catch (error) {
        console.error("Signup error");
        res.status(500).json({ 
            message: error.code === 11000 ? "User ID already exists" : "Signup failed" 
        });
    }
});

adminRouter.post("/signin", async (req, res) => {
    const { userId, password } = req.body;
    const user = await adminModel.findOne({ userId });

    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ 
                id: user._id 
            },process.env.JWT_SECRET);
            return res.json({ 
                token
            });
        }
    }
    res.status(403).json({ message: "Incorrect Credentials" });
});

adminRouter.post("/inputuserdata", authMiddleware, async (req, res) => {
    try {
        const { name, dateofbirth, policynumber, sumassured, TableAndTerms, ModeOfPayment, PremiumAmount, DateOfCommencement, StartFrom, MobileNo, Nominee } = req.body;
        
        await userModel.create({
            name, dateofbirth, policynumber, sumassured, TableAndTerms, 
            ModeOfPayment, PremiumAmount, DateOfCommencement, StartFrom, 
            MobileNo, Nominee
        });

        res.json({ message: "Data input successful" });
    } catch (error) {
        res.status(500).json({ 
            message: "Error adding user"
        });
    }
});

adminRouter.get("/get-user", async (req, res) => {
    try {
        const { name, dateofbirth, MobileNo } = req.query;

        if (!name || !dateofbirth || !MobileNo) {
            return res.status(400).json({
                message: "Missing required query parameters"
            });
        }
        const users = await userModel.find({ 
            name: name.trim(), 
            dateofbirth: dateofbirth.trim(), 
            MobileNo: MobileNo.trim() 
        });

        if (users.length > 0) {
            return res.status(200).json(users); 
        } else {
            return res.status(404).json({
                message: "No users found"
            }); 
        }
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = { 
    adminRouter
};
