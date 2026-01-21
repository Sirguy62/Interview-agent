// src/lib/rubrics.js
export const RUBRICS = {
  react_junior: {
    communication: {
      weight: 0.2,
      criteria: ["Explains ideas clearly", "Uses correct terminology"],
    },
    fundamentals: {
      weight: 0.35,
      criteria: ["Understands hooks", "State vs props", "Component structure"],
    },
    problem_solving: {
      weight: 0.25,
      criteria: ["Approach is logical", "Can reason about tradeoffs"],
    },
    depth: {
      weight: 0.2,
      criteria: ["Goes beyond surface-level answers"],
    },
  },
};
