"use client";

import React, { useState, useEffect } from "react";
import { 
  DndContext, 
  DragOverlay, 
  useSensor, 
  useSensors, 
  MouseSensor, 
  TouchSensor, 
  DragEndEvent, 
  DragStartEvent 
} from "@dnd-kit/core";
import KanbanColumn from "@/components/dashboard/KanbanColumn";
import QuestCard from "@/components/dashboard/QuestCard";
import axios from "axios";

// Data Types
interface Quest {
  _id: string;
  title: string;
  description?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'daily' | 'main' | 'side';
  xp: number;
  category?: string;
  status: 'backlog' | 'todo' | 'doing' | 'done';
}

const COLUMNS = [
  { id: 'backlog', title: 'Quest Log' },
  { id: 'todo', title: 'To Do' },
  { id: 'doing', title: 'In Progress' },
  { id: 'done', title: 'Completed' },
];

export default function KanbanBoard() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeQuest, setActiveQuest] = useState<Quest | null>(null);
  const [loading, setLoading] = useState(true);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  // Fetch Quests
  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const response = await axios.get('http://localhost:3001/quests');
      setQuests(response.data);
    } catch (error) {
      console.error("Failed to fetch quests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const quest = quests.find(q => q._id === active.id);
    if (quest) {
      setActiveQuest(quest);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveQuest(null);

    if (!over) return;

    const questId = active.id as string;
    const newStatus = over.id as Quest['status'];
    const currentQuest = quests.find(q => q._id === questId);

    // If dropped in same column, do nothing
    if (!currentQuest || currentQuest.status === newStatus) return;

    // RULE: Enforce WIP Limit = 1 for "doing" column
    if (newStatus === 'doing') {
      const doingCount = quests.filter(q => q.status === 'doing').length;
      if (doingCount >= 1) {
        // Prevent drop (or maybe show toast)
        // For now, we just return without updating
        console.warn("WIP Limit Reached: Only 1 quest allowed in 'In Progress'");
        return;
      }
    }

    // Optimistic Update
    const originalQuests = [...quests];
    setQuests(quests.map(q => 
      q._id === questId ? { ...q, status: newStatus } : q
    ));

    try {
      // Call API
      await axios.patch(`http://localhost:3001/quests/${questId}/status`, {
        status: newStatus
      });
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert optimistic update
      setQuests(originalQuests);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading mission data...</div>;
  }

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 h-full min-w-max md:min-w-0">
        {COLUMNS.map(col => {
          const columnQuests = quests.filter(q => q.status === col.id);
          return (
            <KanbanColumn 
              key={col.id} 
              title={col.title} 
              status={col.id} 
              count={columnQuests.length}
            >
              {columnQuests.map(quest => (
                <QuestCard key={quest._id} quest={quest} />
              ))}
              
              {columnQuests.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-sm italic border-2 border-dashed border-slate-200 rounded-lg">
                  No quests here yet!
                </div>
              )}
            </KanbanColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeQuest ? <QuestCard quest={activeQuest} /> : null}
      </DragOverlay>
    </DndContext>
  );
}