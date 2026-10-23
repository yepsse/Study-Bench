import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Shell } from "@/components/shell";
import { isSubjectId, SUBJECTS } from "@/data/catalog";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/subject/$subject/test")({
  component: TestPage,
});

function shuffle(length: number) {
  const ids = Array.from({ length }, (_, i) => i);
  for (let i = ids.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = ids[i] ?? i;
    ids[i] = ids[j] ?? j;
    ids[j] = swap;
  }
  return ids;
}

function TestPage() {
  const { subject: raw } = Route.useParams();
  const { addTest } = useProgress();
  const [started, setStarted] = useState(false);
  const [order, setOrder] = useState<number[]>([]);
  const [cursor, setCursor] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const saving = useRef(false);

  if (!isSubjectId(raw)) return null;
  const subject = SUBJECTS[raw];
  const questions = order.map((i) => subject.test[i]).filter((q) => q !== undefined);
  const score = questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
  const current = questions[cursor];
  const allAnswered = answers.length > 0 && answers.every((a) => a !== null);

  function begin() {
    const ids = shuffle(subject.test.length);
    setOrder(ids);
    setAnswers(Array(ids.length).fill(null));
    setCursor(0);
    setSubmitted(false);
    setShowReview(false);
    saving.current = false;
    setStarted(true);
  }

  function choose(choice: number) {
    if (submitted) return;
    setAnswers((prev) => prev.map((value, i) => (i === cursor ? choice : value)));
  }

  function finish() {
    if (!allAnswered || submitted || saving.current) return;
    saving.current = true;
    const finalScore = questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
    setSubmitted(true);
    addTest(raw, finalScore, questions.length);
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
      <h1 className="text-3xl font-semibold text-navy">Test</h1>

      {!started ? (
        <section className="mt-4 max-w-xl rounded-card border border-line bg-card p-5">
          <p>
            {subject.test.length} questions, shuffled. No hints and no explanations while you answer. Your score
            appears after you submit. The correct choices stay hidden unless you open the review.
          </p>
          <button type="button" onClick={begin} className="mt-4 min-h-11 rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft">
            Start test
          </button>
        </section>
      ) : null}

      {started && !submitted && current ? (
        <section className="mt-4 rounded-card border border-line bg-card p-5">
          <p className="text-sm font-semibold tabular-nums text-muted">
            Question {cursor + 1} of {questions.length}
          </p>
          <h2 className="mt-2 text-xl text-navy">{current.prompt}</h2>
          <div className="mt-4 grid gap-2">
            {current.choices.map((choice, i) => (
              <button
                key={choice}
                type="button"
                onClick={() => choose(i)}
                className={
                  "min-h-11 rounded-lg border px-3 py-2 text-left " +
                  (answers[cursor] === i ? "border-teal bg-teal-soft" : "border-line bg-paper")
                }
              >
                {choice}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={cursor === 0}
              onClick={() => setCursor((n) => Math.max(0, n - 1))}
              className="min-h-11 rounded-lg border border-line px-4 text-sm font-semibold disabled:opacity-40"
            >
              Back
            </button>
            {cursor < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCursor((n) => Math.min(questions.length - 1, n + 1))}
                className="min-h-11 rounded-lg border border-line px-4 text-sm font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                disabled={!allAnswered}
                onClick={finish}
                className="min-h-11 rounded-lg bg-navy px-4 text-sm font-semibold text-paper disabled:opacity-40"
              >
                Submit test
              </button>
            )}
          </div>
          {!allAnswered && cursor === questions.length - 1 ? (
            <p className="mt-3 text-sm text-muted">Answer every question before you submit. Use Back to fill any blanks.</p>
          ) : null}
        </section>
      ) : null}

      {submitted ? (
        <section className="mt-4 rounded-card border border-line bg-card p-5">
          <p className="text-sm font-semibold text-muted">Score</p>
          <p className="font-display text-4xl tabular-nums text-navy">
            {score}/{questions.length}
          </p>
          <p className="mt-2 text-muted">Answers are not listed yet. Open the review only when you want them.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowReview((v) => !v)}
              className="min-h-11 rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft"
            >
              {showReview ? "Hide review" : "Show review"}
            </button>
            <button
              type="button"
              onClick={begin}
              className="min-h-11 rounded-lg border border-line px-4 text-sm font-semibold"
            >
              Retake
            </button>
          </div>
          {showReview ? (
            <ol className="mt-5 space-y-4">
              {questions.map((q, i) => {
                const mine = answers[i];
                const ok = mine === q.answer;
                return (
                  <li key={q.id} className="border-t border-line pt-3">
                    <p className="font-semibold text-navy">{q.prompt}</p>
                    <p className={"mt-1 text-sm " + (ok ? "text-ok" : "text-miss")}>
                      Your answer: {mine === null || mine === undefined ? "blank" : q.choices[mine]}
                    </p>
                    <p className="text-sm">Correct: {q.choices[q.answer]}</p>
                    <p className="text-sm text-muted">{q.why}</p>
                  </li>
                );
              })}
            </ol>
          ) : null}
        </section>
      ) : null}
    </Shell>
  );
}
