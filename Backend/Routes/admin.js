const {Router}=require("express");
const adminRouter=Router();
const {adminModel}=require("../db");
adminRouter.post("/signup", async (req, res) => {
    try {
        const admin = await adminModel.create({
            userId: req.body.userid,
            password: req.body.password
        });
        res.json({ message: "Admin created", admin });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ 
            message: error.code === 11000 
                   ? "User ID already exists" 
                   : "Signup failed" 
        });
    }
});

adminRouter.post("/signin",function(req,res){
    res.json({
        message:"admin signin endpoint"
    })
})

adminRouter.post("/userdata",function(req,res){
    res.json({
        message:"admin userdata input endpoint"
    })
})

adminRouter.get("/finduser",function(req,res){
    res.json({
        message:"admin find users endpoint"
    })
})

adminRouter.put("/edituserdata",function(req,res){
    res.json({
        message:"admin edit user data  endpoint"
    })
})
adminRouter.delete("/deleteuserdata",function(req,res){
    res.json({
        message:"admin delete user data  endpoint"
    })
})

module.exports={
    adminRouter:adminRouter
}