import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* Hero */}
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Scheduling made <span className="text-blue-600">simple</span>
        </h1>
        <p className="text-xl text-gray-500 mb-8">
          Share your link. Let others book time with you. No back-and-forth emails.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-4xl w-full">
        {[
          { title: "Share Your Link", desc: "Get a personal booking link to share with anyone" },
          { title: "Set Availability", desc: "Choose which days and times work for you" },
          { title: "Auto Confirmation", desc: "Bookings are instantly confirmed for both parties" },
        ].map((f) => (
          <div key={f.title} className="bg-gray-50 rounded-xl p-6 text-center">
            <h3 className="font-semibold text-gray-900 text-lg mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

    </main>
  );
}