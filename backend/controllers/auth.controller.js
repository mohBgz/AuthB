import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";

import { generateVerificationToken } from "../utils/generateVerificationToken.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendResetSuccessfulEmail,
} from "../mail/email.js";

export const signup = async (req, res) => {
  const { email, password, name, role } = req.body; // req.body is a JS object  {email: "....", pasword: "....", name : "....", role : "...."}
  if (![email, password, name].every(Boolean)) {
    //check wether all filed are equal to true ( not empty)
    // All input fields re required

    return res
      .status(400)
      .json({ success: false, message: "All Fields are Required" });
  }

  try {
    const userAlreadyExists = await User.findOne({ email: email }); // verfiry wheter the user already exists
    if (userAlreadyExists) {
      if (!userAlreadyExists.isVerified) {
        // Allow overwriting unverified accounts
        await User.deleteOne({ email });
      } else {
        return res
          .status(409)
          .json({ success: false, message: "A user with this email already exists." });
      }
    }

    const hashedPassword = await bcryptjs.hash(password, 10); // hash its password
    const verificationToken = generateVerificationToken(); // generate a verification code
    const verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; //  verification code expires in 2 min
    //const verificationTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //  verification code expires in 1 hour

    // const user = new User({name:name, email:email, password:hashedPassword})
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt,
      role,
    });
    await user.save(); // create a new user and store in the database ( within Users collection )

    // generate jwt (JS web token)
    generateTokenAndSetCookie(res, user._id);

    //send Verification Email
    await sendVerificationEmail(user.name, user.email, verificationToken);

    res.status(201).json({
      //send a response for testing purposes
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "We couldn't complete your request right now. Please try again later." }); //log any errors encountered -- change for production
  }
};

export const verifyEmail = async (req, res) => {
  // code => OTP (verification code)

  const { code } = req.body; // It extracts the code  property from req.body and assigns it to the code variable.
  try {
    //console.log("welcome inside Verifying email endpoint ");
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expiered verification code",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    return res.status(200).json({
      success: true,
      message: "User has been verified successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    console.log(error.message); // Optional: log for debugging
    return res
      .status(500)
      .json({ message: `Failed verifying the user ${error}` });
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist",
      });
    }

    const verificationToken = generateVerificationToken();
    const verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000;

    await User.updateOne(
      { email },
      {
        $set: {
          verificationToken,
          verificationTokenExpiresAt,
        },
      }
    );

    await sendVerificationEmail(user.name, email, verificationToken);

    return res.status(200).json({
      success: true,
      message: "OTP has been resent successfully",
    });
  } catch (error) {
    console.error("OTP resend error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP. Please try again later.",
    });
  }
};

export const login = async (req, res) => {
  //missing the part when server verifies jwt ( second login for example )

  const { email, password } = req.body;
  console.log(req.body);

  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "email or password incorrect" });
    }

    const passwordIsCorrect = await bcryptjs.compare(password, user.password);
    if (!passwordIsCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Email or password incorrect" });
    }

    user.lastLogin = Date.now();
    generateTokenAndSetCookie(res, user._id);

    return res.status(201).json({
      success: true,
      message: "User loged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Login Failed" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: " user logout successful" });
};

export const forgotPassword = async (req, res) => {
  const delay = async (min = 170, max = 800) => {
    const ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      await delay(); // Delay for security (prevent timing attacks)
      return res.status(400).json({
        success: false,
        message: "Forget password: User not found",
      });
    }

    // Generate and save reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    //updating the user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = Date.now() + 15 * 60 * 1000; //15min
    await user.save();

    // Send email first, THEN respond
    await sendPasswordResetEmail(
      user.email,
      `${process.env.CLIENT_URL}/reset-password/${resetToken}`
    );

    //await delay(); // Add delay even in success case for consistency
    return res.status(200).json({
      success: true,
      message: "Reset Request Sent Successfully",
    });
  } catch (error) {
    console.log("Error in Forgot Password", error);
    await delay(); // Delay on error for consistency
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
export const resetPassword = async (req, res) => {
  const { token: resetToken } = req.params;
  const { password } = req.body;

  if (!password) {
    res.status(400).json({
      success: true,
      message: "password required",
    });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const newPassword = await bcryptjs.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;

    user.password = newPassword;

    await user.save();

    await sendResetSuccessfulEmail(user.email, user.name);
    return res.status(200).json({
      success: true,
      message: "Password Reset Successful",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAuth = async (req, res) => {
  //delete
  //await new Promise(resolve=> setTimeout(()=>{resolve()}, 2000));

  const userID = req.userID;
  

  try {
    const user = await User.findOne({
      _id: userID,
    }).select("-password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Check auth : user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: user,
    });
  } catch (error) {
    console.log("error in checkAuth!");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
