import { useState } from "react";

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
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-5 py-4 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white"
            : "bg-[#1e1f20] border border-white/10 text-[#e3e3e3]"
        }`}
      >
        <p className="whitespace-pre-wrap">{content}</p>

        {/* Sources Section */}
        {!isUser && sources.length > 0 && (
          <div className="mt-4 text-xs text-gray-400 border-t border-white/10 pt-3">
            <button
              onClick={() => setShowSources(!showSources)}
              className="hover:text-white transition"
            >
              {showSources ? "Hide Sources ▲" : "Show Sources ▼"}
            </button>

            {showSources && (
              <div className="mt-2 space-y-1">
                {sources.map((src, i) => (
                  <div
                    key={i}
                    className="truncate hover:text-white cursor-pointer"
                  >
                    {src}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}