import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createEventSchema, updateEventSchema } from "../schemas/event.js";

const router = Router();

/**
 * GET /events
 * Get all events for the logged-in user
 */
router.get("/", requireAuth, async (req: AuthRequest, res) => {
  try {
    const events = await prisma.event.findMany({
      where: {
        ownerId: req.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

/**
 * GET /events/:id
 * Get one event if it belongs to the logged-in user
 */
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    if (Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid event id" });
    }

    const event = await prisma.event.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch event" });
  }
});

/**
 * POST /events
 * Create a new event for the logged-in user
 */
router.post(
  "/",
  requireAuth,
  validate(createEventSchema),
  async (req: AuthRequest, res) => {
  try {
    const { title, desc, imageUrl } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        desc,
        imageUrl,
        owner: {
          connect: {
            id: req.userId,
          },
        },
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create event" });
  }
  },
);

/**
 * PATCH /events/:id
 * Update an event if it belongs to the logged-in user
 */
router.patch(
  "/:id",
  requireAuth,
  validate(updateEventSchema),
  async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    if (Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid event id" });
    }

    const { title, desc, imageUrl } = req.body;

    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    const updatedEvent = await prisma.event.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && { title }),
        ...(desc !== undefined && { desc }),
        ...(imageUrl !== undefined && { imageUrl }),
      },
    });

    res.json(updatedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update event" });
  }
  },
);

/**
 * DELETE /events/:id
 * Delete an event if it belongs to the logged-in user
 */
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    if (Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid event id" });
    }

    const existingEvent = await prisma.event.findFirst({
      where: {
        id,
        ownerId: req.userId,
      },
    });

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    await prisma.event.delete({
      where: {
        id,
      },
    });

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
