/**
 * Cloze Exercises Data
 * 
 * Fill-in-the-blank exercises that connect student observations
 * to academic/scientific rules, supporting CLIL (Content and Language
 * Integrated Learning) framework.
 */

export interface ClozeBlank {
  id: string;
  correctAnswer: string;
  options: string[];
}

export interface ClozeExercise {
  id: string;
  questType: string; // 'magnets', 'circuits', 'friction', etc.
  template: string; // "The {blank1} pole of one magnet {blank2} the {blank3} pole of another."
  blanks: ClozeBlank[];
  explanation: string;
  hint?: string;
}

export const clozeExercises: ClozeExercise[] = [
  // Friction Exercises
  {
    id: 'friction-1',
    questType: 'friction',
    template: "Friction is a force that {blank1} the motion of objects.",
    blanks: [
      { id: 'blank1', correctAnswer: 'slows', options: ['slows', 'stops', 'resists', 'increases'] }
    ],
    hint: "Think about what happens when you push a toy car on carpet.",
    explanation: "Friction always acts opposite to the direction of motion, slowing things down."
  },
  {
    id: 'friction-2',
    questType: 'friction',
    template: "A surface with {blank1} friction will let objects slide further.",
    blanks: [
      { id: 'blank1', correctAnswer: 'low', options: ['low', 'high', 'more', 'heavy'] }
    ],
    hint: "Ice is very slippery. What kind of friction does it have?",
    explanation: "Low friction surfaces like ice have small friction coefficients, allowing objects to slide easily."
  },
  {
    id: 'friction-3',
    questType: 'friction',
    template: "Rough surfaces like sandpaper have {blank1} friction than smooth surfaces like glass.",
    blanks: [
      { id: 'blank1', correctAnswer: 'higher', options: ['higher', 'lower', 'equal', 'no'] }
    ],
    hint: "Is it harder to slide on sandpaper or glass?",
    explanation: "Rougher surfaces create more resistance against motion, resulting in higher friction."
  },
  {
    id: 'friction-4',
    questType: 'friction',
    template: "The {blank1} is a number that describes how much friction two surfaces create.",
    blanks: [
      { id: 'blank1', correctAnswer: 'coefficient of friction', options: ['coefficient of friction', 'speed limit', 'mass index', 'gravity'] }
    ],
    hint: "Scientists use a special value (often symbol µ) to measure friction.",
    explanation: "The coefficient of friction is a value that represents the amount of friction between two surfaces."
  },
  {
    id: 'friction-5',
    questType: 'friction',
    template: "When friction is high, the stopping distance of a moving object {blank1}.",
    blanks: [
      { id: 'blank1', correctAnswer: 'decreases', options: ['increases', 'decreases', 'stays same', 'disappears'] }
    ],
    hint: "Does a car stop faster on a dry road (high friction) or an icy road (low friction)?",
    explanation: "Higher friction applies a stronger force against motion, causing the object to stop in a shorter distance."
  },
  {
    id: 'magnets-attraction',
    questType: 'magnets',
    template: 'The {blank1} pole of one magnet {blank2} the {blank3} pole of another magnet.',
    blanks: [
      { id: 'blank1', correctAnswer: 'North', options: ['North', 'South', 'East', 'West'] },
      { id: 'blank2', correctAnswer: 'attracts', options: ['attracts', 'repels', 'ignores', 'touches'] },
      { id: 'blank3', correctAnswer: 'South', options: ['North', 'South', 'East', 'West'] }
    ],
    explanation: 'Opposite poles (North and South) attract each other due to magnetic forces.'
  },
  {
    id: 'magnets-repulsion',
    questType: 'magnets',
    template: 'When two {blank1} poles are brought together, they {blank2} each other.',
    blanks: [
      { id: 'blank1', correctAnswer: 'same', options: ['same', 'opposite', 'different', 'magnetic'] },
      { id: 'blank2', correctAnswer: 'repel', options: ['attract', 'repel', 'stick to', 'ignore'] }
    ],
    explanation: 'Like poles (North-North or South-South) repel each other.'
  },
  {
    id: 'magnets-distance',
    questType: 'magnets',
    template: 'The magnetic force becomes {blank1} as the distance between magnets {blank2}.',
    blanks: [
      { id: 'blank1', correctAnswer: 'stronger', options: ['stronger', 'weaker', 'unchanged', 'invisible'] },
      { id: 'blank2', correctAnswer: 'decreases', options: ['increases', 'decreases', 'stays the same', 'doubles'] }
    ],
    explanation: 'Magnetic force follows the inverse square law - it gets stronger when magnets are closer.'
  },
  {
    id: 'magnets-field',
    questType: 'magnets',
    template: 'A {blank1} field surrounds every magnet and is strongest near the {blank2}.',
    blanks: [
      { id: 'blank1', correctAnswer: 'magnetic', options: ['electric', 'magnetic', 'gravity', 'light'] },
      { id: 'blank2', correctAnswer: 'poles', options: ['center', 'poles', 'edges', 'surface'] }
    ],
    explanation: 'Magnetic fields are invisible forces around magnets, concentrated at the poles.'
  }
];

/**
 * Get a random exercise for a specific quest type
 */
export function getExerciseForQuest(questType: string): ClozeExercise | undefined {
  const exercises = clozeExercises.filter(e => e.questType === questType);
  if (exercises.length === 0) return undefined;
  return exercises[Math.floor(Math.random() * exercises.length)];
}

/**
 * Get all exercises for a specific quest type
 */
export function getAllExercisesForQuest(questType: string): ClozeExercise[] {
  return clozeExercises.filter(e => e.questType === questType);
}

/**
 * Get exercise by ID
 */
export function getExerciseById(id: string): ClozeExercise | undefined {
  return clozeExercises.find(e => e.id === id);
}
