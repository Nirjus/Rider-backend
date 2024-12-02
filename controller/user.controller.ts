import { Request, Response, NextFunction, response } from "express";
import bcryptjs from "bcryptjs";
import prisma from "../db/prisma";
import { ApiResponse } from "../types/apiResponse";
import { createJWT, decodedJWT } from "../config/jwtConfig";
import {
  emailValidate,
  nameValidation,
  passwordValidation,
} from "../validation/user.validation";
import sendEmail from "../config/email";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    try {
      nameValidation(name);
      emailValidate(email);
      passwordValidation(password);
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      } as ApiResponse);
      return;
    }
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User already exists, please sign in",
      } as ApiResponse);
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const jwtToken = createJWT({ name, email, password, otp }, "1d");
    const recipients = [{ email }];

    await sendEmail(recipients, "Demo email testing", "verification", {
      name,
      otp,
    });

    res.status(200).json({
      success: true,
      message: `An otp sent to your this, email: ${email}`,
      data: jwtToken,
    } as ApiResponse);
    return;
  } catch (error) {
    next(error);
  }
};

export const userVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const { otp } = req.body;
    if (!otp || !authHeader?.startsWith("Bearer ")) {
      res.status(404).json({
        success: false,
        message: "Credentials are not get properly!",
      } as ApiResponse);
      return;
    }
    const token = authHeader.split(" ")[1];
    const decodedData = decodedJWT(token);

    if (otp !== decodedData.otp) {
      res.status(404).json({
        success: false,
        message: "Please use the correct OTP",
      } as ApiResponse);
      return;
    }
    const hashedPassword = await bcryptjs.hashSync(
      decodedData.password,
      bcryptjs.genSaltSync(10)
    );
    const newUser = await prisma.user.create({
      data: {
        email: decodedData.email,
        password: hashedPassword,
        name: decodedData.name,
      },
    });

    res.status(201).json({
      success: true,
      message: "User verified successfully",
      data: newUser,
    } as ApiResponse);
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    try {
      emailValidate(email);
      passwordValidation(password);
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      } as ApiResponse);
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "Email not found, please register you account.",
      } as ApiResponse);
      return;
    }
    const comparePassword = await bcryptjs.compare(password, user.password);
    if (!comparePassword) {
      res.status(404).json({
        success: false,
        message: "Password is not correct!",
      } as ApiResponse);
      return;
    }
    const userWithoutPassword = user as any;
    delete userWithoutPassword.password;
    const token = createJWT({ id: user.id }, "2d");

    res.status(200).json({
      success: true,
      message: "Login successfull",
      data: {
        user: userWithoutPassword,
        token,
      },
    } as ApiResponse);
    return;
  } catch (error) {
    next(error);
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      } as ApiResponse);
      return;
    }
    const userWithoutPassword = user as any;
    delete userWithoutPassword.password;

    res.status(200).json({
      success: false,
      message: "user return successfully",
      data: userWithoutPassword,
    } as ApiResponse);
    return;
  } catch (error) {
    next(error);
  }
};

export const logout = async () => {};
