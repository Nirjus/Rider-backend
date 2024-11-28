import express, { Express, NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routes/user.route";

const App: Express = express();

App.use(express.json());
App.use(express.urlencoded({ extended: true }));
App.use(morgan("dev"));
App.use(cors({ credentials: true }));
// API routes
App.use("/api/v1/user", userRouter);

App.get("/", (req: Request, res: Response) => {
  res.send("Backend is up and running 🎉");
});

App.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

export default App;
