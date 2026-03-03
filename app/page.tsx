"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShaderAnimation } from "@/components/ShaderAnimation";
import { FcGoogle } from "react-icons/fc";
import { ShieldCheck } from "lucide-react";


export default function HomePage() {
  const router = useRouter();
 
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:8000/auth/login";
  };

  

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-black">

      {/* LEFT AUTH PANEL */}
      <motion.div
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-20 w-full max-w-md 
          bg-gradient-to-b from-zinc-900 to-black
          border-r border-white/10 
          flex flex-col justify-center px-10
          shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70" />

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-semibold text-white tracking-tight"
        >
          Enter the Engine
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 text-xl mt-3 mb-10 max-w-sm"
        >
          Continue with secure authentication.
        </motion.p>

        <div className="space-y-5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            className="group relative w-full flex items-center justify-center gap-3 py-3.5 rounded-xl
              bg-white text-black font-medium
              shadow-lg hover:shadow-xl
              transition-all duration-300"
          >
            <FcGoogle size={20} />
            Continue with Google
            <span className="absolute inset-0 rounded-xl ring-1 ring-black/10 group-hover:ring-black/20 transition" />
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-xs text-zinc-500 flex items-center gap-2"
        >
          <ShieldCheck size={14} />
          Secure authentication powered by your backend
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE SHADER */}
      <div className="relative flex-1 hidden md:block">
        <ShaderAnimation />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.8, // This is your transition delay
              ease: [0.22, 1, 0.36, 1], // Expressive "Out" easing
            }}
            className="flex flex-col items-center"
          >
            <span className="pointer-events-none text-center text-6xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">
              Context Engine
            </span>

            {/* Subtle underline or accent to anchor the text */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "60%", opacity: 1 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mt-4"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}