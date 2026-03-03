//app/dashboard/page.tsx
//  It contains the sidebar and the chat window.

"use client";

import { useState } from "react";
import Sidebar from "../../components/sidebar";
import ChatWindow from "../../components/ChatWindow";
import { Menu } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/lib/auth";

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const router = useRouter();

useEffect(() => {
  const token = getAccessToken();

  if (!token) {
    router.push("/");
  }
}, [router]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#0e0e0e]">
      
      {/* Desktop Sidebar (takes space) */}
      <div
        className={`hidden lg:flex ${
          isCollapsed ? "w-[80px]" : "w-[280px]"
        } transition-all duration-300`}
      >
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={false}
          setIsMobileOpen={setIsMobileOpen}
        />
      </div>

      {/* Mobile Sidebar (overlay only) */}
      <div className="lg:hidden">
        <Sidebar
          isCollapsed={false}
          setIsCollapsed={setIsCollapsed}
          isMobileOpen={isMobileOpen}
          setIsMobileOpen={setIsMobileOpen}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1 min-w-0">

        {/* Mobile Top Bar */}
        <div className="lg:hidden flex items-center p-3 border-b border-white/5">
          <button onClick={() => setIsMobileOpen(true)}>
            <Menu size={18} />
          </button>
        </div>

        <ChatWindow />
      </div>
    </div>
  );
}