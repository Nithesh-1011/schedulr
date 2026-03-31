"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [googleConnected, setGoogleConnected] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (!stored || !token) { router.push("/login"); return; }

    const parsedUser = JSON.parse(stored);
    setUser(parsedUser);

    // Check google connection
    const params = new URLSearchParams(window.location.search);
    if (params.get("google") === "connected") {
      localStorage.setItem("googleConnected", "true");
    }
    if (localStorage.getItem("googleConnected") === "true") {
      setGoogleConnected(true);
    }

    // Fetch events
    fetch("/api/events", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setEvents(d.events || []));

    // Fetch bookings
    fetch(`/api/bookings?hostId=${parsedUser._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setBookings(d.bookings || []));

  }, []);

  function logout() {
    localStorage.clear();
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-xl font-bold text-blue-600">Schedulr</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-600">Hey, {user.name} 👋</span>

          {googleConnected ? (
            <span className="text-sm bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-lg">
              ✅ Google Calendar Connected
            </span>
          ) : (
            <button
              onClick={() => {
                const token = localStorage.getItem("token");
                window.location.href = `/api/auth/google?token=${token}`;
              }}
              className="text-sm bg-white border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              🗓️ Connect Google Calendar
            </button>
          )}

          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Booking Link */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-600 mb-1">Your booking link:</p>
          <p className="font-mono text-blue-600 text-sm break-all">
            {process.env.NEXT_PUBLIC_APP_URL}/book/{user.username}
          </p>
        </div>

        {/* Events Section */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Your Event Types</h2>
          <button
            onClick={() => router.push("/events/new")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            + New Event
          </button>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 text-gray-400 bg-white rounded-xl border">
            <p className="text-lg">No events yet</p>
            <p className="text-sm mt-1">Create your first event type to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div key={event._id} className="bg-white rounded-xl p-5 border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
                  <div>
                    <p className="font-semibold text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">{event.duration} minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${process.env.NEXT_PUBLIC_APP_URL}/book/${user.username}/${event.slug}`
                    );
                    alert("Link copied!");
                  }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Copy Link
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bookings Section */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-white rounded-xl border">
              <p>No bookings yet</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {bookings.map((booking) => (
                <div key={booking._id} className="bg-white rounded-xl p-4 border flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">{booking.guestName}</p>
                    <p className="text-sm text-gray-500">{booking.guestEmail}</p>
                    <p className="text-sm text-gray-500">{booking.date} at {booking.startTime}</p>
                  </div>
                  <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-full">
                    {booking.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}