# Task 7.2: Friction Educational Content (Cloze Exercises + Prediction Templates)

## Status: Pending

## Goal
Create friction-specific educational content including cloze exercises for the abstract layer and prediction/observation sentence templates for the CLIL-based scientific method workflow.

## Requirements
- [ ] Add 4-5 friction cloze exercises to `cloze-exercises.ts`
- [ ] Create friction prediction sentence template and options
- [ ] Create friction observation sentence template and options
- [ ] Update LabNotebook to detect friction quest type
- [ ] Add friction-specific phase messaging

## Cloze Exercises (Abstract Layer)

### Exercise 1: Friction Basics
```typescript
{
  id: 'friction-slowing',
  questType: 'friction',
  template: 'Friction is a force that {blank1} moving objects.',
  blanks: [
    { 
      id: 'blank1', 
      correctAnswer: 'slows down', 
      options: ['speeds up', 'slows down', 'lifts', 'spins'] 
    }
  ],
  explanation: 'Friction always opposes motion, causing objects to slow down.'
}
```

### Exercise 2: Surface Comparison
```typescript
{
  id: 'friction-surfaces',
  questType: 'friction',
  template: 'A rough surface like {blank1} has {blank2} friction than a smooth surface like {blank3}.',
  blanks: [
    { id: 'blank1', correctAnswer: 'rubber', options: ['ice', 'wood', 'rubber', 'glass'] },
    { id: 'blank2', correctAnswer: 'more', options: ['more', 'less', 'equal', 'zero'] },
    { id: 'blank3', correctAnswer: 'ice', options: ['ice', 'rubber', 'sand', 'carpet'] }
  ],
  explanation: 'Rough surfaces create more friction because there is more contact between surfaces.'
}
```

### Exercise 3: Stopping Distance
```typescript
{
  id: 'friction-distance',
  questType: 'friction',
  template: 'When friction is high, the car travels a {blank1} distance before stopping.',
  blanks: [
    { 
      id: 'blank1', 
      correctAnswer: 'shorter', 
      options: ['longer', 'shorter', 'same', 'random'] 
    }
  ],
  explanation: 'High friction removes energy faster, so objects stop in a shorter distance.'
}
```

### Exercise 4: Coefficient Understanding
```typescript
{
  id: 'friction-coefficient',
  questType: 'friction',
  template: 'The coefficient of friction (μ) for {blank1} is the highest among ice, wood, and rubber.',
  blanks: [
    { 
      id: 'blank1', 
      correctAnswer: 'rubber', 
      options: ['ice', 'wood', 'rubber'] 
    }
  ],
  explanation: 'Rubber has the highest friction coefficient (μ ≈ 0.8) due to its rough, grippy texture.'
}
```

### Exercise 5: Real-World Application
```typescript
{
  id: 'friction-safety',
  questType: 'friction',
  template: 'Car tires are made of {blank1} because it has {blank2} friction, helping cars {blank3} quickly.',
  blanks: [
    { id: 'blank1', correctAnswer: 'rubber', options: ['ice', 'metal', 'rubber', 'plastic'] },
    { id: 'blank2', correctAnswer: 'high', options: ['high', 'low', 'zero', 'negative'] },
    { id: 'blank3', correctAnswer: 'stop', options: ['go faster', 'stop', 'turn', 'float'] }
  ],
  explanation: 'Rubber tires provide high friction for safe braking and control on roads.'
}
```

## Prediction Template (CLIL Sentence Frame)

### Template String
```typescript
const FRICTION_PREDICTION_TEMPLATE = "I predict the car will travel {distance} on the {surface} surface.";
```

### Options
```typescript
const FRICTION_PREDICTION_OPTIONS = {
  distance: [
    'very far',
    'a medium distance', 
    'a short distance'
  ],
  surface: [
    'ice',
    'wood',
    'rubber'
  ]
};
```

## Observation Template (CLIL Sentence Frame)

### Template String
```typescript
const FRICTION_OBSERVATION_TEMPLATE = "I observed that the car traveled {result} on the {surface} surface.";
```

### Options
```typescript
const FRICTION_OBSERVATION_OPTIONS = {
  result: [
    'very far',
    'a medium distance',
    'a short distance',
    'did not move'
  ],
  surface: [
    'ice',
    'wood', 
    'rubber'
  ]
};
```

## Files to Modify

### 1. `frontend/lib/cloze-exercises.ts`
Add the five new friction exercises to the `clozeExercises` array.

### 2. `frontend/components/lab/LabNotebook.tsx`
- Add friction templates as constants
- Update quest type detection logic:
```typescript
const getQuestType = (questId: string): string => {
  if (questId.includes('friction')) return 'friction';
  if (questId.includes('magnet')) return 'magnets';
  return 'default';
};
```
- Create template selector based on quest type:
```typescript
const getTemplates = (questType: string) => {
  switch (questType) {
    case 'friction':
      return {
        prediction: { template: FRICTION_PREDICTION_TEMPLATE, options: FRICTION_PREDICTION_OPTIONS },
        observation: { template: FRICTION_OBSERVATION_TEMPLATE, options: FRICTION_OBSERVATION_OPTIONS }
      };
    case 'magnets':
    default:
      return {
        prediction: { template: PREDICTION_TEMPLATE, options: PREDICTION_OPTIONS },
        observation: { template: OBSERVATION_TEMPLATE, options: OBSERVATION_OPTIONS }
      };
  }
};
```

### 3. Phase Messaging Updates
Update instructional text in each phase for friction context:

**Prediction Phase:**
```typescript
// For friction quests
<p>What do you think will happen when you push the car on different surfaces?</p>
```

**Experiment Phase:**
```typescript
// For friction quests
<p>Now, push the car on the simulation. Try different surfaces!</p>
```

**Observation Phase:**
```typescript
// For friction quests  
<p>What happened when you pushed the car? Which surface made it go farthest?</p>
```

## Implementation Approach

### Option A: Prop-based Configuration (Recommended)
Pass quest type and templates as props to LabNotebook:
```typescript
<LabNotebook
  questId={questId}
  questType="friction"
  templates={frictionTemplates}
  // ...other props
/>
```

### Option B: Quest ID Detection
Detect from quest ID pattern (current approach):
```typescript
const questType = questId.includes('friction') ? 'friction' : 'magnets';
```

## Acceptance Criteria
- [ ] All 5 friction cloze exercises added to cloze-exercises.ts
- [ ] Friction prediction template available in LabNotebook
- [ ] Friction observation template available in LabNotebook  
- [ ] Quest type correctly detected from quest ID
- [ ] Friction-specific phase instructions displayed
- [ ] Cloze exercises for friction appear after observation phase

## Verification Steps
1. Navigate to friction lab (`/lab/friction-1` or similar)
2. Verify prediction sentence builder shows friction options
3. Complete prediction and verify experiment phase shows friction instructions
4. Complete experiment and verify observation shows friction options
5. Complete observation and verify friction cloze exercise appears
6. Complete cloze and verify summary displays correctly

## Educational Alignment
- **CLIL Focus:** Sentence frames support ESL students in forming scientific hypotheses
- **VRA Abstract Layer:** Cloze exercises connect hands-on experience to scientific vocabulary
- **Bloom's Taxonomy:** Prediction = Evaluating/Hypothesizing level

## Dependencies
- Task 7.1 (FrictionScene) should be complete for end-to-end testing
- Existing cloze-exercises.ts structure is compatible

## Notes
- Keep vocabulary Grade 3 appropriate (simple words like "far", "short")
- Avoid complex physics terms; use "friction" but explain it simply
- The word "coefficient" may need a tooltip/glossary link for advanced students
