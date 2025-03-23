const express=require("express");
const app=express();
app.use(express.json());
const jwt=require("jsonwebtoken");
require('dotenv').config()
const mongoose=require("mongoose");

const {userRouter}=require("./Routes/users");
const {adminRouter}=require("./Routes/admin");
app.use("/user",userRouter);
app.use("/admin",adminRouter);

async function main() {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error(" MongoDB connection failed:", err.message);
    }
}
main();