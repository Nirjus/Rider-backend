import dotenv from "dotenv";

dotenv.config();

export const backendPort = process.env.PORT || "8001";
