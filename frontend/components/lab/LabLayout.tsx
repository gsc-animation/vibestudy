'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, FlaskConical, Settings, RotateCcw, PenTool, BookOpen } from 'lucide-react';

interface LabLayoutProps {
    children: ReactNode;
    notebook: ReactNode;
    title?: string;
}

const LabLayout: React.FC<LabLayoutProps> = ({ children, notebook, title = "Virtual Lab" }) => {
    const [isNotebookOpen, setIsNotebookOpen] = useState(true);

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden">
            {/* Top Bar */}
            <header className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/dashboard" 
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Back to Dashboard"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                            <FlaskConical size={18} />
                        </div>
                        <h1 className="font-semibold text-lg tracking-tight">{title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Settings"
                    >
                        <Settings size={20} />
                    </button>
                    <button
                        onClick={() => setIsNotebookOpen(!isNotebookOpen)}
                        className={`p-2 rounded-lg transition-colors ${
                            isNotebookOpen 
                                ? 'bg-indigo-600 text-white' 
                                : 'hover:bg-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title="Toggle Notebook"
                    >
                        <BookOpen size={20} />
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Game Canvas Area */}
                <main className="flex-1 relative bg-black/50 overflow-hidden flex flex-col">
                    <div className="flex-1 relative">
                        {children}
                    </div>
                    
                    {/* Bottom Toolbar */}
                    <div className="h-16 bg-slate-800 border-t border-slate-700 px-4 flex items-center justify-center gap-4 shrink-0 z-20">
                        <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors group">
                            <RotateCcw size={20} className="group-hover:-rotate-90 transition-transform" />
                            <span className="text-xs font-medium">Reset</span>
                        </button>
                        <div className="w-px h-8 bg-slate-700 mx-2" />
                        <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                            <PenTool size={20} />
                            <span className="text-xs font-medium">Tools</span>
                        </button>
                        {/* Add more tool buttons here later */}
                    </div>
                </main>

                {/* Notebook Sidebar */}
                <aside 
                    className={`
                        w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40
                        absolute right-0 top-0 bottom-0
                        ${isNotebookOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}
                >
                   {notebook}
                   {/* Toggle handle when closed could go here if we wanted a permanent visible handle */}
                </aside>
            </div>
        </div>
    );
};

export default LabLayout;