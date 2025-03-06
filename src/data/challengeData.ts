
import { ChallengeStep } from '@/types/challenge';
import { stepGroup1 } from './challengeStepGroups/step1';
import { stepGroup2 } from './challengeStepGroups/step2';
import { stepGroup3 } from './challengeStepGroups/step3';
import { stepGroup4 } from './challengeStepGroups/step4';
export { introContent } from './introContent';

// Re-export the types
export type { Step, ChallengeStep } from '@/types/challenge';

// Combine all step groups into a single array
export const challengeSteps: ChallengeStep[] = [
  stepGroup1,
  stepGroup2,
  stepGroup3,
  stepGroup4
];
