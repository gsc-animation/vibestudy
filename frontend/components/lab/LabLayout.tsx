'use client';

import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, FlaskConical, Settings, RotateCcw, PenTool, BookOpen, Glasses } from 'lucide-react';
import { useLab } from '../../contexts/LabContext';

interface LabLayoutProps {
    children: ReactNode;
    notebook: ReactNode;
    title?: string;
}

const LabLayout: React.FC<LabLayoutProps> = ({ children, notebook, title = "Virtual Lab" }) => {
    const [isNotebookOpen, setIsNotebookOpen] = useState(true);
    const { showOverlay, setShowOverlay } = useLab();

    // Optimize handlers
    const toggleNotebook = React.useCallback(() => {
        setIsNotebookOpen(prev => !prev);
    }, []);

    const toggleOverlay = React.useCallback(() => {
        setShowOverlay(prev => !prev);
    }, [setShowOverlay]);

    return (
        <div className="flex flex-col h-screen bg-slate-900 text-slate-100 overflow-hidden">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-white focus:text-indigo-900 focus:rounded-lg focus:shadow-xl font-bold"
            >
                Skip to main content
            </a>
            {/* Top Bar */}
            <header role="banner" className="h-14 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4 shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/dashboard" 
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Back to Dashboard"
                    >
                        <ChevronLeft size={20} />
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400" aria-hidden="true">
                            <FlaskConical size={18} />
                        </div>
                        <h1 className="font-semibold text-lg tracking-tight">{title}</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                        title="Settings"
                        aria-label="Settings"
                    >
                        <Settings size={20} aria-hidden="true" />
                    </button>
                    <button
                        onClick={toggleNotebook}
                        className={`p-2 rounded-lg transition-colors ${
                            isNotebookOpen
                                ? 'bg-indigo-600 text-white'
                                : 'hover:bg-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title={isNotebookOpen ? "Close Notebook" : "Open Notebook"}
                        aria-label={isNotebookOpen ? "Close Notebook" : "Open Notebook"}
                        aria-expanded={isNotebookOpen}
                    >
                        <BookOpen size={20} aria-hidden="true" />
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Game Canvas Area */}
                <main id="main-content" className="flex-1 relative bg-black/50 overflow-hidden flex flex-col" role="main" aria-label="Simulation Workspace">
                    <div className="flex-1 relative" aria-label="Interactive Simulation Canvas" role="application">
                        {children}
                    </div>
                    
                    {/* Bottom Toolbar */}
                    <div role="toolbar" aria-label="Simulation Tools" className="h-16 bg-slate-800 border-t border-slate-700 px-4 flex items-center justify-center gap-4 shrink-0 z-20">
                        <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors group">
                            <RotateCcw size={20} className="group-hover:-rotate-90 transition-transform" aria-hidden="true" />
                            <span className="text-xs font-medium">Reset</span>
                        </button>
                        <div className="w-px h-8 bg-slate-700 mx-2" role="separator" />
                        <button className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors">
                            <PenTool size={20} aria-hidden="true" />
                            <span className="text-xs font-medium">Tools</span>
                        </button>
                        <div className="w-px h-8 bg-slate-700 mx-2" role="separator" />
                        <button
                            onClick={toggleOverlay}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                                showOverlay
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'hover:bg-slate-700 text-slate-400 hover:text-white'
                            }`}
                            title="Toggle Force Visualization (Spectacles Mode)"
                            aria-pressed={showOverlay}
                        >
                            <Glasses size={20} className={showOverlay ? 'animate-pulse' : ''} aria-hidden="true" />
                            <span className="text-xs font-medium">🔬 Forces</span>
                        </button>
                    </div>
                </main>

                {/* Notebook Sidebar */}
                <aside
                    role="complementary"
                    aria-label="Lab Notebook"
                    className={`
                        w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-40
                        absolute right-0 top-0 bottom-0
                        ${isNotebookOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}
                    aria-hidden={!isNotebookOpen}
                >
                   {notebook}
                   {/* Toggle handle when closed could go here if we wanted a permanent visible handle */}
                </aside>
            </div>
        </div>
    );
};

export default React.memo(LabLayout);