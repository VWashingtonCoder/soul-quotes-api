import { Router } from "express";
import prisma from "../api/api-client";
import { userSchema } from "../zod/z.params.schemas";
import { validateRequest } from "zod-express-middleware";
import {
  hashPassword,
  createTokenForUser,
  validatePassword,
} from "../api/auth-utils";

const userRouter = Router();

// Get All Users
userRouter.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ users });
});

// Create a new user
userRouter.post(
  "/users/create",
  validateRequest({
    body: userSchema,
  }),
  async (req, res) => {
    const { email, password } = req.body;
    const username = req.body.username.toLowerCase();

    const existingUsername = await prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (existingUsername) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const existingEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingEmail) {
      return res.status(409).json({ error: "Email already exists" });
    }

    const user = await prisma.user.create({
      data: {
        username: username,
        email,
        passwordHash: await hashPassword(password),
      },
    });
    const token = createTokenForUser(user);
    res.status(201).json({ user, token });
  }
);

// Login a user
userRouter.post(
  "/users/login",
  async (req, res) => {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        username: username.toLowerCase(),
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid username" });
    }

    const passwordValid = await validatePassword(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = createTokenForUser(user);
    res.json({ user, token });
  }
);

// Delete a user
userRouter.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.delete({
    where: {
      id: parseInt(id),
    },
  });
  if (!user) {
    return res.status(401).json({ error: "Invalid user id" });
  }

  res.json({ user });
});

export { userRouter };
