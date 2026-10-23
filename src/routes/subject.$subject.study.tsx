import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { closeEnough, isSubjectId, parseAnswer, SUBJECTS, type Lesson } from "@/data/catalog";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/subject/$subject/study")({
  component: StudyPage,
});

function StudyPage() {
  const { subject: raw } = Route.useParams();
  const { progress, markLesson } = useProgress();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(false);

  if (!isSubjectId(raw)) return null;
  const subject = SUBJECTS[raw];
  const lesson = subject.lessons[index] ?? subject.lessons[0];

  function openLesson(next: number) {
    setIndex(next);
    setPicked(null);
    setTyped("");
    setChecked(false);
  }

  return (
    <Shell>
      <Link
        to="/subject/$subject"
        params={{ subject: raw }}
        className="mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-teal no-underline"
      >
        {subject.name}
      </Link>
      <h1 className="text-3xl font-semibold text-navy">Study</h1>
      <div className="mt-5 grid gap-4 lg:grid-cols-[16rem_1fr]">
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible" aria-label="Lessons">
          {subject.lessons.map((item, i) => {
            const done = progress.lessons.includes(item.id);
            const active = i === index;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => openLesson(i)}
                className={
                  "min-h-11 shrink-0 rounded-lg border px-3 py-2 text-left text-sm lg:w-full " +
                  (active ? "border-teal bg-teal text-teal-soft" : "border-line bg-card text-ink")
                }
              >
                <span className="block font-semibold">{item.title}</span>
                <span className={active ? "text-teal-soft" : "text-muted"}>{done ? "Finished" : "Not yet"}</span>
              </button>
            );
          })}
        </nav>
        <LessonView
          lesson={lesson}
          picked={picked}
          typed={typed}
          checked={checked}
          onPick={(n) => {
            setPicked(n);
            setChecked(false);
          }}
          onType={(v) => {
            setTyped(v);
            setChecked(false);
          }}
          onCheck={() => {
            setChecked(true);
            const practice = lesson.practice;
            const ok =
              practice.kind === "choice"
                ? picked === practice.answer
                : closeEnough(parseAnswer(typed), practice.answer);
            if (ok) {
              markLesson(lesson.id);
              if (index < subject.lessons.length - 1) window.setTimeout(() => openLesson(index + 1), 1400);
            }
          }}
          onPrev={index > 0 ? () => openLesson(index - 1) : undefined}
          onNext={index < subject.lessons.length - 1 ? () => openLesson(index + 1) : undefined}
        />
      </div>
    </Shell>
  );
}

function LessonView({
  lesson,
  picked,
  typed,
  checked,
  onPick,
  onType,
  onCheck,
  onPrev,
  onNext,
}: {
  lesson: Lesson;
  picked: number | null;
  typed: string;
  checked: boolean;
  onPick: (n: number) => void;
  onType: (v: string) => void;
  onCheck: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const practice = lesson.practice;
  const numeric = practice.kind === "number" ? parseAnswer(typed) : NaN;
  const correct =
    practice.kind === "choice" ? picked === practice.answer : closeEnough(numeric, practice.answer);
  const canCheck = practice.kind === "choice" ? picked !== null : typed.trim().length > 0;

  return (
    <article className="rounded-card border border-line bg-card p-5">
      <h2 className="text-2xl text-navy">{lesson.title}</h2>
      <button type="button" onClick={() => {
        if (!("speechSynthesis" in window)) return;
        window.speechSynthesis.cancel();
        const text = `${lesson.title}. ${lesson.paragraphs.join(" ")} ${lesson.exampleNote ?? ""} Your turn: ${practice.prompt}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.92;
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices.find(v => /en-US/i.test(v.lang) && /natural|enhanced|samantha|google/i.test(v.name)) ?? voices.find(v => /en-US/i.test(v.lang)) ?? null;
        window.speechSynthesis.speak(utterance);
      }} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-paper px-3 text-sm font-semibold">
        Read this lesson aloud
      </button>
      {lesson.paragraphs.map((p) => (
        <p key={p} className="mt-3 text-ink">
          {p}
        </p>
      ))}
      {lesson.exampleNote ? <p className="mt-4 text-sm font-semibold text-gold">{lesson.exampleNote}</p> : null}
      {lesson.steps ? (
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                <th className="py-2 pr-3 font-semibold">Step</th>
                <th className="py-2 pr-3 font-semibold">Work</th>
                <th className="py-2 font-semibold">Result</th>
              </tr>
            </thead>
            <tbody>
              {lesson.steps.map((row) => (
                <tr key={row.step} className="border-b border-line align-top">
                  <td className="py-2 pr-3 font-semibold text-navy">{row.step}</td>
                  <td className="py-2 pr-3">{row.work}</td>
                  <td className="py-2 tabular-nums">{row.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <section className="mt-6 rounded-lg bg-paper p-4">
        <h3 className="text-lg text-navy">Your turn</h3>
        <p className="mt-2">{practice.prompt}</p>
        {practice.kind === "choice" ? (
          <div className="mt-3 grid gap-2">
            {practice.choices.map((choice, i) => (
              <button
                key={choice}
                type="button"
                onClick={() => onPick(i)}
                className={
                  "min-h-11 rounded-lg border px-3 py-2 text-left " +
                  (picked === i ? "border-teal bg-teal-soft" : "border-line bg-card")
                }
              >
                {choice}
              </button>
            ))}
          </div>
        ) : (
          <label className="mt-3 block text-sm font-semibold text-muted">
            Answer ({practice.unit})
            <input
              value={typed}
              onChange={(e) => onType(e.target.value)}
              inputMode="decimal"
              className="mt-1 block w-full max-w-xs rounded-lg border border-line bg-card px-3 py-2 text-base text-ink"
            />
          </label>
        )}
        <button
          type="button"
          disabled={!canCheck}
          onClick={onCheck}
          className="mt-3 min-h-11 rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft disabled:opacity-50"
        >
          Check
        </button>
        {checked ? (
          <p className={"mt-3 rounded-lg px-3 py-2 text-sm " + (correct ? "bg-ok-bg text-ok" : "bg-miss-bg text-miss")}>
            {correct ? "Correct. " : "Not yet. "}
            {practice.why}
          </p>
        ) : null}
      </section>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={!onPrev}
          onClick={onPrev}
          className="min-h-11 rounded-lg border border-line bg-card px-4 text-sm font-semibold disabled:opacity-40"
        >
          Previous
        </button>
        <button
          type="button"
          disabled={!onNext}
          onClick={onNext}
          className="min-h-11 rounded-lg border border-line bg-card px-4 text-sm font-semibold disabled:opacity-40"
        >
          Next lesson
        </button>
      </div>
    </article>
  );
}
