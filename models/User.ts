import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  timezone: { type: String, default: "Asia/Kolkata" },
  googleCalendarToken: { type: String, default: null },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);