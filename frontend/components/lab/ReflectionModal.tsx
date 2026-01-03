import React, { useState } from 'react';

interface ReflectionModalProps {
    isOpen: boolean;
    onSubmit: (observation: string) => Promise<void>;
    isLoading?: boolean;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onSubmit, isLoading = false }) => {
    const [observation, setObservation] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (observation.trim()) {
            await onSubmit(observation);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-lg p-6 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">Experiment Complete!</h2>
                <p className="text-slate-300 mb-6">
                    Great job! Now, reflect on what you observed. 
                    Did the results match your prediction?
                </p>
                
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full h-32 p-4 mb-6 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        placeholder="I observed that..."
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isLoading || !observation.trim()}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Completing Mission...
                                </>
                            ) : (
                                'Complete Mission'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReflectionModal;
