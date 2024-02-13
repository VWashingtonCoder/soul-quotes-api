import { Router } from "express";
import { UserForToken, authMiddleware } from "../api/auth-utils";
import prisma from "../api/api-client";
import { validateRequest } from "zod-express-middleware";
import { deleteSchema, favoriteSchema } from "../zod/z.params.schemas";

const favoritesRouter = Router();
// Get All Favorites
favoritesRouter.get("/favorites/all", async (req, res) => {
  const favorites = await prisma.favorite.findMany();
  if (!favorites) {
    return res.status(404).json({ error: "No favorites found" });
  }
  res.json({ favorites });
});

// Get User Favorites
favoritesRouter.get("/favorites", authMiddleware, async (req, res) => {
  const userId = (req as UserForToken).user?.username || "";
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
    },
  });

  if (!favorites) {
    return res.status(404).json({ error: "No favorites found" });
  }

  res.json({ favorites });
});
// Add New Favorite
favoritesRouter.post(
  "/favorites",
  authMiddleware,
  validateRequest({
    body: favoriteSchema,
  }),
  async (req, res) => {
    const userId = (req as UserForToken).user?.username || "";
    const { quoteId } = req.body;

    const newFavorite = await prisma.favorite.create({
      data: {
        quoteId,
        userId,
      },
    });
    if (!newFavorite) {
      return res.status(500).json({ error: "Error creating favorite" });
    }

    res.status(201).json({ favorite: newFavorite });
  }
);

// Delete Favorite
favoritesRouter.delete(
  "/favorites/:id",
  authMiddleware,
  validateRequest({
    params: deleteSchema,
  }),
  async (req, res) => {
    const id = Number(req.params.id);

    const findFavorite = await prisma.favorite.findUnique({
      where: {
        id,
      },
    });
    if (!findFavorite) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    const deletedFavorite = await prisma.favorite.delete({
      where: {
        id,
      },
    });
    if (!deletedFavorite) {
        return res.status(500).json({ error: "Error deleting favorite" });
      }

    res.json("Favorite deleted");
  }
);

export { favoritesRouter };
