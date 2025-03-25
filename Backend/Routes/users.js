// const { Router } = require("express");
// const userRouter = Router();
// const { userModel } = require("../db");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// require("dotenv").config();
// const authMiddleware=require("../middlewares/authMiddleware");
// const user=[];
// userRouter.post("/signin", async function (req, res) {
//     try {
//         const { dateofbirth, phonenumber } = req.body;
//         if (!dateofbirth || !phonenumber) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }
//         //findingif the user exists or not in the database
//         const user = await userModel.findOne({
//             dateofbirth: dateofbirth.trim(),//trim function is used to trim the spaces
//             MobileNo: phonenumber.trim()
//         });
//         //token authentication
//         if (user) {
//             token = jwt.sign({
//                 id: user._id
//             }, process.env.JWT_SECRET);
//             return res.json({
//                 token});
//         } else {
//             return res.status(403).json({
//                 message: "Incorrect Credentials"
//             });
//         }
//     } catch (error) {
//         res.status(500).json({
//             message: "Internal Server Error"
//         });
//     }
// });

// userRouter.get("/userdata", authMiddleware, async function (req, res) {
//     try {
//         const user = await userModel.findOne({
//             dateofbirth: req.user.dateofbirth,
//             MobileNo: req.user.MobileNo
//         }).select("-password");
        
//         if (!user) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.json(user);
//     } catch (error) {
//         console.error("User data retrieval error:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });

// module.exports = {
//     userRouter
// };