import express from "express";
import { searchAvailableHotels } from "../controllers/search.controller.js";

const router = express.Router();

/*
  HERO SEARCH ONLY
*/
router.post("/availability", searchAvailableHotels);

export default router;
