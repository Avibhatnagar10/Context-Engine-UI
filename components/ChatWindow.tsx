"use client";

import { useState, useRef, useEffect } from "react";
import {
    Paperclip,
    SendHorizontal,
    Loader2,
    ShieldCheck,
    Sparkles,
    Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";
import api from "@/lib/api";

type Message = {
    role: "user" | "assistant";
    content: string;
    sources?: string[];
};

export default function ChatWindow() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<"rag" | "ingest">("rag");

    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const simulateRagStages = async () => {
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
        const stages = [
            "🔎 Embedding query...",
            "📚 Searching vector index...",
            "🎯 Re-ranking chunks...",
            "Generating response..."
        ];
        for (const stage of stages) {
            setStatus(stage);
            await delay(600);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                setStatus(`📄 Processing ${file.name}...`);
                await api.post("/upload", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } catch {
                console.error("Upload failed");
            }
        }
        setStatus("📚 Knowledge Base Updated");
        setTimeout(() => setStatus(""), 2000);
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            if (mode === "rag") {
                await simulateRagStages();
                const response = await api.get("/rag", { params: { q: userMsg.content } });
                setMessages((prev) => [...prev, {
                    role: "assistant",
                    content: response.data.answer,
                    sources: response.data.sources || [],
                }]);
            } else {
                setStatus("📥 Ingesting data...");
                await api.post("/ingest", { id: crypto.randomUUID(), text: userMsg.content });
                setMessages((prev) => [...prev, {
                    role: "assistant",
                    content: "Knowledge ingested successfully.",
                }]);
            }
        } catch {
            setMessages((prev) => [...prev, {
                role: "assistant",
                content: "⚠️ Connection error.",
            }]);
        } finally {
            setStatus("");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col flex-1 min-h-0 bg-[#0a0a0a] text-[#ececec]">

            {/* Main Chat Content */}
            <div
                className={`flex-1 min-h-0 ${messages.length > 0 ? "overflow-y-auto" : "overflow-hidden"
                    } scrollbar-hide`}
            >
                <AnimatePresence mode="wait">
                    {messages.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-2xl w-full mx-auto px-6 pt-16 sm:pt-24 pb-12 text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
                                <Sparkles size={14} />
                                v1.0 Live Local Intelligence
                            </div>

                            <h1 className="text-[clamp(2.5rem,6vw,3rem)] md:text-5xl font-bold tracking-tight leading-tight mb-6">
                                <span className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent inline-block px-1">
                                    ContextEngine
                                </span>
                            </h1>

                            <p className="text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
                                Intelligence built on your data. Powered locally.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
                                {[
                                    "Analyze my resume for key skills",
                                    "Summarize this technical PDF"
                                ].map((hint, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(hint)}
                                        className="p-4 bg-[#161617] hover:bg-[#1f1f21] transition-all rounded-2xl border border-white/5 text-sm text-gray-400 text-left group"
                                    >
                                        <span className="group-hover:text-white transition-colors">{hint}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="max-w-3xl w-full mx-auto px-4 py-8 space-y-8">
                            {messages.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <MessageBubble {...m} />
                                </motion.div>
                            ))}
                            <div ref={bottomRef} />
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Sticky Footer Section */}
            <div className="relative border-t border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl px-4 py-6">
                <div className="max-w-3xl w-full mx-auto space-y-4">

                    {/* Mode & Status Row */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">

                        <div className="relative flex bg-[#161617] p-1 rounded-2xl border border-white/5 isolate">
                            <motion.div
                                className="absolute inset-y-1 left-1 bg-white/10 rounded-xl"
                                initial={false}
                                animate={{
                                    x: mode === "rag" ? 0 : "80%",
                                    width: mode === "rag" ? "80px" : "97px"
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            />

                            <button
                                onClick={() => setMode("rag")}
                                className={`relative z-10 w-[80px] py-1.5 text-[11px] font-bold tracking-wide ${mode === "rag" ? "text-white" : "text-gray-500"
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-1.5 uppercase">
                                    <Sparkles size={12} /> RAG
                                </div>
                            </button>

                            <button
                                onClick={() => setMode("ingest")}
                                className={`relative z-10 w-[95px] py-1.5 text-[11px] font-bold tracking-wide ${mode === "ingest" ? "text-white" : "text-gray-500"
                                    }`}
                            >
                                <div className="flex items-center justify-center gap-1.5 uppercase">
                                    <Database size={12} /> Ingest
                                </div>
                            </button>
                        </div>

                        <AnimatePresence>
                            {status && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 text-[11px] font-mono text-blue-400"
                                >
                                    <Loader2 size={12} className="animate-spin" />
                                    {status}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-2 bg-[#161617] rounded-[24px] p-2 pl-4 border border-white/10 shadow-2xl">

                        <label className="cursor-pointer p-2.5 hover:bg-white/5 rounded-full transition">
                            <Paperclip size={20} className="text-gray-400" />
                            <input type="file" className="hidden" multiple onChange={handleFileUpload} />
                        </label>

                        <input
                            className="flex-1 bg-transparent outline-none py-2 text-[15px] text-[#efeff1] placeholder-gray-500"
                            placeholder={mode === "rag" ? "Ask your knowledge base..." : "Enter text to ingest..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            disabled={loading}
                        />

                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading}
                            className={`p-2.5 rounded-full ${input.trim() && !loading
                                ? "bg-white text-black"
                                : "bg-white/5 text-gray-600 opacity-50"
                                }`}
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <SendHorizontal size={18} />
                            )}
                        </button>
                    </div>

                    {/* Footer Branding */}
                    <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-[#8e918f]">
                        <ShieldCheck size={12} className="text-green-500" />
                        <span>Running locally • Ollama LLM • Chroma Vector DB</span>
                    </div>

                </div>
            </div>
        </div>
    );
}