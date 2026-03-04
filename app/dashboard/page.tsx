// File: src/app/dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar";
import ChatWindow from "../../components/ChatWindow";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ClassicLoader from "@/components/loader";

export default function DashboardPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Call any protected endpoint
        await api.get("/auth/me");
        setLoading(false);
      } catch {
        router.replace("/");
      }
    };

    verifyUser();
  }, [router]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // simulate loading
  }, []);

  if (loading) {
    return <ClassicLoader />;
  }

  

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#0e0e0e]">
      
      {/* Desktop Sidebar */}
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

      {/* Mobile Sidebar */}
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