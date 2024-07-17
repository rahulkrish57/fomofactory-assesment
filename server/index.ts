import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import passport from 'passport';
import cors from "cors";
import next from 'next';
import database from "./database";
import coinRoutes from "./route/coin.route";
import authRoutes from "./route/auth.route";

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 4000;

app.prepare().then(() => {
  const server = express();

  // Middleware
  server.use(cors());
  server.use(express.json());
  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({ extended: true }));
  server.use(morgan("dev"));
  server.use(passport.initialize());

  // Connect to Database
  database();

  // Health Check Route
  server.get("/", (req, res) => {
    res.status(200).json({ status: "Home Page API UP" });
  });

  server.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
  });

  // Routes
  server.use("/api/v1", coinRoutes);
  server.use("/api/auth", authRoutes);

  // Next.js request handler
  server.all('*', (req: Request, res: Response) => {
    return handle(req, res);
  });

  // Error Handling
  server.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Not Found");
    (error as any).status = 404;
    next(error);
  });

  server.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message,
      },
    });
  });

  // Start Server
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error('Error preparing Next.js app:', err);
});
