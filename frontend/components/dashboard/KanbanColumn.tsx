import React, { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

interface KanbanColumnProps {
  title: string;
  status: string;
  count: number;
  children: ReactNode;
}

export default function KanbanColumn({ title, status, count, children }: KanbanColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });

  // Determine color theme based on status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'backlog':
        return 'bg-slate-100 border-slate-200 text-slate-700';
      case 'todo':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'doing':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'done':
        return 'bg-green-50 border-green-200 text-green-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getHeaderColor = (status: string) => {
    switch (status) {
      case 'backlog': return 'bg-slate-200 text-slate-800';
      case 'todo': return 'bg-blue-200 text-blue-900';
      case 'doing': return 'bg-amber-200 text-amber-900';
      case 'done': return 'bg-green-200 text-green-900';
      default: return 'bg-slate-200 text-slate-800';
    }
  };

  // Logic to highlight when dragging over
  const droppableStyle = isOver ? 'ring-2 ring-offset-2 ring-indigo-400 bg-opacity-80' : '';

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col h-full min-w-[280px] w-full md:w-[280px] rounded-xl border-2 transition-all ${getStatusColor(status).split(' ')[1]} ${droppableStyle}`}
    >
      {/* Header */}
      <div className={`p-3 rounded-t-lg flex items-center justify-between ${getHeaderColor(status)}`}>
        <h3 className="font-bold uppercase tracking-wider text-sm">{title}</h3>
        <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold">
          {count}
        </span>
      </div>
      
      {/* Content Area */}
      <div className={`flex-1 p-2 space-y-3 overflow-y-auto ${getStatusColor(status).split(' ')[0]}`}>
        {children}
      </div>
    </div>
  );
}