import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Layers, p as BookMarked, u as ClipboardCheck } from "../_libs/lucide-react.mjs";
import { a as Route$3, d as useProgress, l as isSubjectId, o as SUBJECTS } from "./router-jl9WGw9N.mjs";
import { t as Shell } from "./shell-Baja0T8L.mjs";
// node_modules/.nitro/vite/services/ssr/assets/subject._subject.index-DyqE9zRb.js
var import_jsx_runtime = require_jsx_runtime();
function SubjectHome() {
	const { subject: raw } = Route$3.useParams();
	const { progress } = useProgress();
	if (!isSubjectId(raw)) return null;
	const subject = SUBJECTS[raw];
	const done = subject.lessons.filter((l) => progress.lessons.includes(l.id)).length;
	const known = subject.cards.filter((c) => progress.known.includes(c.id)).length;
	const modes = [
		{
			to: "/subject/$subject/study",
			title: "Study",
			text: "Read the explanation, follow the example, then try one problem.",
			icon: BookMarked,
			meta: `${done}/${subject.lessons.length} lessons finished`
		},
		{
			to: "/subject/$subject/test",
			title: "Test",
			text: "A real quiz. No hints while you work. Score first. Review only if you ask for it.",
			icon: ClipboardCheck,
			meta: `${subject.test.length} questions`
		},
		{
			to: "/subject/$subject/memorize",
			title: "Memorize",
			text: "Flip a card. Mark it known when you can say the answer before you look.",
			icon: Layers,
			meta: `${known}/${subject.cards.length} cards known`
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-teal no-underline",
			children: "All subjects"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-semibold text-navy",
			children: subject.name
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-2xl text-muted",
			children: subject.blurb
		}),
		subject.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 max-w-2xl text-sm text-ink",
			children: subject.note
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 grid gap-4",
			children: modes.map((mode) => {
				const Icon = mode.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: mode.to,
					params: { subject: raw },
					className: "flex items-start gap-4 rounded-card border border-line bg-card p-5 no-underline shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-soft text-teal",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
							className: "size-5",
							"aria-hidden": "true"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block font-display text-xl text-navy",
							children: mode.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted",
							children: mode.text
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-2 block text-sm font-semibold tabular-nums text-ink",
							children: mode.meta
						})
					] })]
				}, mode.title);
			})
		}),
		subject.reading && subject.reading.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "mt-8 rounded-card border border-line bg-gold-soft p-4 text-sm text-ink",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-gold",
					children: "Extra reading, no school account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 space-y-1",
					children: subject.reading.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: link.href,
						className: "font-semibold text-teal underline underline-offset-2",
						target: "_blank",
						rel: "noreferrer",
						children: link.label
					}) }, link.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: "These are public sites. I have not opened the live pages in this session."
				})
			]
		}) : null
	] });
}
export { SubjectHome as component };
