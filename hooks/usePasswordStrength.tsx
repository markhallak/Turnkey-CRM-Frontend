// hooks/usePasswordStrength.ts
import { useState, useEffect } from "react";
// import "noble/ed25519";
export interface PasswordRequirement {
  label: string;
  passed: boolean;
}

export interface PasswordStrength {
  score: number;
  total: number;
  requirements: PasswordRequirement[];
}

export function usePasswordStrength(password: string): PasswordStrength {
  const scoringReqs  = [
    {
      label: "At least twelve characters",
      test: (pw: string) => pw.length >= 12,
    },
    {
      label: "At least one uppercase character",
      test: (pw: string) => /[A-Z]/.test(pw),
    },
    {
      label: "At least one number",
      test: (pw: string) => /\d/.test(pw),
    },
    {
      label: "At least one special character",
      test: (pw: string) => /[!@#$%^&*(),.?\":{}|<>_\-\\[\];'`~+*=\/]/.test(pw),
    },
    {
      label:
        "At least three words separated by numbers or special characters",
      test: (pw: string) =>
        pw
          .split(/[\d!@#$%^&*(),.?":{}|<>_\-\\[\];'`~+*=\/]+/)
          .filter((w) => w.length > 0).length >= 3,
    },
  ];

const uiReqs = scoringReqs.slice(0, 4);  // only the first four show in the UI

  const results = scoringReqs.map((r) => ({
    label: r.label,
    passed: r.test(password),
  }));

  const score = results.filter((r) => r.passed).length;
  const total = results.length;

  return {
  score,
  total: scoringReqs.length,
  requirements: uiReqs.map((r) => ({
    label: r.label,
    passed: r.test(password),
  })),
};
}
