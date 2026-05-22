import { Router } from "express";
import authRoutes from "./auth.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", service: "careerverse-api" } });
});

router.use("/auth", authRoutes);

export default router;
