import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { isSubjectId, SUBJECTS, type Card } from "@/data/catalog";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/subject/$subject/memorize")({
  component: MemorizePage,
});

function shuffleCards(cards: Card[]) {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const swap = copy[i];
    copy[i] = copy[j] ?? copy[i];
    copy[j] = swap ?? copy[j];
  }
  return copy;
}

function MemorizePage() {
  const { subject: raw } = Route.useParams();
  const { progress, setKnown } = useProgress();
  const [flipped, setFlipped] = useState(false);
  const [onlyUnknown, setOnlyUnknown] = useState(false);
  const [cursor, setCursor] = useState(0);
  const [deck, setDeck] = useState<Card[]>([]);
  const [readyDeck, setReadyDeck] = useState(false);

  useEffect(() => {
    if (!isSubjectId(raw)) return;
    setDeck(shuffleCards(SUBJECTS[raw].cards));
    setCursor(0);
    setFlipped(false);
    setReadyDeck(true);
  }, [raw]);

  if (!isSubjectId(raw)) return null;
  const subject = SUBJECTS[raw];
  const visible = onlyUnknown ? deck.filter((c) => !progress.known.includes(c.id)) : deck;
  const safeCursor = visible.length === 0 ? 0 : cursor % visible.length;
  const card = visible[safeCursor];
  const knownCount = subject.cards.filter((c) => progress.known.includes(c.id)).length;

  function advance() {
    setFlipped(false);
    setCursor((n) => n + 1);
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
      <h1 className="text-3xl font-semibold text-navy">Memorize</h1>
      <p className="mt-2 tabular-nums text-muted">
        {knownCount}/{subject.cards.length} marked known
      </p>
      <label className="mt-3 flex min-h-11 items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          checked={onlyUnknown}
          onChange={(e) => {
            setOnlyUnknown(e.target.checked);
            setCursor(0);
            setFlipped(false);
          }}
        />
        Only cards I do not know yet
      </label>

      {!readyDeck ? (
        <p className="mt-6 text-muted">Loading cards…</p>
      ) : card ? (
        <section className="mt-4 max-w-xl">
          <button
            type="button"
            onClick={() => setFlipped((v) => !v)}
            className="flex min-h-52 w-full flex-col items-start justify-between rounded-card border border-line bg-card p-6 text-left shadow-sm"
          >
            <span className="text-xs font-semibold tracking-wide text-gold">{flipped ? "Answer" : "Prompt"}</span>
            <span className="font-display text-2xl text-navy">{flipped ? card.back : card.front}</span>
            <span className="text-sm text-muted">{flipped ? "Tap to hide" : "Tap to flip"}</span>
          </button>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setKnown(card.id, true);
                advance();
              }}
              className="min-h-11 rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft"
            >
              I knew it
            </button>
            <button
              type="button"
              onClick={() => {
                setKnown(card.id, false);
                advance();
              }}
              className="min-h-11 rounded-lg border border-line bg-card px-4 text-sm font-semibold"
            >
              Still learning
            </button>
          </div>
        </section>
      ) : (
        <p className="mt-6 rounded-card border border-line bg-ok-bg p-5 text-ok">
          Every card in this deck is marked known. Turn off the filter to review them again.
        </p>
      )}
    </Shell>
  );
}
