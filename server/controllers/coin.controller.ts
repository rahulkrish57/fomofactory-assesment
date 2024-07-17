import { Request, Response } from "express";
import State from "../model/coin";
import User from "../model/user";

// Create a new state
export const createState = async (req: Request, res: Response) => {
  const { name, description, status } = req.body;
  const updateData = {
    name,
    description,
    status,
    createdBy: req.user,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  try {
    const state = new State(updateData);
    await state.save();
    res.status(201).json({ message: "New State Created" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all states
export const getStates = async (req: Request, res: Response) => {
  try {
    const states = await State.find();
    res.status(200).json(states);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single state by ID
export const getStateById = async (req: Request, res: Response) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json(state);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update a state by ID
export const updateState = async (req: Request, res: Response) => {
  try {
    const updateData = {
      updatedAt: new Date(),
      ...req.body,
    };
    const state = await State.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json({ message: "State updated" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a state by ID
export const deleteState = async (req: Request, res: Response) => {
  try {
    const state = await State.findByIdAndDelete(req.params.id);
    if (!state) {
      return res.status(404).json({ message: "State not found" });
    }
    res.status(200).json({ message: "State deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
