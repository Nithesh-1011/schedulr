"use client";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const router = useRouter();
  router.push("/dashboard");
  return null;
}