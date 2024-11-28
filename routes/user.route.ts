import { Router } from "express";
import {
  getUserProfile,
  userLogin,
  userRegistration,
  userVerification,
} from "../controller/user.controller";
import { IsLogin } from "../middleware/isLogin";

const userRouter = Router();

userRouter.post("/registration", userRegistration);
userRouter.post("/verify", userVerification);
userRouter.post("/log-in", userLogin);
userRouter.get("/", IsLogin, getUserProfile);

export default userRouter;
