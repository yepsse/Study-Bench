import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, ClipboardCheck, Layers } from "lucide-react";
import { Shell } from "@/components/shell";
import { isSubjectId, SUBJECTS } from "@/data/catalog";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/subject/$subject/")({
  component: SubjectHome,
});

function SubjectHome() {
  const { subject: raw } = Route.useParams();
  const { progress } = useProgress();
  if (!isSubjectId(raw)) return null;
  const subject = SUBJECTS[raw];
  const done = subject.lessons.filter((l) => progress.lessons.includes(l.id)).length;
  const known = subject.cards.filter((c) => progress.known.includes(c.id)).length;

  const modes = [
    {
      to: "/subject/$subject/study" as const,
      title: "Study",
      text: "Read the explanation, follow the example, then try one problem.",
      icon: BookMarked,
      meta: `${done}/${subject.lessons.length} lessons finished`,
    },
    {
      to: "/subject/$subject/test" as const,
      title: "Test",
      text: "A real quiz. No hints while you work. Score first. Review only if you ask for it.",
      icon: ClipboardCheck,
      meta: `${subject.test.length} questions`,
    },
    {
      to: "/subject/$subject/memorize" as const,
      title: "Memorize",
      text: "Flip a card. Mark it known when you can say the answer before you look.",
      icon: Layers,
      meta: `${known}/${subject.cards.length} cards known`,
    },
  ];

  return (
    <Shell>
      <Link to="/" className="mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-teal no-underline">
        All subjects
      </Link>
      <h1 className="text-3xl font-semibold text-navy">{subject.name}</h1>
      <p className="mt-2 max-w-2xl text-muted">{subject.blurb}</p>
      {subject.note ? <p className="mt-3 max-w-2xl text-sm text-ink">{subject.note}</p> : null}
      <div className="mt-6 grid gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Link
              key={mode.title}
              to={mode.to}
              params={{ subject: raw }}
              className="flex items-start gap-4 rounded-card border border-line bg-card p-5 no-underline shadow-sm"
            >
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-soft text-teal">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-display text-xl text-navy">{mode.title}</span>
                <span className="mt-1 block text-sm text-muted">{mode.text}</span>
                <span className="mt-2 block text-sm font-semibold tabular-nums text-ink">{mode.meta}</span>
              </span>
            </Link>
          );
        })}
      </div>
      {subject.reading && subject.reading.length > 0 ? (
        <aside className="mt-8 rounded-card border border-line bg-gold-soft p-4 text-sm text-ink">
          <p className="font-semibold text-gold">Extra reading, no school account</p>
          <ul className="mt-2 space-y-1">
            {subject.reading.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="font-semibold text-teal underline underline-offset-2" target="_blank" rel="noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-2 text-muted">These are public sites. I have not opened the live pages in this session.</p>
        </aside>
      ) : null}
    </Shell>
  );
}
