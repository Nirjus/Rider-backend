import dotenv from "dotenv";

dotenv.config();

export const backendPort = process.env.PORT || "8001";
export const jwtSecretString = process.env.JWT_SECRET || "";
export const mailtrapToken = process.env.MAILTRAP_TOKEN || "";
