"use client";

import React, { ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { 
  LogOut, 
  Map, 
  User, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-indigo-900 text-white transform transition-transform duration-200 ease-in-out
          lg:transform-none flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        aria-label="Main Navigation"
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold tracking-tight flex items-center gap-2" aria-label="VibeQuest Dashboard">
            <span className="text-3xl" aria-hidden="true">🛡️</span>
            <span>VibeQuest</span>
          </Link>
          <button
            onClick={toggleSidebar}
            className="lg:hidden text-white/80 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        {/* User Profile Summary */}
        <div className="px-6 py-4 bg-indigo-800/50 mx-4 rounded-xl mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-lg font-bold border-2 border-indigo-300">
              {session?.user?.name?.[0] || "H"}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold truncate">{session?.user?.name || "Hero"}</p>
              <p className="text-xs text-indigo-200 truncate">{session?.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2" aria-label="Sidebar Navigation">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-700/50 text-white font-medium shadow-sm ring-1 ring-white/10"
            aria-current="page"
          >
            <Map size={20} aria-hidden="true" />
            <span>Quest Board</span>
          </Link>
          <button
            disabled
            aria-disabled="true"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-300 hover:bg-indigo-800/30 hover:text-white transition-colors text-left opacity-70 cursor-not-allowed"
          >
            <User size={20} aria-hidden="true" />
            <span>Profile (Coming Soon)</span>
          </button>
          <button
            disabled
            aria-disabled="true"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-300 hover:bg-indigo-800/30 hover:text-white transition-colors text-left opacity-70 cursor-not-allowed"
          >
            <Settings size={20} aria-hidden="true" />
            <span>Settings (Coming Soon)</span>
          </button>
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-indigo-800">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-indigo-200 hover:bg-red-500/20 hover:text-red-200 transition-colors"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 -ml-2 rounded-lg hover:bg-slate-100 text-slate-600"
              aria-label="Open sidebar"
              aria-expanded={isSidebarOpen}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
            <span className="font-bold text-slate-800">VibeQuest</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm" aria-label={`User: ${session?.user?.name || "Hero"}`}>
            {session?.user?.name?.[0] || "H"}
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50 p-4 md:p-8" id="main-content">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}