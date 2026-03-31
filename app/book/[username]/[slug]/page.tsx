"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

export default function BookingPage() {
  const { username, slug } = useParams();
  const [event, setEvent] = useState<any>(null);
  const [host, setHost] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [form, setForm] = useState({ guestName: "", guestEmail: "", notes: "" });
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    fetch(`/api/public/event?username=${username}&slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setEvent(d.event);
        setHost(d.host);
      });
  }, [username, slug]);

  useEffect(() => {
    if (!selectedDate || !event) return;
    fetch(`/api/availability?eventId=${event._id}&date=${selectedDate}`)
      .then((r) => r.json())
      .then((d) => setSlots(d.available || []));
  }, [selectedDate, event]);

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleBook() {
    if (!selectedSlot || !form.guestName || !form.guestEmail) {
      return toast.error("Please fill all fields");
    }
    if (!validateEmail(form.guestEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    setLoading(true);
    try {
      const [h, m] = selectedSlot.split(":").map(Number);
      const endH = h + Math.floor((m + event.duration) / 60);
      const endM = (m + event.duration) % 60;
      const endTime = `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          hostId: host._id,
          guestName: form.guestName,
          guestEmail: form.guestEmail,
          date: selectedDate,
          startTime: selectedSlot,
          endTime,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) return toast.error(data.error);
      setBooked(true);
      toast.success("Booking confirmed!");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );

  if (booked) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl p-8 text-center max-w-md border">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-500">You are booked with <strong>{host?.name}</strong></p>
        <p className="text-gray-500 mt-1">{selectedDate} at {selectedSlot}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Event Info */}
        <div className="bg-white rounded-xl p-6 border mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
            <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          </div>
          <p className="text-gray-500">{event.duration} minutes · with {host?.name}</p>
        </div>

        {/* Date Picker */}
        <div className="bg-white rounded-xl p-6 border mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Select a Date</h2>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedSlot("");
            }}
          />
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="bg-white rounded-xl p-6 border mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Select a Time</h2>
            {slots.length === 0 ? (
              <p className="text-gray-400 text-sm">No slots available for this date</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-lg text-sm font-medium border ${
                      selectedSlot === slot
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Guest Details */}
        {selectedSlot && (
          <div className="bg-white rounded-xl p-6 border mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Your Details</h2>
            <div className="space-y-4">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${
                    emailError
                      ? "border-red-400 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  value={form.guestEmail}
                  onChange={(e) => {
                    setForm({ ...form, guestEmail: e.target.value });
                    if (emailError) setEmailError("");
                  }}
                  onBlur={() => {
                    if (form.guestEmail && !validateEmail(form.guestEmail)) {
                      setEmailError("Please enter a valid email address");
                    }
                  }}
                />
                {emailError && (
                  <p className="text-red-500 text-xs mt-1">{emailError}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Anything you'd like to share before the meeting..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <button
                onClick={handleBook}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}