import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as closeEnough, d as useProgress, l as isSubjectId, o as SUBJECTS, r as Route$1, u as parseAnswer } from "./router-jl9WGw9N.mjs";
import { t as Shell } from "./shell-Baja0T8L.mjs";
// node_modules/.nitro/vite/services/ssr/assets/subject._subject.study-C_qL91vH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudyPage() {
	const { subject: raw } = Route$1.useParams();
	const { progress, markLesson } = useProgress();
	const [index, setIndex] = (0, import_react.useState)(0);
	const [picked, setPicked] = (0, import_react.useState)(null);
	const [typed, setTyped] = (0, import_react.useState)("");
	const [checked, setChecked] = (0, import_react.useState)(false);
	if (!isSubjectId(raw)) return null;
	const subject = SUBJECTS[raw];
	const lesson = subject.lessons[index] ?? subject.lessons[0];
	function openLesson(next) {
		setIndex(next);
		setPicked(null);
		setTyped("");
		setChecked(false);
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
			children: "Study"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-4 lg:grid-cols-[16rem_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible",
				"aria-label": "Lessons",
				children: subject.lessons.map((item, i) => {
					const done = progress.lessons.includes(item.id);
					const active = i === index;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => openLesson(i),
						className: "min-h-11 shrink-0 rounded-lg border px-3 py-2 text-left text-sm lg:w-full " + (active ? "border-teal bg-teal text-teal-soft" : "border-line bg-card text-ink"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-semibold",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: active ? "text-teal-soft" : "text-muted",
							children: done ? "Finished" : "Not yet"
						})]
					}, item.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LessonView, {
				lesson,
				picked,
				typed,
				checked,
				onPick: (n) => {
					setPicked(n);
					setChecked(false);
				},
				onType: (v) => {
					setTyped(v);
					setChecked(false);
				},
				onCheck: () => {
					setChecked(true);
					const practice = lesson.practice;
					if (practice.kind === "choice" ? picked === practice.answer : closeEnough(parseAnswer(typed), practice.answer)) {
						markLesson(lesson.id);
						if (index < subject.lessons.length - 1) window.setTimeout(() => openLesson(index + 1), 1400);
					}
				},
				onPrev: index > 0 ? () => openLesson(index - 1) : void 0,
				onNext: index < subject.lessons.length - 1 ? () => openLesson(index + 1) : void 0
			})]
		})
	] });
}
function LessonView({ lesson, picked, typed, checked, onPick, onType, onCheck, onPrev, onNext }) {
	const practice = lesson.practice;
	const numeric = practice.kind === "number" ? parseAnswer(typed) : NaN;
	const correct = practice.kind === "choice" ? picked === practice.answer : closeEnough(numeric, practice.answer);
	const canCheck = practice.kind === "choice" ? picked !== null : typed.trim().length > 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-card border border-line bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl text-navy",
				children: lesson.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => {
					if (!("speechSynthesis" in window)) return;
					window.speechSynthesis.cancel();
					const text = `${lesson.title}. ${lesson.paragraphs.join(" ")} ${lesson.exampleNote ?? ""} Your turn: ${practice.prompt}`;
					const utterance = new SpeechSynthesisUtterance(text);
					utterance.rate = .92;
					const voices = window.speechSynthesis.getVoices();
					utterance.voice = voices.find((v) => /en-US/i.test(v.lang) && /natural|enhanced|samantha|google/i.test(v.name)) ?? voices.find((v) => /en-US/i.test(v.lang)) ?? null;
					window.speechSynthesis.speak(utterance);
				},
				className: "mt-3 inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-paper px-3 text-sm font-semibold",
				children: "Read this lesson aloud"
			}),
			lesson.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-ink",
				children: p
			}, p)),
			lesson.exampleNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm font-semibold text-gold",
				children: lesson.exampleNote
			}) : null,
			lesson.steps ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[32rem] border-collapse text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-line text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-semibold",
								children: "Step"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-semibold",
								children: "Work"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 font-semibold",
								children: "Result"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lesson.steps.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-line align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3 font-semibold text-navy",
								children: row.step
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 pr-3",
								children: row.work
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 tabular-nums",
								children: row.result
							})
						]
					}, row.step)) })]
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 rounded-lg bg-paper p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg text-navy",
						children: "Your turn"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: practice.prompt
					}),
					practice.kind === "choice" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid gap-2",
						children: practice.choices.map((choice, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => onPick(i),
							className: "min-h-11 rounded-lg border px-3 py-2 text-left " + (picked === i ? "border-teal bg-teal-soft" : "border-line bg-card"),
							children: choice
						}, choice))
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block text-sm font-semibold text-muted",
						children: [
							"Answer (",
							practice.unit,
							")",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: typed,
								onChange: (e) => onType(e.target.value),
								inputMode: "decimal",
								className: "mt-1 block w-full max-w-xs rounded-lg border border-line bg-card px-3 py-2 text-base text-ink"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !canCheck,
						onClick: onCheck,
						className: "mt-3 min-h-11 rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft disabled:opacity-50",
						children: "Check"
					}),
					checked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 rounded-lg px-3 py-2 text-sm " + (correct ? "bg-ok-bg text-ok" : "bg-miss-bg text-miss"),
						children: [correct ? "Correct. " : "Not yet. ", practice.why]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !onPrev,
					onClick: onPrev,
					className: "min-h-11 rounded-lg border border-line bg-card px-4 text-sm font-semibold disabled:opacity-40",
					children: "Previous"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !onNext,
					onClick: onNext,
					className: "min-h-11 rounded-lg border border-line bg-card px-4 text-sm font-semibold disabled:opacity-40",
					children: "Next lesson"
				})]
			})
		]
	});
}
export { StudyPage as component };
