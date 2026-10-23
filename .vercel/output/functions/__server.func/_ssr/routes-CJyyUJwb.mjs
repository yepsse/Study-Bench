import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Orbit, c as Ear, d as Brain, f as BookOpen, i as Plus, l as Clock3, m as Bone, r as RotateCcw, s as FlaskConical, t as Volume2 } from "../_libs/lucide-react.mjs";
import { d as useProgress, o as SUBJECTS, s as SUBJECT_ORDER } from "./router-jl9WGw9N.mjs";
import { t as Shell } from "./shell-Baja0T8L.mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-CJyyUJwb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function speak(text) {
	if (!("speechSynthesis" in window)) return;
	window.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.rate = .92;
	const voices = window.speechSynthesis.getVoices();
	utterance.voice = voices.find((v) => /en-US/i.test(v.lang) && /natural|enhanced|samantha|google/i.test(v.name)) ?? voices.find((v) => /en-US/i.test(v.lang)) ?? voices.find((v) => /^en/i.test(v.lang)) ?? null;
	window.speechSynthesis.speak(utterance);
}
function LearningLab() {
	const { spellingWords: words, setSpellingWords: saveWords } = useProgress();
	const [newWords, setNewWords] = (0, import_react.useState)("");
	const [secondsVisible, setSecondsVisible] = (0, import_react.useState)(3);
	const [wordIndex, setWordIndex] = (0, import_react.useState)(0);
	const [spellingStarted, setSpellingStarted] = (0, import_react.useState)(false);
	const [showWord, setShowWord] = (0, import_react.useState)(false);
	const [typed, setTyped] = (0, import_react.useState)("");
	const [results, setResults] = (0, import_react.useState)([]);
	const hideTimer = (0, import_react.useRef)(null);
	const [topic, setTopic] = (0, import_react.useState)("");
	const [bookPage, setBookPage] = (0, import_react.useState)("");
	const [couldNotFind, setCouldNotFind] = (0, import_react.useState)(false);
	const [moreLearning, setMoreLearning] = (0, import_react.useState)("");
	const [minutes, setMinutes] = (0, import_react.useState)(20);
	const [timeLeft, setTimeLeft] = (0, import_react.useState)(1800);
	const [timerRunning, setTimerRunning] = (0, import_react.useState)(false);
	const [timerReady, setTimerReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!timerRunning) return;
		const id = window.setInterval(() => setTimeLeft((left) => {
			if (left <= 1) {
				setTimerRunning(false);
				return 0;
			}
			return left - 1;
		}), 1e3);
		return () => window.clearInterval(id);
	}, [timerRunning]);
	(0, import_react.useEffect)(() => () => {
		if (hideTimer.current) clearTimeout(hideTimer.current);
		if ("speechSynthesis" in window) window.speechSynthesis.cancel();
	}, []);
	const activeWord = words[wordIndex];
	const finished = spellingStarted && wordIndex >= words.length && words.length > 0;
	const score = results.filter((r) => r.correct).length;
	function addWords() {
		const additions = newWords.split(/[\n,;]+/).map((w) => w.trim()).filter(Boolean);
		if (!additions.length) return;
		saveWords([...words, ...additions.map((word) => ({
			id: `${Date.now()}-${Math.random()}`,
			word
		}))]);
		setNewWords("");
	}
	function beginSpelling() {
		if (!words.length) return;
		if (hideTimer.current) clearTimeout(hideTimer.current);
		setWordIndex(0);
		setTyped("");
		setResults([]);
		setSpellingStarted(true);
		setShowWord(true);
		hideTimer.current = setTimeout(() => setShowWord(false), secondsVisible * 1e3);
	}
	function submitSpelling() {
		if (!activeWord || !typed.trim()) return;
		setResults((old) => [...old, {
			word: activeWord.word,
			answer: typed.trim(),
			correct: typed.trim().toLocaleLowerCase() === activeWord.word.toLocaleLowerCase()
		}]);
		setTyped("");
		const next = wordIndex + 1;
		setWordIndex(next);
		if (next < words.length) {
			setShowWord(true);
			if (hideTimer.current) clearTimeout(hideTimer.current);
			hideTimer.current = setTimeout(() => setShowWord(false), secondsVisible * 1e3);
		} else setShowWord(false);
	}
	function resetTimer() {
		setTimerRunning(false);
		setTimeLeft(Math.max(1, minutes) * 90);
		setTimerReady(true);
	}
	const formattedTime = `${Math.floor(timeLeft / 60).toString().padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;
	const tutorPrompt = `Act as my personalized tutor. Topic: ${topic || "ask me what I am studying"}. ${moreLearning || "Teach me in depth, give a worked example, check my understanding, and adapt the next lesson to my answers."} Use free resources only if needed. If I have an SW book, ask me to read that first; if I cannot find the topic, teach it directly.`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10 space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-bold uppercase tracking-[0.18em] text-teal",
					children: "Your personal learning desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 text-2xl font-semibold text-navy",
					children: "Practice, listen, and build your own lessons"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-muted",
					children: "Free built-in tools. Your spelling list and study progress are saved to your database. Start with your SW Learning Library book; if you cannot find the topic, use the fallback study guide."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-card border border-line bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "size-5 text-teal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-semibold text-navy",
								children: "Custom spelling test"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Each word appears briefly, then hides. Type it from memory and get a score."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-sm font-semibold",
							children: ["Words to learn", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: newWords,
								onChange: (e) => setNewWords(e.target.value),
								placeholder: "Separate words with commas or put each on a new line",
								rows: 3,
								className: "mt-1 block w-full rounded-lg border border-line bg-paper p-3 font-normal"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: addWords,
							className: "mt-2 inline-flex min-h-10 items-center gap-2 rounded-lg bg-teal px-3 text-sm font-semibold text-teal-soft",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "Add words"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold",
									children: "Show each word"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: secondsVisible,
									onChange: (e) => setSecondsVisible(Number(e.target.value)),
									className: "rounded-lg border border-line bg-paper px-2 py-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 1,
											children: "1 second"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 2,
											children: "2 seconds"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 3,
											children: "3 seconds"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 5,
											children: "5 seconds"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: 8,
											children: "8 seconds"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [words.length, " saved"]
								})
							]
						}),
						words.length > 0 && !spellingStarted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: words.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded-full bg-paper px-3 py-1 text-sm",
								children: [w.word, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": `Remove ${w.word}`,
									onClick: () => saveWords(words.filter((x) => x.id !== w.id)),
									className: "ml-2 font-bold text-miss",
									children: "×"
								})]
							}, w.id))
						}) : null,
						!spellingStarted || finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: !words.length,
							onClick: beginSpelling,
							className: "mt-4 min-h-11 rounded-lg bg-navy px-4 text-sm font-semibold text-paper disabled:opacity-40",
							children: finished ? "Try again" : "Start spelling test"
						}) : null,
						spellingStarted && !finished && activeWord ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg bg-paper p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [
										"Word ",
										wordIndex + 1,
										" of ",
										words.length
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "my-3 flex min-h-16 items-center justify-center rounded-lg border border-line bg-card text-center text-2xl font-bold tracking-wide text-navy",
									children: showWord ? activeWord.word : "••••••••"
								}),
								!showWord ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: (e) => {
										e.preventDefault();
										submitSpelling();
									},
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										autoFocus: true,
										value: typed,
										onChange: (e) => setTyped(e.target.value),
										placeholder: "Type the word from memory",
										className: "min-w-0 flex-1 rounded-lg border border-line bg-card px-3 py-2"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "submit",
										disabled: !typed.trim(),
										className: "min-h-10 rounded-lg bg-teal px-3 text-sm font-semibold text-teal-soft disabled:opacity-40",
										children: "Check & next"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-center text-sm text-muted",
									children: "Memorize it before it disappears…"
								})
							]
						}) : null,
						finished ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg bg-teal-soft p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold text-navy",
								children: [
									"Score: ",
									score,
									"/",
									results.length
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
								className: "mt-2 space-y-1 text-sm",
								children: results.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: r.correct ? "text-ok" : "text-miss",
									children: [
										r.correct ? "✓" : "✗",
										" You typed “",
										r.answer,
										"” — correct spelling: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: r.word })
									]
								}, `${r.word}-${i}`))
							})]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-card border border-line bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock3, { className: "size-5 text-teal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-semibold text-navy",
								children: "Study timer"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "The timer gives you 1.5× the planned time. For example, a 20-minute plan becomes a 30-minute timer."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-sm font-semibold",
							children: ["Planned study time (minutes)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 1,
								max: 240,
								value: minutes,
								onChange: (e) => {
									setMinutes(Math.min(240, Math.max(1, Number(e.target.value) || 1)));
									setTimerReady(false);
								},
								className: "mt-1 block w-full max-w-xs rounded-lg border border-line bg-paper px-3 py-2"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-xl bg-paper p-5 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-4xl font-semibold tabular-nums text-navy",
								children: formattedTime
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted",
								children: timerReady ? `${minutes} planned min × 1.5 = ${minutes * 1.5} timer min` : "Set timer to calculate the 1.5× session"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									if (!timerReady) resetTimer();
									else if (timeLeft > 0) setTimerRunning((v) => !v);
								},
								className: "min-h-11 rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft",
								children: !timerReady ? "Set timer" : timerRunning ? "Pause" : timeLeft === 0 ? "Finished" : "Start / resume"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: resetTimer,
								className: "inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-4 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), "Reset"]
							})]
						}),
						timeLeft === 0 && timerReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-semibold text-teal",
							children: "Session complete. Take a short break or start another round."
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-card border border-line bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5 text-teal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-semibold text-navy",
								children: "SW book first"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Enter the assigned topic, then look for it in your SW Learning Library Science Book, Volume 3. This avoids giving you random study before you check your book."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-sm font-semibold",
							children: ["Topic to find in your book", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: topic,
								onChange: (e) => {
									setTopic(e.target.value);
									setCouldNotFind(false);
								},
								placeholder: "e.g. forces and motion",
								className: "mt-1 block w-full rounded-lg border border-line bg-paper px-3 py-2 font-normal"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block text-sm font-semibold",
							children: ["Page or section (optional)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: bookPage,
								onChange: (e) => setBookPage(e.target.value),
								placeholder: "Page number or heading",
								className: "mt-1 block w-full rounded-lg border border-line bg-paper px-3 py-2 font-normal"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => {
									setCouldNotFind(false);
									setMoreLearning("");
								},
								disabled: !topic.trim(),
								className: "min-h-10 rounded-lg border border-line px-3 text-sm font-semibold disabled:opacity-40",
								children: "I found it — start book study"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setCouldNotFind(true),
								disabled: !topic.trim(),
								className: "min-h-10 rounded-lg bg-teal px-3 text-sm font-semibold text-teal-soft disabled:opacity-40",
								children: "I can’t find it"
							})]
						}),
						topic.trim() && !couldNotFind ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg bg-paper p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-navy",
								children: "Your book-first plan"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
								className: "mt-2 list-decimal space-y-1 pl-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
										"Read “",
										topic,
										"” in your SW book",
										bookPage.trim() ? ` (${bookPage})` : "",
										"."
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Explain the section in your own words." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Ask for a quiz or extra explanation if anything is confusing." })
								]
							})]
						}) : null,
						couldNotFind ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-lg border border-line bg-paper p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-navy",
									children: "No problem — use this study guide instead"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-sm",
									children: [
										"Topic: ",
										topic,
										". Start with this framework:"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
									className: "mt-2 list-decimal space-y-2 pl-5 text-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Core idea:" }),
											" Write a one-sentence definition of ",
											topic,
											"."
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Key vocabulary:" }), " List 3–5 important words and define them."] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Example:" }), " Explain one real-world example."] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Check yourself:" }), " Explain the idea without looking, then write one question you still have."] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted",
									children: "This is a study framework, not a claim about the exact contents of your book. Ask for a topic explanation below to build a full lesson."
								})
							]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-card border border-line bg-card p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ear, { className: "size-5 text-teal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xl font-semibold text-navy",
								children: "Ask for more learning"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "Ask for a simpler explanation, harder examples, a quiz, vocabulary, or review. Read-aloud uses your device’s built-in speech; voice quality depends on your browser and operating system."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4 block text-sm font-semibold",
							children: ["What should we practice next?", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: moreLearning,
								onChange: (e) => setMoreLearning(e.target.value),
								placeholder: "e.g. Explain this more deeply, give me 5 questions, or make it easier first…",
								rows: 3,
								className: "mt-1 block w-full rounded-lg border border-line bg-paper p-3 font-normal"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => speak(`${topic ? `Topic: ${topic}. ` : ""}${moreLearning || "Review the topic, explain the main idea, give an example, then quiz me."}`),
							disabled: !topic.trim() && !moreLearning.trim(),
							className: "mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft disabled:opacity-40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-4" }), "Read request aloud"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								navigator.clipboard?.writeText(tutorPrompt);
							},
							disabled: !topic.trim() && !moreLearning.trim(),
							className: "mt-3 ml-2 min-h-11 rounded-lg border border-line px-4 text-sm font-semibold disabled:opacity-40",
							children: "Copy personalized tutor prompt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-muted",
							children: "This standalone app has no live AI connection, so it will not pretend an AI tutor is connected. Copy the prompt into a chat assistant to generate a personalized lesson."
						})
					]
				})
			]
		})]
	});
}
var ICONS = {
	anatomy: Bone,
	chemistry: FlaskConical,
	physics: Orbit,
	english: BookOpen
};
function Home() {
	const { ready, progress, reset, saveStatus, saveError, databaseLabel } = useProgress();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mb-8 max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-semibold text-navy",
					children: "Four subjects. Three ways to practice."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted",
					children: "Study mode explains the idea and shows a worked example. Test mode hides the answers until you submit. Memorize mode is flip cards."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					role: "status",
					"aria-live": "polite",
					children: [
						saveStatus === "loading" ? "Loading saved study data…" : null,
						saveStatus === "saving" ? "Saving study data…" : null,
						saveStatus === "saved" ? `Saved to ${databaseLabel}.` : null,
						saveStatus === "error" ? `Could not save to the database: ${saveError}` : null
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: SUBJECT_ORDER.map((id) => {
				const subject = SUBJECTS[id];
				const Icon = ICONS[id];
				const done = subject.lessons.filter((l) => progress.lessons.includes(l.id)).length;
				const known = subject.cards.filter((c) => progress.known.includes(c.id)).length;
				const last = [...progress.tests].reverse().find((t) => t.subject === id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-card border border-line bg-card p-5 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-11 items-center justify-center rounded-full bg-teal-soft text-teal",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
									className: "size-5",
									"aria-hidden": "true"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl text-navy",
								children: subject.name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "min-h-12 text-sm text-muted",
							children: subject.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm tabular-nums text-ink",
							children: [
								ready ? `${done}/${subject.lessons.length} lessons` : "Lessons",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: " · "
								}),
								ready ? `${known}/${subject.cards.length} cards` : "Cards",
								last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted",
									children: [
										" ",
										"· last test ",
										last.score,
										"/",
										last.total
									]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/subject/$subject",
							params: { subject: id },
							className: "mt-4 inline-flex min-h-11 items-center rounded-lg bg-teal px-4 text-sm font-semibold text-teal-soft no-underline",
							children: ["Open ", subject.name]
						})
					]
				}, id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LearningLab, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-sm text-muted",
			children: "Anatomy here skips the reproductive system. Study progress and spelling words are saved to the database."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: reset,
			className: "mt-2 min-h-11 text-sm font-semibold text-muted underline decoration-line underline-offset-4",
			children: "Reset saved progress"
		})
	] });
}
export { Home as component };
