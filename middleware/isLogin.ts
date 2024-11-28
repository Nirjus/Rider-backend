import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../types/apiResponse";
import { decodedJWT } from "../config/jwtConfig";
import prisma from "../db/prisma";

export const IsLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader && !authHeader?.startsWith("Bearer ")) {
      res.status(404).json({
        success: false,
        message: "Bad request!",
      } as ApiResponse);
      return;
    }
    const authToken = authHeader.split(" ")[1];
    const decodedToken = decodedJWT(authToken);

    if (!decodedToken) {
      res.status(401).json({
        success: false,
        message: "Session expired, Sign in again",
      } as ApiResponse);
      return;
    }
    const user = await prisma.user.findUnique({
      where: {
        id: decodedToken.id,
      },
    });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "You are not authurised to access this reseorce",
      } as ApiResponse);
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
