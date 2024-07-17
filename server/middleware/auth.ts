import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import User from "../model/user";
// import { UserPayload } from "../types";
const JWT_SECRET = process.env.JWT_SECRET || "SECRET123";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "Incorrect email." });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser((id: string, done) => {
  User.findById(id, (err: any, user: any) => done(err, user));
});

const register = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const payload = { name, email };
      const secret = process.env.SECRET_KEY;
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "1h",
      });
      user = new User({ name, email, password: hashedPassword, token });
      await user.save();
      res.status(201).json({
        message: "New user registered",
        name: user.name,
        email: user.email,
        token: user.token,
        expires: "1h",
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
];

const login = [
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      const payload = { name: user.name, email: user.email };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
      user.token = token;
      user.updatedAt = new Date();
      await user.save();
      res.json({
        name: user.name,
        email: user.email,
        token: user.token,
        expires: "1h",
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
];

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["x-access-token"] as string;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const user = await User.findOne({ email: decoded.email, token });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user.name;
    next();
  } catch (error) {
    res.status(500).json({ message: "Failed to authenticate token", error });
  }
};
export { register, login, authenticateToken };
