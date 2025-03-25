const { Router } = require("express");
const adminRouter = Router();
const { adminModel, userModel } = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const authMiddleware=require("../middlewares/authMiddleware");


//admin will signup with userid-admin123 password-anamika@123

// adminRouter.post("/signup", async (req, res) => {
//     try {
//         const { userId, password } = req.body;
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const admin = await adminModel.create({ userId, password: hashedPassword });
//         res.json({ message: "Admin created" });
//     } catch (error) {
//         console.error("Signup error:", error);
//         res.status(500).json({ 
//             message: error.code === 11000 ? "User ID already exists" : "Signup failed" 
//         });
//     }
// });

adminRouter.post("/signin", async (req, res) => {
    const { userId, password } = req.body;
    try {
        // Check for hardcoded credentials
        if (userId === process.env.userid && password === process.env.password) {
            const token = jwt.sign({ 
                id: 'admin',
                role: 'admin'
            }, process.env.JWT_SECRET, { expiresIn: '2h' });
            return res.json({ token });
        }
        
        res.status(403).json({ message: "Invalid credentials" });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

adminRouter.post("/logout", authMiddleware, async (req, res) => {
    try {
        res.status(200).json({ 
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ 
            message: "Logout failed"
        });
    }
});

adminRouter.post("/inputuserdata", authMiddleware, async (req, res) => {
    try {
        const { name, dateofbirth, policynumber, sumassured, TableAndTerms, ModeOfPayment, PremiumAmount, DateOfCommencement, StartFrom, MobileNo, Nominee } = req.body;
        
        // Validate required fields
        const requiredFields = ['name', 'policynumber', 'MobileNo'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        // Check if policy number already exists
        const existingPolicy = await userModel.findOne({ policynumber });
        if (existingPolicy) {
            return res.status(400).json({
                message: "Policy number already exists"
            });
        }

        const newUser = await userModel.create({
            name, dateofbirth, policynumber, sumassured, TableAndTerms, 
            ModeOfPayment, PremiumAmount, DateOfCommencement, StartFrom, 
            MobileNo, Nominee
        });

        res.json({ 
            message: "Data input successful",
            user: newUser
        });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ 
            message: error.name === 'ValidationError' 
                ? "Invalid data format" 
                : "Error adding user. Please try again."
        });
    }
});

adminRouter.get("/get-user", authMiddleware, async (req, res) => {
    try {
        const { name, MobileNo } = req.query;

        if (!name && !MobileNo) {
            return res.status(400).json({
                message: "Please provide either name or mobile number"
            });
        }

        let searchQuery = {};
        if (name) searchQuery.name = { $regex: new RegExp(name.trim(), 'i') };
        if (MobileNo) searchQuery.MobileNo = { $regex: MobileNo.trim() };

        const users = await userModel.find(searchQuery)
            .sort({ name: 1 }) // Sort by name
            .limit(50);        // Limit results

        return res.status(users.length ? 200 : 404).json({
            data: users,
            message: users.length ? null : "No users found"
        });
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = { 
    adminRouter
};
