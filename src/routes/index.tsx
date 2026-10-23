import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Bone, FlaskConical, Orbit } from "lucide-react";
import { Shell } from "@/components/shell";
import { SUBJECT_ORDER, SUBJECTS, type SubjectId } from "@/data/catalog";
import { useProgress } from "@/lib/progress";
import { LearningLab } from "@/components/learning-lab";

export const Route = createFileRoute("/")({ component: Home });

const ICONS: Record<SubjectId, typeof Bone> = {
  anatomy: Bone,
  chemistry: FlaskConical,
  physics: Orbit,
  english: BookOpen,
};

function Home() {
  const { ready, progress, reset, saveStatus, saveError, databaseLabel } = useProgress();

  return (
    <Shell>
      <section className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold text-navy">Four subjects. Three ways to practice.</h1>
        <p className="mt-3 text-muted">
          Study mode explains the idea and shows a worked example. Test mode hides the answers until you submit.
          Memorize mode is flip cards.
        </p>
        <p className="mt-3 text-sm text-muted" role="status" aria-live="polite">
          {saveStatus === "loading" ? "Loading saved study data…" : null}
          {saveStatus === "saving" ? "Saving study data…" : null}
          {saveStatus === "saved" ? `Saved to ${databaseLabel}.` : null}
          {saveStatus === "error" ? `Could not save to the database: ${saveError}` : null}
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2">
        {SUBJECT_ORDER.map((id) => {
          const subject = SUBJECTS[id];
          const Icon = ICONS[id];
          const done = subject.lessons.filter((l) => progress.lessons.includes(l.id)).length;
          const known = subject.cards.filter((c) => progress.known.includes(c.id)).length;
          const last = [...progress.tests].reverse().find((t) => t.subject === id);
          return (
            <article key={id} className="rounded-card border border-line bg-card p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-teal-soft text-teal">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="text-xl text-navy">{subject.name}</h2>
              </div>
              <p className="min-h-12 text-sm text-muted">{subject.blurb}</p>
              <p className="mt-3 text-sm tabular-nums text-ink">
                {ready ? `${done}/${subject.lessons.length} lessons` : "Lessons"}
                <span className="text-muted"> · </span>
                {ready ? `${known}/${subject.cards.length} cards` : "Cards"}
                {last ? (
                  <span className="text-muted">
                    {" "}
                    · last test {last.score}/{last.total}
                  </span>
                ) : null}
              </p>
              <Link
                to="/subject/$subject"
                params={{ subject: id }}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft no-underline"
              >
                Open {subject.name}
              </Link>
            </article>
          );
        })}
      </div>
      <LearningLab />
      <p className="mt-8 text-sm text-muted">
        Anatomy here skips the reproductive system. Study progress and spelling words are saved to the database.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-2 min-h-11 text-sm font-semibold text-muted underline decoration-line underline-offset-4"
      >
        Reset saved progress
      </button>
    </Shell>
  );
}
