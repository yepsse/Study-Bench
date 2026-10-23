import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as useProgress, l as isSubjectId, n as Route, o as SUBJECTS } from "./router-jl9WGw9N.mjs";
import { t as Shell } from "./shell-Baja0T8L.mjs";
// node_modules/.nitro/vite/services/ssr/assets/subject._subject.test-CuYdBkx-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function shuffle(length) {
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
	const [started, setStarted] = (0, import_react.useState)(false);
	const [order, setOrder] = (0, import_react.useState)([]);
	const [cursor, setCursor] = (0, import_react.useState)(0);
	const [answers, setAnswers] = (0, import_react.useState)([]);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [showReview, setShowReview] = (0, import_react.useState)(false);
	const saving = (0, import_react.useRef)(false);
	if (!isSubjectId(raw)) return null;
	const subject = SUBJECTS[raw];
	const questions = order.map((i) => subject.test[i]).filter((q) => q !== void 0);
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
	function choose(choice) {
		if (submitted) return;
		setAnswers((prev) => prev.map((value, i) => i === cursor ? choice : value));
	}
	function finish() {
		if (!allAnswered || submitted || saving.current) return;
		saving.current = true;
		const finalScore = questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
		setSubmitted(true);
		addTest(raw, finalScore, questions.length);
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
			children: "Test"
		}),
		!started ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 max-w-xl rounded-card border border-line bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [subject.test.length, " questions, shuffled. No hints and no explanations while you answer. Your score appears after you submit. The correct choices stay hidden unless you open the review."] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: begin,
				className: "mt-4 min-h-11 rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft",
				children: "Start test"
			})]
		}) : null,
		started && !submitted && current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 rounded-card border border-line bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-semibold tabular-nums text-muted",
					children: [
						"Question ",
						cursor + 1,
						" of ",
						questions.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-xl text-navy",
					children: current.prompt
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-2",
					children: current.choices.map((choice, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => choose(i),
						className: "min-h-11 rounded-lg border px-3 py-2 text-left " + (answers[cursor] === i ? "border-teal bg-teal-soft" : "border-line bg-paper"),
						children: choice
					}, choice))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: cursor === 0,
						onClick: () => setCursor((n) => Math.max(0, n - 1)),
						className: "min-h-11 rounded-lg border border-line px-4 text-sm font-semibold disabled:opacity-40",
						children: "Back"
					}), cursor < questions.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCursor((n) => Math.min(questions.length - 1, n + 1)),
						className: "min-h-11 rounded-lg border border-line px-4 text-sm font-semibold",
						children: "Next"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !allAnswered,
						onClick: finish,
						className: "min-h-11 rounded-lg bg-navy px-4 text-sm font-semibold text-paper disabled:opacity-40",
						children: "Submit test"
					})]
				}),
				!allAnswered && cursor === questions.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted",
					children: "Answer every question before you submit. Use Back to fill any blanks."
				}) : null
			]
		}) : null,
		submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-4 rounded-card border border-line bg-card p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-muted",
					children: "Score"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-4xl tabular-nums text-navy",
					children: [
						score,
						"/",
						questions.length
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: "Answers are not listed yet. Open the review only when you want them."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setShowReview((v) => !v),
						className: "min-h-11 rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft",
						children: showReview ? "Hide review" : "Show review"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: begin,
						className: "min-h-11 rounded-lg border border-line px-4 text-sm font-semibold",
						children: "Retake"
					})]
				}),
				showReview ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-5 space-y-4",
					children: questions.map((q, i) => {
						const mine = answers[i];
						const ok = mine === q.answer;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "border-t border-line pt-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-navy",
									children: q.prompt
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm " + (ok ? "text-ok" : "text-miss"),
									children: ["Your answer: ", mine === null || mine === void 0 ? "blank" : q.choices[mine]]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm",
									children: ["Correct: ", q.choices[q.answer]]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: q.why
								})
							]
						}, q.id);
					})
				}) : null
			]
		}) : null
	] });
}
export { TestPage as component };
