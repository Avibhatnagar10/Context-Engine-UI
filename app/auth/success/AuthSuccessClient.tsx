"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthSuccessClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      router.replace("/");
      return;
    }

    localStorage.setItem("access_token", token);

    router.replace("/dashboard");
  }, [searchParams, router]);

  return null;
}