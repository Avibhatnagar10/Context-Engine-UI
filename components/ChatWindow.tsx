"use client";

import { useState, useRef, useEffect } from "react";
import {
    Paperclip,
    SendHorizontal,
    ShieldCheck,
    Sparkles,
    Database,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import api from "@/lib/api";

type Message = {
    id: string;
    role: "user" | "assistant";
    content: string;
    sources?: string[];
};

function TypingIndicator() {
    return (
        <div className="flex gap-1 px-2 py-1">
            {[0, 1, 2].map((i) => (
                <motion.span
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: i * 0.2,
                    }}
                />
            ))}
        </div>
    );
}

export default function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"rag" | "ingest">("rag");

    const bottomRef = useRef<HTMLDivElement>(null);

    // Smart Auto Scroll
    useEffect(() => {
        const el = bottomRef.current;
        if (!el) return;

        const container = el.closest(".scroll-container");
        if (!container) return;

        const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight < 120;

        if (isNearBottom) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleFileUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append("file", file);

            try {
                setStatus(`Processing ${file.name}...`);
                await api.post("/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } catch {
                setStatus("Upload failed.");
            }
        }

        setStatus("Knowledge base updated.");
        setTimeout(() => setStatus(""), 2000);
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: crypto.randomUUID(),
            role: "user",
            content: input,
        };

        const assistantPlaceholder: Message = {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "",
        };

        setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
        setInput("");
        setLoading(true);

        try {
            if (mode === "rag") {
                setStatus("Generating response...");

                const response = await api.get("/rag", {
                    params: { q: userMessage.content },
                });

                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantPlaceholder.id
                            ? {
                                  ...m,
                                  content: response.data.answer,
                                  sources: response.data.sources || [],
                              }
                            : m
                    )
                );
            } else {
                setStatus("Ingesting data...");

                await api.post("/ingest", {
                    id: crypto.randomUUID(),
                    text: userMessage.content,
                });

                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantPlaceholder.id
                            ? {
                                  ...m,
                                  content: "Knowledge ingested successfully.",
                              }
                            : m
                    )
                );
            }
        } catch {
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantPlaceholder.id
                        ? { ...m, content: "Connection error." }
                        : m
                )
            );
        } finally {
            setLoading(false);
            setStatus("");
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-[#0b0b0c] text-[#e8e8ea] relative">

            {/* Subtle Top Depth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_60%)] pointer-events-none" />

            {/* Chat Area */}
            <div
                className={`scroll-container flex-1 min-h-0 ${
                    messages.length > 0
                        ? "overflow-y-auto"
                        : "overflow-hidden"
                }`}
            >
                <AnimatePresence>
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-2xl mx-auto px-6 pt-24 text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs mb-6">
                                <Sparkles size={14} />
                                Local Intelligence
                            </div>

                            <h1 className="text-4xl font-semibold tracking-tight mb-4">
                                ContextEngine
                            </h1>

                            <p className="text-gray-400 max-w-md mx-auto">
                                Intelligence built on your data. Powered locally.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                            {messages.map((m) => (
                                <motion.div
                                    key={m.id}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {m.role === "assistant" &&
                                    loading &&
                                    !m.content ? (
                                        <TypingIndicator />
                                    ) : (
                                        <MessageBubble {...m} />
                                    )}
                                </motion.div>
                            ))}
                            <div ref={bottomRef} />
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 bg-[#0b0b0c]/80 backdrop-blur-lg px-4 py-6">
                <div className="max-w-3xl mx-auto space-y-4">

                    {/* Mode Toggle */}
                    <div className="flex items-center gap-4">

                        <div className="relative flex bg-[#161617] p-1 rounded-xl border border-white/10">
                            <motion.div
                                layout
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 35,
                                }}
                                className={`absolute top-1 bottom-1 rounded-lg bg-white/10 ${
                                    mode === "rag"
                                        ? "left-1 w-[80px]"
                                        : "left-[82px] w-[95px]"
                                }`}
                            />

                            <button
                                onClick={() => setMode("rag")}
                                className={`relative z-10 w-[80px] py-1.5 text-xs font-medium ${
                                    mode === "rag"
                                        ? "text-white"
                                        : "text-gray-500"
                                }`}
                            >
                                <Sparkles size={12} className="inline mr-1" />
                                RAG
                            </button>

                            <button
                                onClick={() => setMode("ingest")}
                                className={`relative z-10 w-[95px] py-1.5 text-xs font-medium ${
                                    mode === "ingest"
                                        ? "text-white"
                                        : "text-gray-500"
                                }`}
                            >
                                <Database size={12} className="inline mr-1" />
                                Ingest
                            </button>
                        </div>

                        {status && (
                            <div className="text-xs text-gray-400 font-mono">
                                {status}
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <motion.div
                        whileFocus={{ scale: 1.01 }}
                        className="flex items-center gap-2 bg-[#161617] rounded-2xl p-2 pl-4 border border-white/10"
                    >
                        <label className="cursor-pointer p-2 rounded-full hover:bg-white/5 transition">
                            <Paperclip size={18} className="text-gray-400" />
                            <input
                                type="file"
                                className="hidden"
                                multiple
                                onChange={handleFileUpload}
                            />
                        </label>

                        <input
                            className="flex-1 bg-transparent outline-none py-2 text-sm text-white placeholder-gray-500"
                            placeholder={
                                mode === "rag"
                                    ? "Ask your knowledge base..."
                                    : "Enter text to ingest..."
                            }
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                            disabled={loading}
                        />

                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className={`p-2 rounded-full transition ${
                                input.trim() && !loading
                                    ? "bg-white text-black"
                                    : "bg-white/5 text-gray-500"
                            }`}
                        >
                            <SendHorizontal size={16} />
                        </button>
                    </motion.div>

                    <div className="flex justify-center text-[11px] text-gray-500 mt-2">
                        <ShieldCheck size={12} className="mr-1 text-green-500" />
                        Running locally • Ollama • Chroma
                    </div>
                </div>
            </div>
        </div>
    );
}