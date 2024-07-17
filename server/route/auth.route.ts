import express, { Request, Response } from 'express';
import { register, login} from '../middleware/auth';
const router = express.Router();


// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

export default router;