import express from "express";
import {
  createState,
  getStates,
  getStateById,
  updateState,
  deleteState,
} from "../controllers/coin.controller";
import { authenticateToken } from "../middleware/auth";
const router = express.Router();

// Create a new state
router.post("/", authenticateToken, createState);

// Get all states
router.get("/", authenticateToken, getStates);

// Get a single state by ID
router.get("/:id", authenticateToken, getStateById);

// Update a state by ID
router.patch("/:id", authenticateToken, updateState);

// Delete a state by ID
router.delete("/:id", authenticateToken, deleteState);

export default router;
