# Task 5.2 - Abstract Layer (Cloze Exercises)

## Goal
Connect student observations to academic/scientific rules through fill-in-the-blank exercises.

## Requirements
- Cloze modal appears after successful experiment observation
- Template sentences with blanks for key scientific terms
- Multiple choice options for each blank
- Validates correct answers before proceeding
- Reinforces scientific vocabulary (CLIL focus)

## Technical Implementation
- New ClozeModal component for fill-in-the-blank UI
- Integration with LabNotebook after observation phase
- Exercise data structure with templates and answers

## Files
- `frontend/components/lab/ClozeModal.tsx` (New)
- `frontend/components/lab/LabNotebook.tsx` (Update)
- `frontend/lib/cloze-exercises.ts` (New - exercise data)

## Status: Complete
