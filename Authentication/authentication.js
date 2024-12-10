import jwt from "jsonwebtoken";
import User from "../Model/User.js";
import dotenv from "dotenv";
dotenv.config();

const authenticationUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({status: 401, message: "Token Required"})
    }

    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User doesn't exist" });  
    }

    req.user = user;

    next();  
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });  
  }
};

export default authenticationUser;
