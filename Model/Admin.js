 import mongoose from "mongoose";
 const AdminSchema= new mongoose.Schema({
    username:{type:String},
    email:{type:String},
    password:{type:String},
    phoneNumber:{type:Number}
 })
 const Admin= mongoose.model("Admin",AdminSchema,"admim")
 export default Admin