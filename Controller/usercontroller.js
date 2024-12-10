import User from '../Model/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMail from "../nodemailer.js";
const SignpUser = async (req, res) => {
  try {
    const { email, username, phoneNumber, password, role } = req.body;

    const isUserExist = await User.findOne({ email: email.toLowerCase() });
    if (isUserExist) {
      const isEmailVerify = isUserExist.is_email_verify;
      if (isEmailVerify) {
        return res.status(400).json({ status: 400, message: "User already exists" });
      } else {
        return res.status(200).json({ status: 200, message: "Please verify your email", data: isUserExist });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createUser = await User.create({
      username,
      phoneNumber,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role,
    });

    return res.status(201).json({ status: 201, message: "User created successfully", data: createUser });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
  }
};

const SignupProvider = async (req, res) => {
  try {
    const { email, username, phoneNumber, password } = req.body;

    const isUserExist = await User.findOne({ email: email.toLowerCase() });
    if (isUserExist) {
      return res.status(400).json({ status: 400, message: "User already exists", data: isUserExist });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createProvider = await User.create({
      username,
      phoneNumber,
      email: email.toLowerCase(),
      password: hashedPassword,
      is_email_verify: false,
      is_active: true,
      role: true,
    });

    return res.status(201).json({ status: 201, message: "User created successfully", data: createProvider });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
  }
};

const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isEmailexist = await User.findOne({ email: email.toLowerCase() });
    if (!isEmailexist) {
      return res.status(401).json({ status: 401, message: "Email does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, isEmailexist.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 401, message: "Incorrect password" });
    }

    const token = jwt.sign( { userId: isEmailexist._id }, process.env.JWT_SECRET_KEY,{ expiresIn: "365d" }
    );

    return res.status(200).json({ status: 200, message: "Login successful", data: isEmailexist, token: token });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
  }
};
const verifyPassword = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const isEmailExist = await User.findOne({ email });
    if (!isEmailExist) {
      return res.status(404).json({ status: 404, message: "Email does not exist" });
    }

    if (isEmailExist.otp === otp) {
      return res.status(200).json({ status: 200, message: "Verified successfully" });
    } else {
      return res.status(400).json({ status: 400, message: "Invalid OTP" });
    }
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
  }
};


const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ status: 400, message: "Email is required" });
    }

    const isEmailExist = await User.findOne({ email: email.toLowerCase() });
    if (!isEmailExist) {
      return res.status(404).json({ status: 404, message: "Email does not exist" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000); 

    isEmailExist.otp = otp;
    await isEmailExist.save();
    await sendMail(email, otp)
    return res.status(200).json({
      status: 200,
      message: "OTP has been sent to the provided email (Dummy OTP)",
      otp: otp,  
    });

  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Something went wrong",
      error: err.message,
    });
  }
};




const ResetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ status: 400, message: "All fields are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ status: 400, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

   
    user.password = hashedPassword;
    user.otp = null; 
    await user.save();
    return res.status(200).json({ status: 200, message: "Password reset successfully" });
  } catch (err) {
    console.error("Error resetting password:", err);
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
  }
};

export default ResetPassword;




const Logout = (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ status: 200, message: "Logout successful" });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
  }
};

const ChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?._id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 401, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ status: 200, message: "Password changed successfully" });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
  }
};

const MyProfile = async (req, res) => {
  try {
    const userId = req.user._id;  
    const profile = await User.findById(userId);
    
    if (!profile) {
      return res.status(404).json({ status: 404, message: "Profile not found" }); 
    }

    return res.status(200).json({ status: 200, message: "Your Profile", data: profile });  
  } catch (err) {
    console.error("Error retrieving profile:", err);
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });  
  }
};

const EditProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profile = await User.findByIdAndUpdate(userId, { $set: { ...req.body } }, { new: true });
    return res.status(200).json({ status: 200, message: "Your Updated Profile", data: profile });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
  }
};

const DeleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;
    const delUser =  await User.findByIdAndDelete(userId);
    if(!delUser){
      return res.status(200).json({status: 404, message: "User not found"})
    }
    return res.status(200).json({ status: 200, message: "Your Account has been deleted" });
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Something went wrong", error: err.message });
  }
};

export { 
  SignpUser, 
  LoginUser, 
  SignupProvider, 
  ForgotPassword, 
  Logout, 
  ChangePassword, 
  MyProfile, 
  EditProfile, 
  DeleteAccount ,
  ResetPassword
};
