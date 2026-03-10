import { Response } from "express";

export const successResponse = (
  res: Response,
  message: string,
  statusCode: number = 200,
  content: any = null,
) => {
  return res.status(statusCode).json({ status: "success", message, content });
};

export const cookieResponse = (
  res: Response,
  token: string
) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 5 // 5 days
  });
}