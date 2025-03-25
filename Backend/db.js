const mongoose=require("mongoose");
require('dotenv').config()

const schema=mongoose.Schema;

const adminSchema = new schema({
    userId:{
        type: String,
        required: [true, "User ID is required"]
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    }
});
const userSchema = new schema({
    name: {type: String,required: [true, "Name is required"]},
    dateofbirth: {type: Date,required: [true, "Date of birth is required"]},
    policynumber: {type: Number,required: [true, "Policy number is required"],unique:true},
    sumassured: {type: Number,required: [true, "Sum assured is required"]},
    TableAndTerms: {type:String,required: [true, "Table and terms are required"]},
    ModeOfPayment: {type: String,required: [true, "Mode of payment is required"]},
    PremiumAmount: {type: Number,required: [true, "Premium amount is required"]},
    DateOfCommencement: {type: Date,required: [true, "Date of commencement is required"]},
    StartFrom: {type: Date,required: [true, "Start from date is required"]},
    MobileNo: {type: String,match: [/^\d{10}$/, "Mobile number must be exactly 10 digits"],required: [true, "Mobile number is required"]},
    Nominee:{type:String,required:[true,"Nominee is required"]}
});

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);

module.exports = {
    userModel,
    adminModel
}
