import { Router } from "express";
import { UserForToken, authMiddleware } from "../api/auth-utils";
import prisma from "../api/api-client";
import { validateRequest } from "zod-express-middleware";
import { deleteSchema, quoteSchema } from "../zod/z.params.schemas";

const quoteRouter = Router();
// Get all quotes
quoteRouter.get("/", async (req, res) => {
  const quotes = await prisma.quote.findMany();

  if (!quotes) {
    return res.status(404).json({ error: "No quotes found" });
  }

  res.json({ quotes });
});

// Create a new quote
quoteRouter.post(
  "/",
  authMiddleware,
  validateRequest({
    body: quoteSchema,
  }),
  async (req, res) => {
    console.log((req as UserForToken).user);
    const { quoteKey, text, author, category } = req.body;
    const creatorId = (req as UserForToken).user?.username || "";

    const newQuote = await prisma.quote.create({
      data: {
        quoteKey,
        text,
        author,
        category,
        creatorId,
      },
    });
    if (!newQuote) {
      return res.status(500).json({ error: "Error creating quote" });
    }

    res.status(201).json({ quote: newQuote });
  }
);

// Delete a quote
quoteRouter.delete(
  "/:id",
  authMiddleware,
  validateRequest({
    params: deleteSchema,
  }),
  async (req, res) => {
    const id = parseInt(req.params.id);

    const quote = await prisma.quote.findUnique({
      where: {
        id,
      },
    });
    if (!quote) {
      return res.status(404).json({ error: "Quote not found" });
    }

    const deletedQuote = await prisma.quote.delete({
      where: {
        id,
      },
    });
    if (!deletedQuote) {
      return res.status(500).json({ error: "Error deleting quote" });
    }

    res.json("Quote deleted");
  }
);

export { quoteRouter };
