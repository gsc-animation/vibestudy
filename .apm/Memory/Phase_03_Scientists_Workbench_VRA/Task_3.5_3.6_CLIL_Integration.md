# Task 3.5 & 3.6: Abstract Layer (CLIL Integration)

## Status
- [x] Create SentenceBuilder component with dropdown placeholders
- [x] Create LabNotebook component with phase management
- [x] Implement prediction phase with sentence templates
- [x] Implement experiment phase with instructions
- [x] Implement observation phase with result recording
- [x] Implement complete phase with comparison feedback
- [x] Connect to backend experiments API
- [x] Integrate with lab page

## Implementation Details

### SentenceBuilder Component (`frontend/components/lab/SentenceBuilder.tsx`)
- **Purpose**: CLIL-aligned sentence frame component for ESL students
- **Features**:
  - Parses template strings with `{placeholder}` syntax
  - Renders text segments with dropdown selects for placeholders
  - Tracks selections and validates completion
  - Reports complete/null sentence via `onChange` callback
  - Visual feedback: yellow (incomplete) → indigo (filled) styling
  - Accessibility: proper labels and focus states

### LabNotebook Component (`frontend/components/lab/LabNotebook.tsx`)
- **Purpose**: Scientific method workflow manager
- **Phase Management**:
  1. **Prediction Phase**: Student uses SentenceBuilder to form hypothesis
  2. **Experiment Phase**: Instructions to conduct simulation
  3. **Observation Phase**: Record what happened using SentenceBuilder
  4. **Complete Phase**: Summary comparing prediction vs observation
- **Visual Elements**:
  - Phase indicator with progress circles
  - Color-coded phase sections (blue, purple, green)
  - Loading states with spinner
  - Error handling display

### Sentence Templates
```typescript
// Prediction
"I predict the magnets will {interaction}."
options: ['attract (pull together)', 'repel (push apart)', 'do nothing']

// Observation
"I observed that the magnets {result}."
options: ['pulled together', 'pushed apart', 'stayed still']
```

### API Integration (`frontend/lib/experiments.ts`)
- `createPrediction()`: POST to `/experiments/predict`
  - Sends: userId, questId, prediction
  - Returns: logId for session tracking
- `updateResult()`: POST to `/experiments/result`
  - Sends: logId, observation, optional resultData/reflection
  - Completes the experiment log

### Lab Page Integration (`frontend/app/lab/[id]/page.tsx`)
- Wraps content in `LabProvider` for context access
- Passes LabNotebook to LabLayout's notebook prop
- Handles phase change callbacks for overlay instructions
- Shows contextual prompts based on current phase:
  - Prediction: "Make your prediction in the Lab Notebook!"
  - Experiment: "Drag the magnets to test your prediction!"

## Educational Design
- **CLIL Principles**: Scaffolded language support for science vocabulary
- **Scientific Method**: Predict → Experiment → Observe → Reflect
- **Immediate Feedback**: Visual comparison of prediction vs outcome
- **Growth Mindset**: Encourages learning from mismatches

## Files Modified/Created
- `frontend/components/lab/SentenceBuilder.tsx` - New CLIL component
- `frontend/components/lab/LabNotebook.tsx` - New workflow component
- `frontend/lib/experiments.ts` - New API service
- `frontend/app/lab/[id]/page.tsx` - Updated integration
