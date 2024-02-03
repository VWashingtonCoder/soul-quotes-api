import { z } from "zod";

export const userSchema = z.object({
  username: z
    .string({
      required_error: "Username is required",
    })
    .min(2, { message: "Username must be at least 2 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email({ message: "Email must be a valid email address" }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const quoteSchema = z.object({
  quoteKey: z.string({
    required_error: "Quote key is required",
  }),
  text: z
    .string({
      required_error: "Quote text is required",
    })
    .min(10, { message: "Quote text must be at least 10 characters long" }),
  author: z
    .string({
      required_error: "Author is required",
    })
    .min(2, { message: "Author must be at least 2 characters long" }),
  category: z.string(),
});

export const favoriteSchema = z.object({
  quoteId: z.string({
    required_error: "Quote ID is required",
  }),
});

export const deleteSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: "Must be a number" }),
});
