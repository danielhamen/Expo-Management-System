import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { requireAuth, type AuthRequest } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createBoothSchema, updateBoothSchema } from "../schemas/booth.js";

const router = Router();

/**
 * GET /booths/event/:eventId
 * Get all booths for one event if the event belongs to the logged-in user
 */
router.get("/event/:eventId", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { eventId } = req.params;

    if (Array.isArray(eventId)) {
      return res.status(400).json({ error: "Invalid event id" });
    }

    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        ownerId: req.userId,
      },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const booths = await prisma.booth.findMany({
      where: {
        eventId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(booths);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch booths" });
  }
});

/**
 * GET /booths/scan/:qrCodeSlug
 * Resolve a QR code slug and return booth info for the logged-in user
 * Useful when a QR code opens your frontend and the frontend calls this endpoint
 */
router.get("/scan/:qrCodeSlug", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { qrCodeSlug } = req.params;

    if (Array.isArray(qrCodeSlug)) {
      return res.status(400).json({ error: "Invalid QR code slug" });
    }

    const booth = await prisma.booth.findFirst({
      where: {
        qrCodeSlug,
        hidden: false,
      },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            desc: true,
            imageUrl: true,
          },
        },
      },
    });

    if (!booth) {
      return res.status(404).json({ error: "Booth not found" });
    }

    const existingVisit = await prisma.boothVisit.findUnique({
      where: {
        userId_boothId: {
          userId: req.userId!,
          boothId: booth.id,
        },
      },
    });

    res.json({
      booth,
      alreadyVisited: !!existingVisit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to resolve booth QR code" });
  }
});

/**
 * POST /booths/scan/:qrCodeSlug/enter
 * Enter the logged-in user into the booth contest using the QR slug
 */
router.post(
  "/scan/:qrCodeSlug/enter",
  requireAuth,
  async (req: AuthRequest, res) => {
    try {
      const { qrCodeSlug } = req.params;

      if (Array.isArray(qrCodeSlug)) {
        return res.status(400).json({ error: "Invalid QR code slug" });
      }

      const booth = await prisma.booth.findFirst({
        where: {
          qrCodeSlug,
          hidden: false,
        },
        include: {
          event: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      if (!booth) {
        return res.status(404).json({ error: "Booth not found" });
      }

      const existingVisit = await prisma.boothVisit.findUnique({
        where: {
          userId_boothId: {
            userId: req.userId!,
            boothId: booth.id,
          },
        },
      });

      if (existingVisit) {
        return res.status(200).json({
          message: "User already entered this booth contest",
          alreadyVisited: true,
          booth: {
            id: booth.id,
            name: booth.name,
            desc: booth.desc,
            qrCodeSlug: booth.qrCodeSlug,
          },
          event: booth.event,
          boothVisit: existingVisit,
        });
      }

      const boothVisit = await prisma.boothVisit.create({
        data: {
          user: {
            connect: {
              id: req.userId,
            },
          },
          booth: {
            connect: {
              id: booth.id,
            },
          },
        },
      });

      res.status(201).json({
        message: "Booth contest entry created successfully",
        alreadyVisited: false,
        booth: {
          id: booth.id,
          name: booth.name,
          desc: booth.desc,
          qrCodeSlug: booth.qrCodeSlug,
        },
        event: booth.event,
        boothVisit,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to enter booth contest" });
    }
  },
);

/**
 * GET /booths/:id
 * Get one booth if it belongs to an event owned by the logged-in user
 */
router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    if (Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid booth id" });
    }

    const booth = await prisma.booth.findFirst({
      where: {
        id,
        event: {
          ownerId: req.userId,
        },
      },
      include: {
        event: true,
      },
    });

    if (!booth) {
      return res.status(404).json({ error: "Booth not found" });
    }

    res.json(booth);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch booth" });
  }
});

/**
 * POST /booths
 * Create a booth under one of the logged-in user's events
 */
router.post(
  "/",
  requireAuth,
  validate(createBoothSchema),
  async (req: AuthRequest, res) => {
    try {
      const { eventId, name, desc, hidden } = req.body;

      const event = await prisma.event.findFirst({
        where: {
          id: eventId,
          ownerId: req.userId,
        },
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const booth = await prisma.booth.create({
        data: {
          name,
          desc,
          hidden: typeof hidden === "boolean" ? hidden : false,
          event: {
            connect: {
              id: eventId,
            },
          },
        },
      });

      res.status(201).json(booth);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create booth" });
    }
  },
);

/**
 * PATCH /booths/:id
 * Update a booth if it belongs to an event owned by the logged-in user
 */
router.patch(
  "/:id",
  requireAuth,
  validate(updateBoothSchema),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;

      if (Array.isArray(id)) {
        return res.status(400).json({ error: "Invalid booth id" });
      }

      const { name, desc, hidden } = req.body;

      const existingBooth = await prisma.booth.findFirst({
        where: {
          id,
          event: {
            ownerId: req.userId,
          },
        },
      });

      if (!existingBooth) {
        return res.status(404).json({ error: "Booth not found" });
      }

      const updatedBooth = await prisma.booth.update({
        where: {
          id,
        },
        data: {
          ...(name !== undefined && { name }),
          ...(desc !== undefined && { desc }),
          ...(hidden !== undefined && { hidden }),
        },
      });

      res.json(updatedBooth);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to update booth" });
    }
  },
);

/**
 * DELETE /booths/:id
 * Delete a booth if it belongs to an event owned by the logged-in user
 */
router.delete("/:id", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    if (Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid booth id" });
    }

    const existingBooth = await prisma.booth.findFirst({
      where: {
        id,
        event: {
          ownerId: req.userId,
        },
      },
    });

    if (!existingBooth) {
      return res.status(404).json({ error: "Booth not found" });
    }

    await prisma.booth.delete({
      where: {
        id,
      },
    });

    res.json({ message: "Booth deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete booth" });
  }
});

/**
 * GET /booths/:id/visits
 * Get all contest entries for one booth if the booth belongs to the logged-in user
 */
router.get("/:id/visits", requireAuth, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    if (Array.isArray(id)) {
      return res.status(400).json({ error: "Invalid booth id" });
    }

    const booth = await prisma.booth.findFirst({
      where: {
        id,
        event: {
          ownerId: req.userId,
        },
      },
    });

    if (!booth) {
      return res.status(404).json({ error: "Booth not found" });
    }

    const visits = await prisma.boothVisit.findMany({
      where: {
        boothId: id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(visits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch booth visits" });
  }
});

export default router;
