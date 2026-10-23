import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as useProgress, i as Route$2, l as isSubjectId, o as SUBJECTS } from "./router-jl9WGw9N.mjs";
import { t as Shell } from "./shell-Baja0T8L.mjs";
// node_modules/.nitro/vite/services/ssr/assets/subject._subject.memorize-CftHWZSo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function shuffleCards(cards) {
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
	const { subject: raw } = Route$2.useParams();
	const { progress, setKnown } = useProgress();
	const [flipped, setFlipped] = (0, import_react.useState)(false);
	const [onlyUnknown, setOnlyUnknown] = (0, import_react.useState)(false);
	const [cursor, setCursor] = (0, import_react.useState)(0);
	const [deck, setDeck] = (0, import_react.useState)([]);
	const [readyDeck, setReadyDeck] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!isSubjectId(raw)) return;
		setDeck(shuffleCards(SUBJECTS[raw].cards));
		setCursor(0);
		setFlipped(false);
		setReadyDeck(true);
	}, [raw]);
	if (!isSubjectId(raw)) return null;
	const subject = SUBJECTS[raw];
	const visible = onlyUnknown ? deck.filter((c) => !progress.known.includes(c.id)) : deck;
	const card = visible[visible.length === 0 ? 0 : cursor % visible.length];
	const knownCount = subject.cards.filter((c) => progress.known.includes(c.id)).length;
	function advance() {
		setFlipped(false);
		setCursor((n) => n + 1);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/subject/$subject",
			params: { subject: raw },
			className: "mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-teal no-underline",
			children: subject.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-semibold text-navy",
			children: "Memorize"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 tabular-nums text-muted",
			children: [
				knownCount,
				"/",
				subject.cards.length,
				" marked known"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mt-3 flex min-h-11 items-center gap-2 text-sm font-semibold",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				checked: onlyUnknown,
				onChange: (e) => {
					setOnlyUnknown(e.target.checked);
					setCursor(0);
					setFlipped(false);
				}
			}), "Only cards I do not know yet"]
		}),
		!readyDeck ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 text-muted",
			children: "Loading cards…"
		}) : card ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setFlipped((v) => !v),
				className: "flex min-h-52 w-full flex-col items-start justify-between rounded-card border border-line bg-card p-6 text-left shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold tracking-wide text-gold",
						children: flipped ? "Answer" : "Prompt"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-2xl text-navy",
						children: flipped ? card.back : card.front
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: flipped ? "Tap to hide" : "Tap to flip"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setKnown(card.id, true);
						advance();
					},
					className: "min-h-11 rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft",
					children: "I knew it"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						setKnown(card.id, false);
						advance();
					},
					className: "min-h-11 rounded-lg border border-line bg-card px-4 text-sm font-semibold",
					children: "Still learning"
				})]
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-6 rounded-card border border-line bg-ok-bg p-5 text-ok",
			children: "Every card in this deck is marked known. Turn off the filter to review them again."
		})
	] });
}
export { MemorizePage as component };
