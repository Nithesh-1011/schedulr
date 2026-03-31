import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  guestName: { type: String, required: true },
  guestEmail: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  timezone: { type: String, default: "Asia/Kolkata" },
  status: { type: String, default: "confirmed" },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema);