import jwt from "jsonwebtoken"
import type ms from "ms"

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as ms.StringValue
  });
}

export const generateAccessToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as ms.StringValue
  });
}

export const verifyAccessToken = (token: string): any => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
}

export const verifyRefreshToken = (token: string): any => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
}
