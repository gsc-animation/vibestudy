"use client";

import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KanbanBoard from "@/components/dashboard/KanbanBoard";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Dashboard Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Mission Board</h1>
          <p className="text-slate-500">Track your active quests and claim your rewards!</p>
        </div>

        {/* Kanban Board Area */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
          <KanbanBoard />
        </div>
      </div>
    </DashboardLayout>
  );
}