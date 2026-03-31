"use client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 border text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-500 mb-4">Coming soon</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}