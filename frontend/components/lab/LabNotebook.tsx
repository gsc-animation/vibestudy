'use client';

import React, { useState, useCallback } from 'react';
import { Book, PlayCircle, CheckCircle, ArrowRight, RotateCcw, Loader2 } from 'lucide-react';
import SentenceBuilder from './SentenceBuilder';
import { ClozeModal } from './ClozeModal';
import { BadgeUnlockModal } from '@/components/badges/BadgeUnlockModal';
import { Badge, getBadgeById } from '@/lib/badges';
import {
    createPrediction,
    updateResult,
    ExperimentPhase,
    ExperimentState,
    initialExperimentState
} from '../../lib/experiments';
import { ClozeExercise, getExerciseForQuest } from '../../lib/cloze-exercises';

interface LabNotebookProps {
    /** User ID for experiment logging */
    userId?: string;
    /** Quest ID for experiment logging */
    questId?: string;
    /** Type of quest/lab to determine content */
    questType?: 'magnets' | 'friction';
    /** Callback when experiment state changes */
    onPhaseChange?: (phase: ExperimentPhase) => void;
    /** Callback when experiment is complete */
    onExperimentComplete?: (data: { prediction: string; observation: string }) => void;
}

// Sentence templates and options for each phase
const MAGNETS_PREDICTION_TEMPLATE = "I predict the magnets will {interaction}.";
const MAGNETS_PREDICTION_OPTIONS = {
    interaction: ['attract (pull together)', 'repel (push apart)', 'do nothing'],
};

const FRICTION_PREDICTION_TEMPLATE = "I predict the car will travel {distance} on the {surface} surface.";
const FRICTION_PREDICTION_OPTIONS = {
    distance: ['furthest', 'shortest', 'medium distance'],
    surface: ['ice (smooth)', 'wood (medium)', 'sandpaper (rough)', 'carpet (soft)'],
};

const MAGNETS_OBSERVATION_TEMPLATE = "I observed that the magnets {result}.";
const MAGNETS_OBSERVATION_OPTIONS = {
    result: ['pulled together', 'pushed apart', 'stayed still'],
};

const FRICTION_OBSERVATION_TEMPLATE = "I observed the car went {distance} on {surface}.";
const FRICTION_OBSERVATION_OPTIONS = {
    distance: ['furthest', 'shortest', 'medium distance'],
    surface: ['ice', 'wood', 'sandpaper', 'carpet'],
};

/**
 * LabNotebook Component
 * 
 * An interactive lab notebook that guides students through the scientific method:
 * 1. Prediction Phase - Students use a SentenceBuilder to form a hypothesis
 * 2. Experiment Phase - Students conduct the simulation
 * 3. Observation Phase - Students record their observations using structured sentences
 * 4. Complete Phase - Summary of the experiment
 * 
 * This implements CLIL (Content and Language Integrated Learning) by scaffolding
 * scientific language for ESL students using sentence frames.
 */
const LabNotebook: React.FC<LabNotebookProps> = ({
    userId = 'demo-user',
    questId = 'magnets-quest-1',
    questType,
    onPhaseChange,
    onExperimentComplete,
}) => {
    const [state, setState] = useState<ExperimentState>(initialExperimentState);
    const [predictionSentence, setPredictionSentence] = useState<string | null>(null);
    const [observationSentence, setObservationSentence] = useState<string | null>(null);
    const [currentClozeExercise, setCurrentClozeExercise] = useState<ClozeExercise | null>(null);
    const [unlockedBadge, setUnlockedBadge] = useState<Badge | null>(null);

    // Determine quest type - prefer prop, fall back to ID check
    const isFrictionQuest = questType === 'friction' || questId.includes('friction');
    
    // Select templates based on quest type
    const predictionTemplate = isFrictionQuest ? FRICTION_PREDICTION_TEMPLATE : MAGNETS_PREDICTION_TEMPLATE;
    const predictionOptions = isFrictionQuest ? FRICTION_PREDICTION_OPTIONS : MAGNETS_PREDICTION_OPTIONS;
    
    const observationTemplate = isFrictionQuest ? FRICTION_OBSERVATION_TEMPLATE : MAGNETS_OBSERVATION_TEMPLATE;
    const observationOptions = isFrictionQuest ? FRICTION_OBSERVATION_OPTIONS : MAGNETS_OBSERVATION_OPTIONS;

    const handlePredictionChange = useCallback((sentence: string | null) => {
        setPredictionSentence(sentence);
    }, []);

    const handleObservationChange = useCallback((sentence: string | null) => {
        setObservationSentence(sentence);
    }, []);

    const handleStartExperiment = async () => {
        if (!predictionSentence) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await createPrediction({
                userId,
                questId,
                prediction: predictionSentence,
            });

            setState(prev => ({
                ...prev,
                phase: 'experiment',
                logId: response.logId,
                prediction: predictionSentence,
                isLoading: false,
            }));

            onPhaseChange?.('experiment');
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to save prediction',
            }));
        }
    };

    const handleFinishExperiment = () => {
        setState(prev => ({ ...prev, phase: 'observation' }));
        onPhaseChange?.('observation');
    };

    const handleCompleteObservation = async () => {
        if (!observationSentence || !state.logId) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            await updateResult({
                logId: state.logId,
                observation: observationSentence,
            });

            // Get a cloze exercise for the current quest type
            const type = isFrictionQuest ? 'friction' : 'magnets';
            const exercise = getExerciseForQuest(type);
            setCurrentClozeExercise(exercise || null);

            setState(prev => ({
                ...prev,
                phase: 'cloze',
                observation: observationSentence,
                isLoading: false,
            }));

            onPhaseChange?.('cloze');
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to save observation',
            }));
        }
    };

    const handleClozeComplete = () => {
        setCurrentClozeExercise(null);
        setState(prev => ({ ...prev, phase: 'complete' }));
        onPhaseChange?.('complete');
        onExperimentComplete?.({
            prediction: state.prediction!,
            observation: state.observation!,
        });

        // Check if this is the first experiment and award badge
        // In a real app, we would check if user already has this badge
        const firstExpBadge = getBadgeById('first-experiment');
        if (firstExpBadge) {
            setUnlockedBadge(firstExpBadge);
        }
    };

    const handleClozeSkip = () => {
        handleClozeComplete();
    };

    const handleReset = () => {
        setState(initialExperimentState);
        setPredictionSentence(null);
        setObservationSentence(null);
        setCurrentClozeExercise(null);
        setUnlockedBadge(null);
        onPhaseChange?.('prediction');
    };

    const renderPhaseIndicator = () => {
        const phases: Array<{ key: ExperimentPhase; label: string }> = [
            { key: 'prediction', label: 'Predict' },
            { key: 'experiment', label: 'Experiment' },
            { key: 'observation', label: 'Observe' },
            { key: 'cloze', label: 'Learn' },
            { key: 'complete', label: 'Complete' },
        ];

        const currentIndex = phases.findIndex(p => p.key === state.phase);

        return (
            <nav aria-label="Progress Steps" className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
                <ol className="flex items-center justify-between m-0 p-0 list-none">
                    {phases.map((phase, index) => (
                        <React.Fragment key={phase.key}>
                            <li className="flex flex-col items-center" aria-current={index === currentIndex ? 'step' : undefined}>
                                <div
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                                        ${index < currentIndex
                                            ? 'bg-green-500 text-white'
                                            : index === currentIndex
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-200 text-slate-500'
                                        }
                                    `}
                                    aria-hidden="true"
                                >
                                    {index < currentIndex ? (
                                        <CheckCircle size={16} />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span
                                    className={`
                                        text-xs mt-1 font-medium
                                        ${index === currentIndex ? 'text-indigo-700' : 'text-slate-500'}
                                    `}
                                >
                                    <span className="sr-only">{index < currentIndex ? 'Completed: ' : ''}</span>
                                    {phase.label}
                                </span>
                            </li>
                            {index < phases.length - 1 && (
                                <li
                                    aria-hidden="true"
                                    className={`
                                        flex-1 h-0.5 mx-2 list-none
                                        ${index < currentIndex ? 'bg-green-500' : 'bg-slate-200'}
                                    `}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </ol>
            </nav>
        );
    };

    const renderPredictionPhase = () => (
        <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-800 mb-2">
                    <span aria-hidden="true">🔮</span> Make Your Prediction
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                    {isFrictionQuest
                        ? "How far do you think the car will go on different surfaces? Complete the sentence below:"
                        : "What do you think will happen when the magnets get close to each other? Complete the sentence below:"
                    }
                </p>
                <SentenceBuilder
                    template={predictionTemplate}
                    options={predictionOptions}
                    onChange={handlePredictionChange}
                    disabled={state.isLoading}
                />
            </div>

            <button
                onClick={handleStartExperiment}
                disabled={!predictionSentence || state.isLoading}
                className={`
                    w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                    font-semibold text-white transition-all
                    ${predictionSentence && !state.isLoading
                        ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                        : 'bg-slate-300 cursor-not-allowed'
                    }
                `}
            >
                {state.isLoading ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <PlayCircle size={20} aria-hidden="true" />
                        Start Experiment
                        <ArrowRight size={16} aria-hidden="true" />
                    </>
                )}
            </button>
        </div>
    );

    const renderExperimentPhase = () => (
        <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-800 mb-2">
                    <span aria-hidden="true">🧪</span> Experiment in Progress
                </h3>
                <p className="text-sm text-purple-700 mb-3">
                    You predicted: <span className="font-medium italic">&quot;{state.prediction}&quot;</span>
                </p>
                <p className="text-sm text-purple-700">
                    Now, drag the magnets on the simulation to test your prediction.
                    When you&apos;re ready, click the button below.
                </p>
            </div>

            <button
                onClick={handleFinishExperiment}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                    font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-all"
            >
                <CheckCircle size={20} />
                I&apos;ve Finished Experimenting
                <ArrowRight size={16} />
            </button>
        </div>
    );

    const renderObservationPhase = () => (
        <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-green-800 mb-2">
                    👀 Record Your Observation
                </h3>
                <p className="text-sm text-green-700 mb-4">
                    What actually happened? Complete the sentence below:
                </p>
                <SentenceBuilder
                    template={observationTemplate}
                    options={observationOptions}
                    onChange={handleObservationChange}
                    disabled={state.isLoading}
                />
            </div>

            <button
                onClick={handleCompleteObservation}
                disabled={!observationSentence || state.isLoading}
                className={`
                    w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                    font-semibold text-white transition-all
                    ${observationSentence && !state.isLoading
                        ? 'bg-green-600 hover:bg-green-700 cursor-pointer'
                        : 'bg-slate-300 cursor-not-allowed'
                    }
                `}
            >
                {state.isLoading ? (
                    <>
                        <Loader2 size={20} className="animate-spin" />
                        Saving...
                    </>
                ) : (
                    <>
                        <CheckCircle size={20} aria-hidden="true" />
                        Complete Observation
                    </>
                )}
            </button>
        </div>
    );

    const renderClozePhase = () => (
        <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-800 mb-2">
                    <span aria-hidden="true">🧠</span> Scientific Rule Check
                </h3>
                <p className="text-sm text-purple-700">
                    Great observation! Now let&apos;s connect what you saw to the scientific rule.
                </p>
            </div>

            {currentClozeExercise && (
                <ClozeModal
                    exercise={currentClozeExercise}
                    onComplete={handleClozeComplete}
                    onClose={handleClozeSkip}
                />
            )}

            {!currentClozeExercise && (
                <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No exercise available for this quest type.</p>
                    <button
                        onClick={() => handleClozeComplete()}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700"
                    >
                        Continue
                    </button>
                </div>
            )}
        </div>
    );

    const renderCompletePhase = () => {
        // Check if prediction matched observation
        const predictionMatched =
            (state.prediction?.includes('attract') && state.observation?.includes('pulled together')) ||
            (state.prediction?.includes('repel') && state.observation?.includes('pushed apart')) ||
            (state.prediction?.includes('do nothing') && state.observation?.includes('stayed still'));

        return (
            <div className="space-y-4">
                <div className={`
                    border rounded-lg p-4
                    ${predictionMatched
                        ? 'bg-green-50 border-green-200'
                        : 'bg-amber-50 border-amber-200'
                    }
                `}>
                    <h3 className={`text-sm font-semibold mb-3 ${
                        predictionMatched ? 'text-green-800' : 'text-amber-800'
                    }`}>
                        <span aria-hidden="true">{predictionMatched ? '🎉' : '🤔'}</span> {predictionMatched ? 'Great Job!' : 'Interesting Result!'}
                    </h3>

                    <div className="space-y-3">
                        <div className="bg-white/50 rounded p-3">
                            <p className="text-xs font-medium text-slate-500 mb-1">Your Prediction:</p>
                            <p className="text-sm text-slate-700 italic">&quot;{state.prediction}&quot;</p>
                        </div>

                        <div className="bg-white/50 rounded p-3">
                            <p className="text-xs font-medium text-slate-500 mb-1">Your Observation:</p>
                            <p className="text-sm text-slate-700 italic">&quot;{state.observation}&quot;</p>
                        </div>

                        <p className={`text-sm ${
                            predictionMatched ? 'text-green-700' : 'text-amber-700'
                        }`}>
                            {predictionMatched
                                ? 'Your prediction matched your observation! You\'re thinking like a scientist!'
                                : 'Your prediction was different from what happened. That\'s okay - scientists learn from surprises!'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleReset}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg
                        font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-all"
                >
                    <RotateCcw size={20} aria-hidden="true" />
                    Try Another Experiment
                </button>
            </div>
        );
    };

    const renderCurrentPhase = () => {
        switch (state.phase) {
            case 'prediction':
                return renderPredictionPhase();
            case 'experiment':
                return renderExperimentPhase();
            case 'observation':
                return renderObservationPhase();
            case 'cloze':
                return renderClozePhase();
            case 'complete':
                return renderCompletePhase();
            default:
                return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border-l border-slate-200 shadow-xl z-20 relative">
            {/* Header */}
            <div className="p-4 bg-indigo-900 text-white flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-base m-0">
                    <Book size={20} aria-hidden="true" />
                    <span>Lab Notebook</span>
                </h2>
            </div>

            {/* Phase Indicator */}
            {renderPhaseIndicator()}

            {/* Main Content */}
            <div className="flex-1 p-4 bg-yellow-50 overflow-y-auto" role="region" aria-live="polite" aria-label="Current Experiment Step">
                {/* Error Display */}
                {state.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                        <p className="text-sm text-red-700">{state.error}</p>
                    </div>
                )}

                {renderCurrentPhase()}
            </div>

            {/* Badge Unlock Modal */}
            {unlockedBadge && (
                <BadgeUnlockModal
                    badge={unlockedBadge}
                    onClose={() => setUnlockedBadge(null)}
                />
            )}
        </div>
    );
};

export default LabNotebook;
