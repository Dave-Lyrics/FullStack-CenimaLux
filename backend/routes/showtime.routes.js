import express from "express";
import {
  createShowtime, getShowtimes, getShowtime, getAllShowtimesAdmin,
  updateShowtime, deleteShowtime,
} from "../controllers/showtime.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/", getShowtimes);                          // public
router.get("/admin/all", protectRoute, getAllShowtimesAdmin);
router.get("/:id", getShowtime);                        // public (seat map)
router.post("/", protectRoute, createShowtime);
router.put("/:id", protectRoute, updateShowtime);
router.delete("/:id", protectRoute, deleteShowtime);

export default router;