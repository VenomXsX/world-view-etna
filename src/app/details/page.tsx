"use client";

import { useRouter } from "next/navigation";

export default function Details() {
  const router = useRouter();
  router.push("/");
  return null;
}
