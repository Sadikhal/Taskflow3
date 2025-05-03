import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import Project from "../models/project.model.js";
import { createError } from "../lib/createError.js";
import { generateTokenAndSetCookie } from "../lib/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailTrap/emails.js";
import crypto from "crypto"; 



export const register = async (req, res, next) => {
  try {
    const { email, password, name, country } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return next(createError(400, "Email already registered"));
      }
      existingUser.name = name;
      existingUser.password = hash;
      existingUser.verificationToken = verificationToken;
      existingUser.verificationTokenExpiresAt = Date.now() + 24 * 60 * 60 * 1000;

      await existingUser.save();
      await sendVerificationEmail(existingUser.email, verificationToken);

      return res.status(200).json({
        success: true,
        message: "New verification email sent",
        user: {
          ...existingUser._doc,
          password: undefined,
        },
      });
    }

    const user = new User({
      email,
      password: hash,
      name,
      country,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    await user.save();
    await sendVerificationEmail(user.email, verificationToken);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (err) {
    console.log(err)
    next(err);
  }
};


export const verifyEmail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		
    generateTokenAndSetCookie(res, user);
    await user.save();
		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};





export const login = async (req,res ,next) => {
  try {
    const user = await User.findOne({
      email : req.body.email });
    
      if (!user) return next(createError(404,"User not found"));
      if (!user.isVerified) {
        return next(createError(400, "user is not verified"));
      }

      const isCorrect = bcrypt.compareSync(req.body.password , user.password);

      if(!isCorrect) return next(createError(404,"wrong password!"));

      const projects = await Project.find({ userId: user._id });

      generateTokenAndSetCookie(res, user);

		await user.save();

     const {password, ...info } = user._doc;

     res
     .status(200)
     .send({
      user:user._doc,
      projects
     });
    console.log(info)

  } catch (error) {
    next(error);
  }
};



export const logOut = (req, res ,next ) => {
  res
  .clearCookie ("token", {
    sameSite:"NONE",
    secure: true
  })
  .status(200)
  .send("user has been logged out")
};



export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ success: false, message: "User not found" });
      }
      const resetToken = crypto.randomBytes(20).toString("hex");

      const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = resetTokenExpiresAt;
      await user.save();

      const resetURL = `${process.env.ORIGIN}/reset-password/${resetToken}`;
      await sendPasswordResetEmail(user.email, resetURL);

      res.status(200).json({ success: true, message: "Password reset link sent to your email" });
  } catch (error) {
      console.log("Error in forgotPassword ", error);
      res.status(400).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params;
		const { password } = req.body;

		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });

     
		}
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
  
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};



// auth.controller.js
export const getAuthUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    console.log(req.userId)
    const projects = await Project.find({ userId: user._id });
    res.status(200).json({ user, projects });
  } catch (error) {
    next(error);
  }
};