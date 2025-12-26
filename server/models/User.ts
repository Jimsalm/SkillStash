import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "user";
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, "Input your name"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Input your email"],
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, "Input your password"],
    trim: true,
  },

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

export default mongoose.model<IUser>("User", UserSchema);
