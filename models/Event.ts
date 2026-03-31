import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  duration: { type: Number, default: 30 },
  color: { type: String, default: "#3B82F6" },
  isActive: { type: Boolean, default: true },
  days: [{ type: Number }],         
  startTime: { type: String, default: "09:00" },
  endTime: { type: String, default: "17:00" },
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model("Event", EventSchema);