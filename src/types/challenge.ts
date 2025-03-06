
export type Step = {
  id: number;
  title: string;
  description: string;
  command: string;
  expectedOutput?: string;
  validationRegex?: RegExp;
  hint: string;
  explanation: string;
  infoPanel: {
    title: string;
    content: string;
  };
};

export type ChallengeStep = {
  id: number;
  title: string;
  description: string;
  steps: Step[];
};

export type IntroContent = {
  title: string;
  subtitle: string;
  description: string;
};
