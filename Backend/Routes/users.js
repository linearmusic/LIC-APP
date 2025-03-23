const {Router}=require("express");
const userRouter=Router();

userRouter.post("/signin",function(req,res){
    res.json({
        message:"user signin endpoint"
    })
})

userRouter.get("/userdata",function(req,res){
    res.json({
        message:"user signin endpoint"
    })
})


module.exports={
    userRouter:userRouter
}