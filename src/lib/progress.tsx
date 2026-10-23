import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type TestRecord = {
  subject: string;
  score: number;
  total: number;
  at: number;
};

export type ProgressState = {
  lessons: string[];
  known: string[];
  tests: TestRecord[];
};

const EMPTY: ProgressState = { lessons: [], known: [], tests: [] };
const KEY = "study-bench-v1";

type Ctx = {
  ready: boolean;
  progress: ProgressState;
  markLesson: (id: string) => void;
  setKnown: (id: string, known: boolean) => void;
  addTest: (subject: string, score: number, total: number) => void;
  reset: () => void;
};

const ProgressContext = createContext<Ctx | null>(null);

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons.filter((x) => typeof x === "string") : [],
      known: Array.isArray(parsed.known) ? parsed.known.filter((x) => typeof x === "string") : [],
      tests: Array.isArray(parsed.tests)
        ? parsed.tests.filter(
            (t): t is TestRecord =>
              !!t &&
              typeof t === "object" &&
              typeof (t as TestRecord).subject === "string" &&
              typeof (t as TestRecord).score === "number" &&
              typeof (t as TestRecord).total === "number",
          )
        : [],
    };
  } catch {
    return EMPTY;
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setProgress(load());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(progress));
  }, [progress, ready]);

  const value: Ctx = {
    ready,
    progress,
    markLesson: (id) =>
      setProgress((p) => (p.lessons.includes(id) ? p : { ...p, lessons: [...p.lessons, id] })),
    setKnown: (id, known) =>
      setProgress((p) => {
        const has = p.known.includes(id);
        if (known && has) return p;
        if (!known && !has) return p;
        return {
          ...p,
          known: known ? [...p.known, id] : p.known.filter((x) => x !== id),
        };
      }),
    addTest: (subject, score, total) =>
      setProgress((p) => ({
        ...p,
        tests: [...p.tests, { subject, score, total, at: Date.now() }].slice(-24),
      })),
    reset: () => setProgress(EMPTY),
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("ProgressProvider missing");
  return ctx;
}
