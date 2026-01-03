import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Sword,
  Shield,
  Book, 
  Zap, 
  Trophy,
  Clock,
  MoreHorizontal
} from "lucide-react";

interface Quest {
  _id: string;
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'daily' | 'main' | 'side';
  xp: number;
  category?: string; // e.g., 'math', 'coding', 'health'
}

interface QuestCardProps {
  quest: Quest;
}

export default function QuestCard({ quest }: QuestCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: quest._id,
    data: { ...quest },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-200';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getQuestIcon = (category?: string) => {
    // Determine icon based on category or type
    // This assumes we might pass a category. Defaults to Sword (generic quest).
    if (!category) return <Sword size={16} aria-hidden="true" />;
    
    const cat = category.toLowerCase();
    if (cat.includes('math') || cat.includes('study')) return <Book size={16} aria-hidden="true" />;
    if (cat.includes('health') || cat.includes('fitness')) return <Shield size={16} aria-hidden="true" />;
    if (cat.includes('code') || cat.includes('tech')) return <Zap size={16} aria-hidden="true" />;
    
    return <Sword size={16} aria-hidden="true" />;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing group touch-none"
      role="article"
      aria-label={`Quest: ${quest.title}`}
    >
      {/* Card Header: Labels */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-1.5">
          <span
            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${getDifficultyColor(quest.difficulty)}`}
            aria-label={`Difficulty: ${quest.difficulty}`}
          >
            {quest.difficulty}
          </span>
          <span
            className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border bg-indigo-50 text-indigo-700 border-indigo-200"
            aria-label={`Type: ${quest.type}`}
          >
            {quest.type}
          </span>
        </div>
        <button
          className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="More options"
        >
          <MoreHorizontal size={16} aria-hidden="true" />
        </button>
      </div>

      {/* Quest Title & Icon */}
      <div className="flex items-start gap-2 mb-3">
        <div className="mt-0.5 p-1.5 bg-slate-100 text-slate-500 rounded-md" aria-hidden="true">
          {getQuestIcon(quest.category)}
        </div>
        <h4 className="font-semibold text-slate-800 text-sm leading-tight line-clamp-2">
          {quest.title}
        </h4>
      </div>

      {/* Footer: Rewards & Info */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-t pt-2 mt-2">
        <div className="flex items-center gap-1 font-medium text-amber-600" aria-label={`Reward: ${quest.xp} XP`}>
          <Trophy size={12} aria-hidden="true" />
          <span>{quest.xp} XP</span>
        </div>
        {/* Placeholder for due date or other meta info */}
        <div className="flex items-center gap-1" aria-label="Frequency: Daily">
          <Clock size={12} aria-hidden="true" />
          <span>Daily</span>
        </div>
      </div>
    </div>
  );
}