"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Database,
  FileText,
  HardDrive,
  Settings,
  Trash2,
  RefreshCw,
  Loader2,
  X,
} from "lucide-react";
import api from "@/lib/api";
import clsx from "clsx";

type Document = { name: string };

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

type Option = {
  value: string;
  label: string;
};

export default function Sidebar({
  isCollapsed,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const [llmModel, setLlmModel] = useState("gemma3:4b");
  const [embeddingModel, setEmbeddingModel] = useState(
    "nomic-embed-text:latest"
  );

  const fetchDocuments = async () => {
    try {
      setLoadingDocs(true);
      const res = await api.get("/documents");
      setDocuments(res.data || []);
    } catch {
      console.error("Failed to fetch documents");
    } finally {
      setLoadingDocs(false);
    }
  };

  const deleteDocument = async (name: string) => {
    try {
      await api.delete(`/documents/${name}`);
      setDocuments((prev) =>
        prev.filter((doc) => doc.name !== name)
      );
    } catch {
      console.error("Failed to delete document");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          "fixed top-0 left-0 lg:static z-50",
          "h-[100dvh] w-[280px] bg-[#111113] border-r border-white/5",
          "flex flex-col transition-transform duration-300 ease-in-out",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          isCollapsed && "lg:w-[80px]"
        )}
      >
        <div className="flex flex-col h-full p-4 text-[#e3e3e3] min-h-0">

          {/* Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            {!isCollapsed && (
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Context Engine
              </span>
            )}

            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* New Session */}
          <button
            onClick={() => window.location.reload()}
            className={clsx(
              "flex items-center gap-3 bg-[#1a1c1e] hover:bg-[#26282b] rounded-xl transition border border-white/5",
              isCollapsed
                ? "p-3 justify-center w-12 mx-auto"
                : "px-4 py-3 w-full"
            )}
          >
            <Plus size={18} />
            {!isCollapsed && (
              <span className="text-sm font-medium">
                New Session
              </span>
            )}
          </button>

          {/* Documents */}
          <div className="flex-1 overflow-y-auto mt-8 pr-1 min-h-0">
            {!isCollapsed && (
              <div className="flex items-center justify-between px-2 mb-4 text-gray-500">
                <div className="flex items-center gap-2">
                  <Database size={14} />
                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Local Store
                  </p>
                </div>

                <button
                  onClick={fetchDocuments}
                  className="hover:text-white transition"
                >
                  {loadingDocs ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                </button>
              </div>
            )}

            <div className="space-y-1">
              {documents.map((doc, i) => (
                <div
                  key={i}
                  className={clsx(
                    "group flex items-center justify-between px-3 py-2 text-sm hover:bg-[#25272a] rounded-lg transition",
                    isCollapsed && "justify-center"
                  )}
                >
                  <div className="flex items-center gap-3 truncate">
                    <FileText
                      size={18}
                      className="text-blue-400 shrink-0"
                    />
                    {!isCollapsed && (
                      <span className="truncate text-gray-300">
                        {doc.name}
                      </span>
                    )}
                  </div>

                  {!isCollapsed && (
                    <button
                      onClick={() =>
                        deleteDocument(doc.name)
                      }
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
            <div
              className={clsx(
                "flex items-center gap-3 px-2 py-2 text-sm text-gray-500",
                isCollapsed && "justify-center"
              )}
            >
              <HardDrive size={18} />
              {!isCollapsed && (
                <span>
                  ChromaDB:{" "}
                  <span className="text-green-500">
                    Active
                  </span>
                </span>
              )}
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className={clsx(
                "flex items-center gap-3 px-2 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition",
                isCollapsed && "justify-center"
              )}
            >
              <Settings size={18} />
              {!isCollapsed && <span>Settings</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-[#111113] w-full max-w-[460px] rounded-2xl p-6 shadow-2xl border border-white/10 relative">
            
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-1">
              Ollama Configuration
            </h2>

            <p className="text-xs text-gray-500 mb-6">
              Configure your local model runtime.
            </p>

            <div className="space-y-6">

              <Dropdown
                label="Language Model"
                value={llmModel}
                onChange={setLlmModel}
                options={[
                  { value: "gemma3:4b", label: "gemma3:4b • Fast & Lightweight" },
                  { value: "llama3:8b", label: "llama3:8b • Balanced" },
                  { value: "mistral:7b", label: "mistral:7b • Reasoning" },
                  { value: "phi3:mini", label: "phi3:mini • Ultra Fast" },
                ]}
              />

              <Dropdown
                label="Embedding Model"
                value={embeddingModel}
                onChange={setEmbeddingModel}
                options={[
                  { value: "nomic-embed-text:latest", label: "nomic-embed-text • Recommended" },
                  { value: "all-minilm", label: "all-minilm • Lightweight" },
                  { value: "bge-base", label: "bge-base • High Quality" },
                ]}
              />
            </div>

            <button
              onClick={() => {
                console.log("LLM:", llmModel);
                console.log("Embedding:", embeddingModel);
                setShowSettings(false);
              }}
              className="mt-8 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition active:scale-[0.98]"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------ CUSTOM DROPDOWN ------------------ */

function Dropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: Option[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="text-xs text-gray-400 block mb-2 uppercase font-bold tracking-widest">
        {label}
      </label>

      <button
        onClick={() => setOpen(!open)}
        className="w-full bg-[#1a1c1e] border border-white/10 rounded-xl px-4 py-3 text-sm flex items-center justify-between hover:bg-[#222427] transition"
      >
        <span>
          {options.find((o) => o.value === value)?.label}
        </span>
        <span className="text-gray-500">▾</span>
      </button>

      {open && (
        <div className="absolute mt-2 w-full bg-[#161618] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-[#222427] transition ${
                value === option.value
                  ? "bg-[#1f2124] text-blue-400"
                  : "text-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}