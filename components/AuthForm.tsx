"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

type Props = {
  type: "login" | "register";
};

export default function AuthForm({ type }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const endpoint = type === "login" ? "/auth/login" : "/auth/register";

      const res = await api.post(endpoint, {
        email,
        password,
      });

      localStorage.setItem("access_token", res.data.access_token);

      router.push("/dashboard");
    } catch {
      alert("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black">
      <div className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {type === "login" ? "Welcome Back" : "Create Account"}
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 rounded-lg bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition"
        >
          {loading ? "Processing..." : type === "login" ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
}