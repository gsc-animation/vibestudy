'use client';

import React, { useState, useEffect, useMemo } from 'react';

interface SentenceBuilderProps {
    /** Template string with placeholders like {noun}, {verb}, etc. */
    template: string;
    /** Map of placeholder names to arrays of option strings */
    options: Record<string, string[]>;
    /** Called when the sentence changes. Provides null if incomplete, or the full sentence if complete. */
    onChange: (sentence: string | null) => void;
    /** Optional: disable all interactions */
    disabled?: boolean;
}

/**
 * SentenceBuilder Component
 * 
 * A CLIL-aligned component that helps ESL students construct scientific sentences
 * using scaffolded sentence frames with dropdown selections.
 * 
 * Example usage:
 * ```tsx
 * <SentenceBuilder
 *   template="I predict the magnets will {action} because they are {position}."
 *   options={{
 *     action: ['attract', 'repel', 'do nothing'],
 *     position: ['facing same poles', 'facing opposite poles']
 *   }}
 *   onChange={(sentence) => console.log(sentence)}
 * />
 * ```
 */
const SentenceBuilder: React.FC<SentenceBuilderProps> = ({
    template,
    options,
    onChange,
    disabled = false,
}) => {
    // Track selected values for each placeholder
    const [selections, setSelections] = useState<Record<string, string>>({});

    // Parse template to identify placeholders
    const parts = useMemo(() => {
        const regex = /\{(\w+)\}/g;
        const result: Array<{ type: 'text' | 'placeholder'; value: string }> = [];
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(template)) !== null) {
            // Add text before the placeholder
            if (match.index > lastIndex) {
                result.push({
                    type: 'text',
                    value: template.slice(lastIndex, match.index),
                });
            }
            // Add the placeholder
            result.push({
                type: 'placeholder',
                value: match[1],
            });
            lastIndex = match.index + match[0].length;
        }

        // Add remaining text after last placeholder
        if (lastIndex < template.length) {
            result.push({
                type: 'text',
                value: template.slice(lastIndex),
            });
        }

        return result;
    }, [template]);

    // Get list of all placeholders from template
    const placeholders = useMemo(() => {
        return parts
            .filter((p) => p.type === 'placeholder')
            .map((p) => p.value);
    }, [parts]);

    // Check if all placeholders have been filled
    const isComplete = useMemo(() => {
        return placeholders.every((p) => selections[p] && selections[p] !== '');
    }, [placeholders, selections]);

    // Build the complete sentence when all selections are made
    useEffect(() => {
        if (isComplete) {
            let sentence = template;
            for (const [key, value] of Object.entries(selections)) {
                sentence = sentence.replace(`{${key}}`, value);
            }
            onChange(sentence);
        } else {
            onChange(null);
        }
    }, [selections, isComplete, template, onChange]);

    const handleSelectionChange = (placeholder: string, value: string) => {
        setSelections((prev) => ({
            ...prev,
            [placeholder]: value,
        }));
    };

    return (
        <div className="sentence-builder p-4 bg-white rounded-lg border-2 border-indigo-200 shadow-sm">
            <div className="text-lg leading-relaxed flex flex-wrap items-baseline gap-1">
                {parts.map((part, index) => {
                    if (part.type === 'text') {
                        return (
                            <span key={index} className="text-slate-700">
                                {part.value}
                            </span>
                        );
                    }

                    const placeholderOptions = options[part.value] || [];
                    const selectedValue = selections[part.value] || '';

                    return (
                        <select
                            key={index}
                            value={selectedValue}
                            onChange={(e) => handleSelectionChange(part.value, e.target.value)}
                            disabled={disabled}
                            className={`
                                inline-block min-w-[140px] px-3 py-1.5 mx-1
                                text-base font-medium rounded-lg
                                border-2 transition-all duration-200
                                focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1
                                ${disabled 
                                    ? 'bg-slate-100 border-slate-300 text-slate-500 cursor-not-allowed' 
                                    : selectedValue 
                                        ? 'bg-indigo-50 border-indigo-400 text-indigo-700' 
                                        : 'bg-yellow-50 border-yellow-400 text-slate-600 hover:border-indigo-400'
                                }
                            `}
                            aria-label={`Select ${part.value}`}
                        >
                            <option value="" disabled>
                                Choose {part.value}...
                            </option>
                            {placeholderOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    );
                })}
            </div>

            {/* Completion indicator */}
            <div className="mt-3 flex items-center gap-2">
                {isComplete ? (
                    <>
                        <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-sm text-green-600 font-medium">
                            ✓ Sentence complete!
                        </span>
                    </>
                ) : (
                    <>
                        <span className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <span className="text-sm text-slate-500">
                            Fill in all the blanks to complete your sentence.
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default SentenceBuilder;
