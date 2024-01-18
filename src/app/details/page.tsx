"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Details() {
  const router = useRouter();
  useEffect(() => router.back(),[])
  return null;
}
