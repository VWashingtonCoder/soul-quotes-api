import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "./api-client";
import { z } from "zod";
import { User } from "../generated/client";
import { NextFunction, Request, Response } from "express";

export interface UserForToken extends Request {
  user: User;
}

const saltRounds = 10;
const secretKey = process.env.JWT_SECRET || "";
const jwtInfoSchema = z.object({
  username: z.string(),
  email: z.string().email(),
});

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, saltRounds);
};

export const validatePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const unsecureUserForToken = (user: User) => ({
  username: user.username,
  email: user.email,
});

export const createTokenForUser = (user: User) => {
  return jwt.sign(unsecureUserForToken(user), secretKey);
};

export const validateToken = (token: string) => {
  if (!token) return null;
  
  try {
    return jwtInfoSchema.parse(jwt.verify(token, secretKey));
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken = req.headers.authorization?.split(" ") || [];
  const token = bearerToken[1];
  const jwtInfo = validateToken(token);
  if (!jwtInfo) {
    return res.status(401).json({ error: "Invalid token" });
  }

  const userFromJwt = await prisma.user.findUnique({
    where: {
      username: jwtInfo.username,
    },
  });
  if (!userFromJwt) {
    return res.status(401).json({ error: "User not found" });
  }

  (req as UserForToken).user = userFromJwt;
  next();
};
