import { catchAsyncErrors } from "../middleware/catchAsyncErrors.js";
import ErrorHandler from "../middleware/error.js";
import { User } from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Avatar And Resume Are Required!", 400));
  }

  const { avatar, resume } = req.files;

  const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    {
      folder: "AVATARS",
    }
  );
  if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
    console.error(
      "cloudinary Error:",
      cloudinaryResponseForAvatar.error || "unknown Cloudinary Error"
    );
  }

  const cloudinaryResponseForResume = await cloudinary.uploader.upload(
    resume.tempFilePath,
    {
      folder: "RESUME",
    }
  );
  if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
    console.error(
      "cloudinary Error:",
      cloudinaryResponseForResume.error || "unknown Cloudinary Error"
    );
  }

  const {
    username,
    email,
    phone,
    password,
    aboutMe,
    githubUrl,
    instagramUrl,
    facebookUrl,
    linkedInUrl,
    portfolioUrl,
  } = req.body;

  const user = await User.create({
    username,
    email,
    phone,
    password,
    aboutMe,
    githubUrl,
    instagramUrl,
    facebookUrl,
    linkedInUrl,
    portfolioUrl,
    avatar: {
      public_id: cloudinaryResponseForAvatar.public_id,
      url: cloudinaryResponseForAvatar.secure_url,
    },
    resume: {
      public_id: cloudinaryResponseForResume.public_id,
      url: cloudinaryResponseForResume.secure_url,
    },
  });

  generateToken(user, "user Registered!", 201, res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email & Password Are Required!"));
  }

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!"));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password!"));
  }

  generateToken(user, "LoggedIn", 200, res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    })
    .json({
      success: true,
      message: "Loggout",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  if (!req.user) {
    return next(new ErrorHandler("User not authenticated", 401));
  }

  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

export const profileUpdate = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    username: req.body.username,
    email: req.body.email,
    phone: req.body.phone,
    aboutMe: req.body.aboutMe,
    githubUrl: req.body.githubUrl,
    instagramUrl: req.body.instagramUrl,
    facebookUrl: req.body.facebookUrl,
    linkedInUrl: req.body.linkedInUrl,
  };

  if (req.files && req.files.avatar) {
    const avatar = req.files.avatar;
    const user = await User.findById(req.user._id);
    const profileImageId = user.avatar.public_id;
    await cloudinary.uploader.destroy(profileImageId);

    const cloudinaryResponse = await cloudinary.uploader.upload(
      avatar.tempFilePath,
      {
        folder: "AVATARS",
      }
    );

    newUserData.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  if (req.files && req.files.resume) {
    const resume = req.files.resume;
    const user = await User.findById(req.user._id);
    const profileImageId = user.resume.public_id;
    await cloudinary.uploader.destroy(profileImageId);

    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath,
      {
        folder: "RESUME",
      }
    );

    newUserData.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    message: "Profile Updated",
    updatedUser,
  });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please Fill All Fields:", 400));
  }
  const user = await User.findById(req.user._id).select("+password");
  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Current Password", 400));
  }

  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler(
        "New Password And Confirm New Password Do Not Match",
        400
      )
    );
  }

  user.password = newPassword;

  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated!",
  });
});

// rotues for frontend
export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
  const id = `${process.env.USER_ID}`;
  const user = await User.findById(id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

  const message = `Your Reset Password Token is : \n \n ${resetPasswordUrl} \n \n If You'r Not Request For This Please Ignore It.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Personal Portfolio Dashboard Recovery Password",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email Sent  to ${user.email} Successfully!`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token Is Invalid or Has Been Expired!",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password And ConfirmPassword Do Not Match!"));
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  generateToken(user, "Reset Password Successfully!", 200, res);
});
