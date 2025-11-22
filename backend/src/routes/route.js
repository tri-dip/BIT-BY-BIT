import { Router } from "express";
import focusRoutes from "./focus.routes.js";

const router = Router();

router.use("/focus", focusRoutes);
router.use("/timer", timerRoutes);
router.use("/stats", statsRoutes);

export default router;
