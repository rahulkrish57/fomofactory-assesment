import { Schema, model, Document } from "mongoose";

interface IState extends Document {
  name: string;
  email: string;
  password: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IState>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const User = model<IState>("User", userSchema);

export default User;
