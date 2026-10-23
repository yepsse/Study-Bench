import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getStudyData, saveStudyData } from "./study-data";
import {
  emptyStudyData,
  spellingWordsSchema,
  studyProgressSchema,
  type ProgressState,
  type SpellingWord,
  type StudyData,
} from "./study-data";

export type { ProgressState, SpellingWord, TestRecord } from "./study-data";

const PROGRESS_KEY = "study-bench-v1";
const SPELLING_KEY = "study-bench-custom-spelling-words";
type SaveStatus = "loading" | "saving" | "saved" | "error";

type Ctx = {
  ready: boolean;
  progress: ProgressState;
  spellingWords: SpellingWord[];
  saveStatus: SaveStatus;
  saveError: string | null;
  databaseLabel: string;
  markLesson: (id: string) => void;
  setKnown: (id: string, known: boolean) => void;
  addTest: (subject: string, score: number, total: number) => void;
  setSpellingWords: (words: SpellingWord[]) => void;
  reset: () => void;
};

const ProgressContext = createContext<Ctx | null>(null);

function loadLocalData(): StudyData {
  try {
    const rawProgress = localStorage.getItem(PROGRESS_KEY);
    const parsedProgress = rawProgress ? JSON.parse(rawProgress) as unknown : {};
    const progressObject =
      parsedProgress && typeof parsedProgress === "object"
        ? parsedProgress as Record<string, unknown>
        : {};
    const parsedWords = JSON.parse(localStorage.getItem(SPELLING_KEY) ?? "[]") as unknown;
    const progress = studyProgressSchema.safeParse({
      lessons: Array.isArray(progressObject.lessons)
        ? progressObject.lessons.filter((item): item is string => typeof item === "string")
        : [],
      known: Array.isArray(progressObject.known)
        ? progressObject.known.filter((item): item is string => typeof item === "string")
        : [],
      tests: Array.isArray(progressObject.tests)
        ? progressObject.tests.filter((item) => studyProgressSchema.shape.tests.element.safeParse(item).success)
        : [],
    });
    const words = spellingWordsSchema.safeParse(parsedWords);
    return {
      progress: progress.success ? progress.data : emptyStudyData.progress,
      spellingWords: words.success ? words.data : [],
    };
  } catch {
    return emptyStudyData;
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>(emptyStudyData.progress);
  const [spellingWords, setSpellingWords] = useState<SpellingWord[]>([]);
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("loading");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [dbSource, setDbSource] = useState<"neon" | "pglite" | null>(null);
  const [canSave, setCanSave] = useState(false);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const saveRevision = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const localData = loadLocalData();
    setProgress(localData.progress);
    setSpellingWords(localData.spellingWords);

    void getStudyData()
      .then((stored) => {
        if (cancelled) return;
        setDbSource(stored.source);
        const data = stored.data ?? localData;
        setProgress(data.progress);
        setSpellingWords(data.spellingWords);
        setCanSave(true);
        setReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setReady(true);
        setSaveStatus("error");
        setSaveError(error instanceof Error ? error.message : String(error));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || !canSave) return;
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      localStorage.setItem(SPELLING_KEY, JSON.stringify(spellingWords));
    } catch (error) {
      console.error("[study-data] could not update the local backup:", error);
    }

    const revision = ++saveRevision.current;
    setSaveStatus("saving");
    setSaveError(null);
    const timeout = window.setTimeout(() => {
      const write = saveQueue.current
        .catch(() => undefined)
        .then(async () => {
          const result = await saveStudyData({ data: { progress, spellingWords } });
          if (revision === saveRevision.current) {
            setDbSource(result.source);
            setSaveStatus("saved");
          }
        })
        .catch((error: unknown) => {
          if (revision === saveRevision.current) {
            setSaveStatus("error");
            setSaveError(error instanceof Error ? error.message : String(error));
          }
        });
      saveQueue.current = write;
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [progress, spellingWords, ready, canSave]);

  const databaseLabel =
    dbSource === "neon" ? "Neon database" : dbSource === "pglite" ? "local preview database" : "database";
  const value: Ctx = {
    ready,
    progress,
    spellingWords,
    saveStatus,
    saveError,
    databaseLabel,
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
    setSpellingWords,
    reset: () => {
      setProgress(emptyStudyData.progress);
      setSpellingWords([]);
    },
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
      <span className="sr-only" aria-live="polite">
        {saveStatus === "loading" ? "Loading saved study data." : null}
        {saveStatus === "saving" ? "Saving study data to the database." : null}
        {saveStatus === "saved" ? `Study data saved to the ${databaseLabel}.` : null}
        {saveStatus === "error" ? `Database save failed: ${saveError}` : null}
      </span>
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("ProgressProvider missing");
  return ctx;
}
