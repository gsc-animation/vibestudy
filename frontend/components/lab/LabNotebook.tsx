import React from 'react';
import { Book, X } from 'lucide-react';

interface LabNotebookProps {
    // We can add props here later if needed, e.g., for saving notes
}

const LabNotebook: React.FC<LabNotebookProps> = () => {
    return (
        <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-xl z-20 relative">
            <div className="p-4 bg-indigo-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold">
                    <Book size={20} />
                    <span>Lab Notebook</span>
                </div>
            </div>
            
            <div className="flex-1 p-4 bg-yellow-50 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                    <p className="text-slate-600 italic mb-4">
                        Record your observations here. Your notes will be saved automatically.
                    </p>
                    <textarea 
                        className="w-full h-[calc(100vh-200px)] bg-transparent border-0 resize-none focus:ring-0 p-0 text-slate-800 leading-relaxed font-mono"
                        placeholder="Observation Log:
- Started experiment at 09:00
- Initial magnetic field strength: 0
..."
                    />
                </div>
            </div>
        </div>
    );
};

export default LabNotebook;