"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Link2 } from "lucide-react";

type Props = {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
};

export default function MessageBubble({
    role,
    content,
    sources = [],
}: Props) {
    const [showSources, setShowSources] = useState(false);
    const isUser = role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
        >
            <motion.div
                whileHover={{ scale: 1.01 }}
                className={`relative max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed backdrop-blur-md transition-all duration-200
                ${
                    isUser
                        ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/30"
                        : "bg-[#1e1f20]/80 border border-white/10 text-[#e3e3e3] shadow-lg shadow-black/30"
                }`}
            >
                {/* Content */}
                <p className="whitespace-pre-wrap">{content}</p>

                {/* Assistant Accent Glow */}
                {!isUser && (
                    <div className="absolute -left-2 top-4 h-6 w-1 rounded-full bg-gradient-to-b from-purple-500 to-blue-500 opacity-70" />
                )}

                {/* Sources Section */}
                {!isUser && Array.isArray(sources) && sources.length > 0 && (
                    <div className="mt-4 text-xs text-gray-400 border-t border-white/10 pt-3">
                        <button
                            onClick={() => setShowSources(!showSources)}
                            className="flex items-center gap-2 hover:text-white transition-colors"
                        >
                            <Link2 size={14} />
                            {showSources ? "Hide Sources" : "Show Sources"}
                            {showSources ? (
                                <ChevronUp size={14} />
                            ) : (
                                <ChevronDown size={14} />
                            )}
                        </button>

                        <AnimatePresence>
                            {showSources && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden mt-2 space-y-2"
                                >
                                    {sources.map((src, i) => (
                                        <motion.a
                                            key={i}
                                            href={src}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ x: 4 }}
                                            className="block truncate text-blue-400 hover:text-blue-300 transition"
                                        >
                                            {src}
                                        </motion.a>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}