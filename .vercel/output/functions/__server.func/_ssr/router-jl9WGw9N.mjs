import { o as __toESM } from "../_runtime.mjs";
import { J as require_react, _ as createFileRoute, b as useRouter, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, n as literal, o as union, r as number, t as array } from "../_libs/zod.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
// node_modules/.nitro/vite/services/ssr/assets/router-jl9WGw9N.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var testRecordSchema = object({
	subject: string().min(1).max(100),
	score: number().int().nonnegative(),
	total: number().int().nonnegative(),
	at: number().int().nonnegative()
});
var studyProgressSchema = object({
	lessons: array(string().min(1).max(200)).max(1e3),
	known: array(string().min(1).max(200)).max(1e3),
	tests: array(testRecordSchema).max(24)
});
var spellingWordSchema = object({
	id: string().min(1).max(200),
	word: string().min(1).max(500)
});
var spellingWordsSchema = array(spellingWordSchema).max(1e3);
var studyDataSchema = object({
	progress: studyProgressSchema,
	spellingWords: spellingWordsSchema
});
var emptyStudyData = {
	progress: {
		lessons: [],
		known: [],
		tests: []
	},
	spellingWords: []
};
var getStudyData = createServerFn({ method: "GET" }).handler(createSsrRpc("d3fa4e55edbcda9d3d3df633d0be13dca78ace219023919ee83060e032724af5"));
var saveStudyData = createServerFn({ method: "POST" }).validator((input) => studyDataSchema.parse(input)).handler(createSsrRpc("b81aa4cd5eeea8d0f147ce800b60917787ce49994083bfc011a7991b42ced7ec"));
var PROGRESS_KEY = "study-bench-v1";
var SPELLING_KEY = "study-bench-custom-spelling-words";
var ProgressContext = (0, import_react.createContext)(null);
function loadLocalData() {
	try {
		const rawProgress = localStorage.getItem(PROGRESS_KEY);
		const parsedProgress = rawProgress ? JSON.parse(rawProgress) : {};
		const progressObject = parsedProgress && typeof parsedProgress === "object" ? parsedProgress : {};
		const parsedWords = JSON.parse(localStorage.getItem(SPELLING_KEY) ?? "[]");
		const progress = studyProgressSchema.safeParse({
			lessons: Array.isArray(progressObject.lessons) ? progressObject.lessons.filter((item) => typeof item === "string") : [],
			known: Array.isArray(progressObject.known) ? progressObject.known.filter((item) => typeof item === "string") : [],
			tests: Array.isArray(progressObject.tests) ? progressObject.tests.filter((item) => studyProgressSchema.shape.tests.element.safeParse(item).success) : []
		});
		const words = spellingWordsSchema.safeParse(parsedWords);
		return {
			progress: progress.success ? progress.data : emptyStudyData.progress,
			spellingWords: words.success ? words.data : []
		};
	} catch {
		return emptyStudyData;
	}
}
function ProgressProvider({ children }) {
	const [progress, setProgress] = (0, import_react.useState)(emptyStudyData.progress);
	const [spellingWords, setSpellingWords] = (0, import_react.useState)([]);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [saveStatus, setSaveStatus] = (0, import_react.useState)("loading");
	const [saveError, setSaveError] = (0, import_react.useState)(null);
	const [dbSource, setDbSource] = (0, import_react.useState)(null);
	const [canSave, setCanSave] = (0, import_react.useState)(false);
	const saveQueue = (0, import_react.useRef)(Promise.resolve());
	const saveRevision = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const localData = loadLocalData();
		setProgress(localData.progress);
		setSpellingWords(localData.spellingWords);
		getStudyData().then((stored) => {
			if (cancelled) return;
			setDbSource(stored.source);
			const data = stored.data ?? localData;
			setProgress(data.progress);
			setSpellingWords(data.spellingWords);
			setCanSave(true);
			setReady(true);
		}).catch((error) => {
			if (cancelled) return;
			setReady(true);
			setSaveStatus("error");
			setSaveError(error instanceof Error ? error.message : String(error));
		});
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready || !canSave) return;
		try {
			localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
			localStorage.setItem(SPELLING_KEY, JSON.stringify(spellingWords));
		} catch (error) {
			console.error("[study-data] could not update the local backup:", error);
		}
		const revision = ++saveRevision.current;
		setSaveStatus("saving");
		setSaveError(null);
		const timeout = window.setTimeout(() => {
			const write = saveQueue.current.catch(() => void 0).then(async () => {
				const result = await saveStudyData({ data: {
					progress,
					spellingWords
				} });
				if (revision === saveRevision.current) {
					setDbSource(result.source);
					setSaveStatus("saved");
				}
			}).catch((error) => {
				if (revision === saveRevision.current) {
					setSaveStatus("error");
					setSaveError(error instanceof Error ? error.message : String(error));
				}
			});
			saveQueue.current = write;
		}, 300);
		return () => window.clearTimeout(timeout);
	}, [
		progress,
		spellingWords,
		ready,
		canSave
	]);
	const databaseLabel = dbSource === "neon" ? "Neon database" : dbSource === "pglite" ? "local preview database" : "database";
	const value = {
		ready,
		progress,
		spellingWords,
		saveStatus,
		saveError,
		databaseLabel,
		markLesson: (id) => setProgress((p) => p.lessons.includes(id) ? p : {
			...p,
			lessons: [...p.lessons, id]
		}),
		setKnown: (id, known) => setProgress((p) => {
			const has = p.known.includes(id);
			if (known && has) return p;
			if (!known && !has) return p;
			return {
				...p,
				known: known ? [...p.known, id] : p.known.filter((x) => x !== id)
			};
		}),
		addTest: (subject, score, total) => setProgress((p) => ({
			...p,
			tests: [...p.tests, {
				subject,
				score,
				total,
				at: Date.now()
			}].slice(-24)
		})),
		setSpellingWords,
		reset: () => {
			setProgress(emptyStudyData.progress);
			setSpellingWords([]);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ProgressContext.Provider, {
		value,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "sr-only",
			"aria-live": "polite",
			children: [
				saveStatus === "loading" ? "Loading saved study data." : null,
				saveStatus === "saving" ? "Saving study data to the database." : null,
				saveStatus === "saved" ? `Study data saved to the ${databaseLabel}.` : null,
				saveStatus === "error" ? `Database save failed: ${saveError}` : null
			]
		})]
	});
}
function useProgress() {
	const ctx = (0, import_react.useContext)(ProgressContext);
	if (!ctx) throw new Error("ProgressProvider missing");
	return ctx;
}
var styles_default = "/assets/styles-Cy8pyVFn.css";
var APP_NAME = "Study Bench";
var Route$6 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Study, test, and memorize anatomy, chemistry, physics, and English."
			},
			{
				name: "theme-color",
				content: "#16324F"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$5 = () => import("./routes-CJyyUJwb.mjs");
var Route$5 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var SUBJECT_ORDER = [
	"anatomy",
	"chemistry",
	"physics",
	"english"
];
var SUBJECTS = {
	anatomy: {
		id: "anatomy",
		name: "Anatomy",
		blurb: "How the body is built: bones, muscles, heart, lungs, digestion, nerves, and defense.",
		note: "This section covers support, movement, breathing, blood, digestion, nerves, and the immune system. It does not include the reproductive system.",
		lessons: [
			{
				id: "an-levels",
				title: "How the body is organized",
				paragraphs: ["Anatomy is the study of body structure: what the parts are and where they sit.", "The body is stacked in levels. A cell is the smallest living unit. A tissue is many similar cells working together. An organ, such as the heart or a lung, is tissues built into a part with one main job. An organ system is several organs working on the same job. All the systems together make the whole organism."],
				practice: {
					kind: "choice",
					prompt: "Which list goes from smallest to largest?",
					choices: [
						"Cell, tissue, organ, organ system",
						"Organ system, organ, tissue, cell",
						"Tissue, cell, organ system, organ",
						"Organ, tissue, cell, organ system"
					],
					answer: 0,
					why: "Cell is smallest, then tissue, then organ, then organ system."
				}
			},
			{
				id: "an-bones",
				title: "Skeleton",
				paragraphs: ["Bones support the body, protect organs, and give muscles a place to pull.", "The skull protects the brain. The ribs protect the heart and lungs. The spine is a stack of vertebrae. It holds you upright and protects the spinal cord. The humerus is the upper-arm bone. The femur is the thigh bone, the longest bone in the body. The hip bones connect the legs to the spine so you can stand and walk."],
				practice: {
					kind: "choice",
					prompt: "Which bone protects the brain?",
					choices: [
						"Femur",
						"Humerus",
						"Skull",
						"Rib"
					],
					answer: 2,
					why: "The skull is the bony case around the brain. Ribs protect the heart and lungs."
				}
			},
			{
				id: "an-muscles",
				title: "Muscles and everyday names",
				paragraphs: ["Skeletal muscles pull on bones. They do not push. They work in pairs so a joint can bend and then straighten.", "Biceps bend the elbow. Triceps straighten the elbow. Deltoids are the shoulder muscles that lift the arm out to the side. Pectorals sit on the chest and pull the arm inward. Abdominals help bend the trunk and steady the middle of the body. Quadriceps on the front of the thigh straighten the knee. Hamstrings on the back of the thigh bend the knee. The calf (gastrocnemius) points the foot downward."],
				practice: {
					kind: "choice",
					prompt: "Which muscle straightens the elbow?",
					choices: [
						"Biceps",
						"Triceps",
						"Quadriceps",
						"Hamstrings"
					],
					answer: 1,
					why: "Biceps bend the elbow. Triceps straighten it. Quadriceps and hamstrings work the knee."
				}
			},
			{
				id: "an-heart",
				title: "Heart and blood vessels",
				paragraphs: [
					"The heart is a muscular pump with four chambers. The two atria on top receive blood. The two ventricles below pump blood out.",
					"Arteries carry blood away from the heart. Veins carry blood back toward the heart. Capillaries are tiny vessels where oxygen and nutrients leave the blood and enter cells.",
					"Blood picks up oxygen in the lungs, returns to the heart, and is pumped out to the rest of the body."
				],
				practice: {
					kind: "choice",
					prompt: "Arteries carry blood…",
					choices: [
						"Away from the heart",
						"Only toward the heart",
						"Only inside the lungs",
						"From the stomach to the liver and nowhere else"
					],
					answer: 0,
					why: "Arteries leave the heart. Veins return blood to the heart."
				}
			},
			{
				id: "an-lungs",
				title: "Lungs and breathing",
				paragraphs: [
					"Air enters through the nose or mouth, goes down the trachea (windpipe), splits into bronchi, and reaches the lungs.",
					"Alveoli are tiny air sacs. Oxygen moves from the air into the blood there, and carbon dioxide moves out.",
					"The diaphragm is a muscle under the lungs. When it contracts and flattens, the chest gets larger and you inhale."
				],
				practice: {
					kind: "choice",
					prompt: "What does the diaphragm do when you inhale?",
					choices: [
						"It contracts and flattens so the chest expands",
						"It pumps blood into the aorta",
						"It grinds food in the stomach",
						"It stores bile"
					],
					answer: 0,
					why: "The diaphragm is the breathing muscle under the lungs, not a pump or a digestive organ."
				}
			},
			{
				id: "an-digest",
				title: "Digestion path",
				paragraphs: ["Food is broken down so cells can use the nutrients.", "The path is mouth, esophagus, stomach, small intestine, then large intestine. Chewing and saliva start the job. The stomach churns food. Most nutrients are absorbed in the small intestine. The large intestine takes back water. The liver makes bile, which helps break up fats. Bile is stored in the gallbladder."],
				practice: {
					kind: "choice",
					prompt: "Where are most nutrients absorbed?",
					choices: [
						"Stomach",
						"Esophagus",
						"Small intestine",
						"Trachea"
					],
					answer: 2,
					why: "The small intestine is the main absorption site. The trachea is an airway, not a digestive organ."
				}
			},
			{
				id: "an-nerves",
				title: "Brain, spinal cord, and nerves",
				paragraphs: ["The nervous system controls the body and carries messages.", "The brain handles thinking, senses, balance, and many automatic jobs such as breathing rate. The spinal cord runs inside the spine and carries signals between the brain and the body. Nerves branch out from there. Sensory signals travel in from the body. Motor signals travel out to muscles."],
				practice: {
					kind: "choice",
					prompt: "What protects the spinal cord?",
					choices: [
						"The ribs only",
						"The vertebrae of the spine",
						"The femur",
						"The diaphragm"
					],
					answer: 1,
					why: "The spinal cord sits inside the vertebrae. The femur is the thigh bone."
				}
			},
			{
				id: "an-immune",
				title: "Immune system, the short version",
				paragraphs: ["The immune system looks for germs and damaged cells.", "Skin, mucus, and stomach acid are barriers. If a germ gets past them, white blood cells respond. Some white blood cells swallow germs. Others make antibodies that match one kind of germ. After a fight, memory cells remember that germ so the next response is faster. A vaccine trains that memory with a safe version of the germ. Fever is a higher body temperature during the fight."],
				practice: {
					kind: "choice",
					prompt: "What is an antibody’s job?",
					choices: [
						"To match a specific germ so the body can target it",
						"To pump blood out of the heart",
						"To absorb nutrients in the stomach",
						"To hold the skull together"
					],
					answer: 0,
					why: "Antibodies are immune proteins shaped to fit a particular germ, not pumps or bones."
				}
			}
		],
		test: [
			{
				id: "at1",
				prompt: "A tissue is best described as…",
				choices: [
					"A group of similar cells working together",
					"A single atom",
					"The whole body",
					"Only the heart’s four chambers"
				],
				answer: 0,
				why: "Tissue is the level above a cell and below an organ."
			},
			{
				id: "at2",
				prompt: "The femur is the…",
				choices: [
					"Upper-arm bone",
					"Thigh bone",
					"Windpipe",
					"Shoulder muscle"
				],
				answer: 1,
				why: "The humerus is the upper arm. The femur is the thigh."
			},
			{
				id: "at3",
				prompt: "Which pair is correct?",
				choices: [
					"Biceps straighten the elbow",
					"Quadriceps bend the knee",
					"Hamstrings bend the knee",
					"Deltoids are in the calf"
				],
				answer: 2,
				why: "Hamstrings on the back of the thigh bend the knee. Quadriceps straighten it."
			},
			{
				id: "at4",
				prompt: "Veins…",
				choices: [
					"Carry blood back toward the heart",
					"Are the air sacs in the lungs",
					"Only exist in the skull",
					"Make bile"
				],
				answer: 0,
				why: "Veins return blood. Arteries carry it away."
			},
			{
				id: "at5",
				prompt: "Oxygen enters the blood mainly in the…",
				choices: [
					"Alveoli",
					"Femur",
					"Biceps",
					"Esophagus"
				],
				answer: 0,
				why: "Alveoli are the lung air sacs where gas exchange happens."
			},
			{
				id: "at6",
				prompt: "Most nutrient absorption happens in the…",
				choices: [
					"Large intestine",
					"Small intestine",
					"Trachea",
					"Skull"
				],
				answer: 1,
				why: "The small intestine absorbs most nutrients. The large intestine mainly recovers water."
			},
			{
				id: "at7",
				prompt: "The liver’s job in digestion includes…",
				choices: [
					"Making bile that helps with fats",
					"Protecting the brain",
					"Straightening the knee",
					"Carrying signals down the arm"
				],
				answer: 0,
				why: "The liver makes bile. The gallbladder stores it."
			},
			{
				id: "at8",
				prompt: "Motor signals…",
				choices: [
					"Tell muscles what to do",
					"Are another name for ribs",
					"Only travel through arteries",
					"Are absorbed in the stomach"
				],
				answer: 0,
				why: "Motor nerves carry commands out to muscles. Sensory nerves bring information in."
			},
			{
				id: "at9",
				prompt: "A vaccine helps because it…",
				choices: [
					"Trains immune memory with a safe version of a germ",
					"Replaces the diaphragm",
					"Adds a new bone to the spine",
					"Stops the heart between beats"
				],
				answer: 0,
				why: "Vaccines teach memory cells to recognize a germ before a real infection."
			},
			{
				id: "at10",
				prompt: "Which organ system moves oxygen from the air into the blood?",
				choices: [
					"Respiratory",
					"Skeletal",
					"Only the biceps",
					"Digestive"
				],
				answer: 0,
				why: "The respiratory system is the airway and lungs. Digestion handles food."
			}
		],
		cards: [
			{
				id: "ac1",
				front: "Smallest living unit of the body",
				back: "Cell"
			},
			{
				id: "ac2",
				front: "Bone that protects the brain",
				back: "Skull"
			},
			{
				id: "ac3",
				front: "Bone of the thigh",
				back: "Femur"
			},
			{
				id: "ac4",
				front: "Muscle that bends the elbow",
				back: "Biceps"
			},
			{
				id: "ac5",
				front: "Muscle that straightens the elbow",
				back: "Triceps"
			},
			{
				id: "ac6",
				front: "Muscle that straightens the knee",
				back: "Quadriceps"
			},
			{
				id: "ac7",
				front: "Vessels that carry blood away from the heart",
				back: "Arteries"
			},
			{
				id: "ac8",
				front: "Air sacs where oxygen enters the blood",
				back: "Alveoli"
			},
			{
				id: "ac9",
				front: "Muscle under the lungs used in breathing",
				back: "Diaphragm"
			},
			{
				id: "ac10",
				front: "Where most nutrients are absorbed",
				back: "Small intestine"
			},
			{
				id: "ac11",
				front: "Organ that makes bile",
				back: "Liver"
			},
			{
				id: "ac12",
				front: "Proteins that match a specific germ",
				back: "Antibodies"
			}
		]
	},
	chemistry: {
		id: "chemistry",
		name: "Chemistry",
		blurb: "Atoms, the periodic table, moles, and stoichiometry — grams to moles to grams.",
		note: "Atomic masses used here: H 1.01, C 12.01, N 14.01, O 16.00, Na 22.99, Al 26.98, S 32.06, Cl 35.45, Ca 40.08, Fe 55.85, Se 78.96. Avogadro’s number is 6.022 × 10²³.",
		reading: [{
			label: "Chem4Kids (no school login)",
			href: "https://www.chem4kids.com/"
		}],
		lessons: [
			{
				id: "ch-atoms",
				title: "Atoms, elements, and molecules",
				paragraphs: ["An element is a pure substance made of one kind of atom. An atom is the smallest particle that is still that element.", "A molecule is two or more atoms bonded together. A compound is a molecule made of more than one element. O₂ is a molecule of one element, so it is not a compound. H₂O is both a molecule and a compound."],
				practice: {
					kind: "choice",
					prompt: "Which substance is a compound?",
					choices: [
						"O₂",
						"Fe (iron metal)",
						"H₂O",
						"He"
					],
					answer: 2,
					why: "H₂O has hydrogen and oxygen. O₂, Fe, and He are each only one element."
				}
			},
			{
				id: "ch-table",
				title: "Reading the periodic table",
				paragraphs: ["Each box is one element. The atomic number is the number of protons. That number decides which element it is.", "The symbol is the short name (Na, Cl, O). The atomic mass is the number you use, in grams, for one mole of atoms of that element. You do not add atomic numbers to get molar mass. You add atomic masses."],
				practice: {
					kind: "choice",
					prompt: "The atomic number tells you…",
					choices: [
						"How many protons the atom has",
						"The mass of one mole of a compound",
						"How many molecules are in 25 g",
						"The coefficients of a reaction"
					],
					answer: 0,
					why: "Atomic number = protons. Atomic mass is what you add for molar mass."
				}
			},
			{
				id: "ch-molar",
				title: "Molar mass",
				paragraphs: ["Molar mass (M) is the mass of one mole, in g/mol. Multiply each element’s atomic mass by its subscript, then add.", "Parentheses count for everything inside. Mg(OH)₂ has one Mg, two O, and two H."],
				exampleNote: "This example uses H₂SO₄. The practice problem is a different formula.",
				steps: [
					{
						step: "1. Read the formula",
						work: "H₂SO₄",
						result: "2 H, 1 S, 4 O"
					},
					{
						step: "2. Look up masses",
						work: "H 1.01, S 32.06, O 16.00",
						result: "From the table"
					},
					{
						step: "3. Multiply by subscripts",
						work: "2(1.01) + 32.06 + 4(16.00)",
						result: "2.02 + 32.06 + 64.00"
					},
					{
						step: "4. Add",
						work: "2.02 + 32.06 + 64.00",
						result: "98.08 g/mol"
					}
				],
				practice: {
					kind: "number",
					prompt: "What is the molar mass of CO₂? Carbon is 12.01 and oxygen is 16.00. There are two oxygens, not one.",
					unit: "g/mol",
					answer: 44.01,
					why: "12.01 + 2(16.00) = 12.01 + 32.00 = 44.01 g/mol. A number near 110 belongs to something like SeO₂, not CO₂."
				}
			},
			{
				id: "ch-mole",
				title: "The mole",
				paragraphs: ["A mole is a counting unit. One mole is 6.022 × 10²³ particles. That is Avogadro’s number.", "Use it only when the question asks for molecules or atoms. Do not use it as the mole ratio in a chemical equation."],
				exampleNote: "Example: 2.00 mol of any substance. The practice amount is different.",
				steps: [{
					step: "Given",
					work: "n = 2.00 mol",
					result: "Mole count"
				}, {
					step: "Multiply",
					work: "2.00 × 6.022 × 10²³",
					result: "1.204 × 10²⁴ particles"
				}],
				practice: {
					kind: "choice",
					prompt: "How many particles are in 0.500 mol?",
					choices: [
						"3.011 × 10²³",
						"6.022 × 10²³",
						"1.204 × 10²⁴",
						"0.500"
					],
					answer: 0,
					why: "0.500 × 6.022 × 10²³ = 3.011 × 10²³. Half a mole is half of Avogadro’s number."
				}
			},
			{
				id: "ch-convert",
				title: "Mass, moles, and back",
				paragraphs: ["Two equations connect the scale and the mole count. n = m ÷ M turns grams into moles. m = n × M turns moles into grams.", "Always use the molar mass of the substance in the question, not a different compound."],
				exampleNote: "Example: 36.0 g of water. Water’s molar mass is 18.02 g/mol. The practice problem uses a different substance.",
				steps: [{
					step: "Find M",
					work: "H₂O = 2(1.01) + 16.00",
					result: "18.02 g/mol"
				}, {
					step: "Grams to moles",
					work: "n = 36.0 ÷ 18.02",
					result: "2.00 mol"
				}],
				practice: {
					kind: "number",
					prompt: "How many grams are in 2.50 mol of NaCl? Na is 22.99 and Cl is 35.45.",
					unit: "g",
					answer: 146.1,
					why: "M = 22.99 + 35.45 = 58.44 g/mol. m = 2.50 × 58.44 = 146 g (146.1 before rounding)."
				}
			},
			{
				id: "ch-ratio",
				title: "Mole ratios from a balanced equation",
				paragraphs: ["The big numbers in front of formulas are coefficients. They are a mole ratio, not a gram ratio.", "For 2H₂ + O₂ → 2H₂O, two moles of hydrogen react with one mole of oxygen to make two moles of water. Convert to moles before you use that ratio."],
				practice: {
					kind: "choice",
					prompt: "In 2H₂ + O₂ → 2H₂O, how many moles of O₂ react with 4 mol of H₂?",
					choices: [
						"1 mol",
						"2 mol",
						"4 mol",
						"8 mol"
					],
					answer: 1,
					why: "The ratio O₂ : H₂ is 1 : 2. Half of 4 mol is 2 mol of O₂."
				}
			},
			{
				id: "ch-stoich",
				title: "Stoichiometry: mass to mass",
				paragraphs: ["Path for every mass-to-mass problem: grams of the known substance → moles of the known → moles of the unknown → grams of the unknown.", "The unknown has its own molar mass. Do not reuse the known substance’s molar mass in the last step."],
				exampleNote: "Example uses 4.04 g of H₂ making water. The practice problem asks for oxygen and uses a different mass.",
				steps: [
					{
						step: "1. Moles of known",
						work: "4.04 g H₂ ÷ 2.02 g/mol",
						result: "2.00 mol H₂"
					},
					{
						step: "2. Mole ratio",
						work: "H₂O : H₂ = 2 : 2 = 1 : 1",
						result: "2.00 mol H₂O"
					},
					{
						step: "3. Grams of unknown",
						work: "2.00 mol × 18.02 g/mol",
						result: "36.0 g H₂O"
					}
				],
				practice: {
					kind: "number",
					prompt: "How many grams of O₂ are needed to react with 8.08 g of H₂? Equation: 2H₂ + O₂ → 2H₂O. M(H₂) = 2.02 g/mol. M(O₂) = 32.00 g/mol.",
					unit: "g",
					answer: 64,
					why: "8.08 ÷ 2.02 = 4.00 mol H₂. Ratio O₂:H₂ is 1:2, so 2.00 mol O₂. 2.00 × 32.00 = 64.0 g O₂."
				}
			}
		],
		test: [
			{
				id: "ct1",
				prompt: "Which is only one element?",
				choices: [
					"CO₂",
					"NaCl",
					"O₂",
					"H₂SO₄"
				],
				answer: 2,
				why: "O₂ is two oxygen atoms. The others contain more than one element."
			},
			{
				id: "ct2",
				prompt: "Molar mass of H₂O is about…",
				choices: [
					"18.02 g/mol",
					"16.00 g/mol",
					"2.02 g/mol",
					"44.01 g/mol"
				],
				answer: 0,
				why: "2(1.01) + 16.00 = 18.02. 44.01 is CO₂."
			},
			{
				id: "ct3",
				prompt: "Molar mass of NaCl is about…",
				choices: [
					"22.99 g/mol",
					"35.45 g/mol",
					"58.44 g/mol",
					"110.96 g/mol"
				],
				answer: 2,
				why: "22.99 + 35.45 = 58.44."
			},
			{
				id: "ct4",
				prompt: "How many moles are in 88.0 g of CO₂? M = 44.01 g/mol.",
				choices: [
					"0.500 mol",
					"2.00 mol",
					"44.0 mol",
					"88.0 mol"
				],
				answer: 1,
				why: "n = 88.0 ÷ 44.01 = 2.00 mol."
			},
			{
				id: "ct5",
				prompt: "25.0 g of SeO₂ is about how many moles? M = 110.96 g/mol.",
				choices: [
					"0.225 mol",
					"2.25 mol",
					"110.96 mol",
					"25.0 mol"
				],
				answer: 0,
				why: "n = 25.0 ÷ 110.96 = 0.225 mol."
			},
			{
				id: "ct6",
				prompt: "Particles in 1.00 mol equal…",
				choices: [
					"6.022 × 10²³",
					"6.022 × 10²",
					"1.00 × 10³",
					"22.4"
				],
				answer: 0,
				why: "That is Avogadro’s number."
			},
			{
				id: "ct7",
				prompt: "In N₂ + 3H₂ → 2NH₃, the mole ratio of NH₃ to N₂ is…",
				choices: [
					"1 : 1",
					"2 : 1",
					"3 : 1",
					"1 : 3"
				],
				answer: 1,
				why: "Coefficients are 2 NH₃ and 1 N₂."
			},
			{
				id: "ct8",
				prompt: "You must convert grams to moles before using a mole ratio because…",
				choices: [
					"Coefficients compare moles, not grams",
					"Grams and moles are the same unit",
					"Atomic number is the molar mass",
					"Avogadro’s number is a gram ratio"
				],
				answer: 0,
				why: "The balanced equation talks in moles. Grams have to be converted first."
			},
			{
				id: "ct9",
				prompt: "4.00 mol of H₂ react in 2H₂ + O₂ → 2H₂O. How many moles of O₂ are needed?",
				choices: [
					"1.00 mol",
					"2.00 mol",
					"4.00 mol",
					"8.00 mol"
				],
				answer: 1,
				why: "O₂ : H₂ = 1 : 2, so 4.00 × 1/2 = 2.00 mol O₂."
			},
			{
				id: "ct10",
				prompt: "50.0 g of CaCO₃ decompose: CaCO₃ → CaO + CO₂. M(CaCO₃) = 100.09, M(CO₂) = 44.01. Grams of CO₂?",
				choices: [
					"11.0 g",
					"22.0 g",
					"44.0 g",
					"50.0 g"
				],
				answer: 1,
				why: "50.0 ÷ 100.09 = 0.500 mol. Ratio is 1:1, so 0.500 × 44.01 = 22.0 g."
			}
		],
		cards: [
			{
				id: "cc1",
				front: "n = ?",
				back: "n = m ÷ M (grams to moles)"
			},
			{
				id: "cc2",
				front: "m = ?",
				back: "m = n × M (moles to grams)"
			},
			{
				id: "cc3",
				front: "Particles in 1 mole",
				back: "6.022 × 10²³"
			},
			{
				id: "cc4",
				front: "Molar mass of CO₂",
				back: "44.01 g/mol"
			},
			{
				id: "cc5",
				front: "Molar mass of H₂O",
				back: "18.02 g/mol"
			},
			{
				id: "cc6",
				front: "Molar mass of NaCl",
				back: "58.44 g/mol"
			},
			{
				id: "cc7",
				front: "Molar mass of O₂",
				back: "32.00 g/mol"
			},
			{
				id: "cc8",
				front: "What a coefficient counts",
				back: "Moles, not grams"
			},
			{
				id: "cc9",
				front: "Stoichiometry path",
				back: "Grams → moles → mole ratio → grams"
			},
			{
				id: "cc10",
				front: "Atomic number means",
				back: "Number of protons"
			},
			{
				id: "cc11",
				front: "A compound is",
				back: "A substance with more than one element"
			},
			{
				id: "cc12",
				front: "SeO₂ molar mass",
				back: "78.96 + 32.00 = 110.96 g/mol"
			}
		]
	},
	physics: {
		id: "physics",
		name: "Physics",
		blurb: "Speed, acceleration, forces, energy, and simple machines.",
		note: "Use g = 9.8 m/s² when you need gravity. SI units: meters, seconds, kilograms, newtons, joules.",
		reading: [{
			label: "The Physics Classroom (no school login)",
			href: "https://www.physicsclassroom.com/class"
		}],
		lessons: [
			{
				id: "ph-speed",
				title: "Speed and velocity",
				paragraphs: ["Speed is how fast something moves: distance divided by time. A common unit is meters per second (m/s).", "Velocity is speed with a direction. 5 m/s north is a velocity. 5 m/s alone is a speed."],
				exampleNote: "Example: 100 m in 20 s. The practice distance and time are different.",
				steps: [{
					step: "Formula",
					work: "speed = distance ÷ time",
					result: "v = d / t"
				}, {
					step: "Plug in",
					work: "100 m ÷ 20 s",
					result: "5 m/s"
				}],
				practice: {
					kind: "number",
					prompt: "A runner covers 150 m in 10 s. What is the speed?",
					unit: "m/s",
					answer: 15,
					why: "150 ÷ 10 = 15 m/s."
				}
			},
			{
				id: "ph-accel",
				title: "Acceleration",
				paragraphs: ["Acceleration is how fast velocity changes. a = change in velocity ÷ time.", "Speeding up, slowing down, and turning are all acceleration, because velocity changes."],
				exampleNote: "Example: from 0 to 20 m/s in 4 s. Practice uses different numbers.",
				steps: [{
					step: "Change in velocity",
					work: "20 − 0",
					result: "20 m/s"
				}, {
					step: "Divide by time",
					work: "20 ÷ 4",
					result: "5 m/s²"
				}],
				practice: {
					kind: "number",
					prompt: "A bike goes from 0 to 30 m/s in 5 s. What is the acceleration?",
					unit: "m/s²",
					answer: 6,
					why: "(30 − 0) ÷ 5 = 6 m/s²."
				}
			},
			{
				id: "ph-newton",
				title: "Newton’s three laws",
				paragraphs: [
					"First law: an object keeps its motion unless a net force acts on it. No net force means no change in velocity.",
					"Second law: net force equals mass times acceleration. F = ma. Force is in newtons when mass is in kilograms and acceleration is in m/s².",
					"Third law: forces come in pairs. If you push on a wall, the wall pushes back on you with the same strength in the opposite direction."
				],
				exampleNote: "Example: a 2 kg box accelerates at 3 m/s². Practice uses a different mass and acceleration.",
				steps: [{
					step: "Formula",
					work: "F = ma",
					result: "newtons"
				}, {
					step: "Plug in",
					work: "2 kg × 3 m/s²",
					result: "6 N"
				}],
				practice: {
					kind: "number",
					prompt: "What net force gives a 4 kg wagon an acceleration of 2.5 m/s²?",
					unit: "N",
					answer: 10,
					why: "F = 4 × 2.5 = 10 N."
				}
			},
			{
				id: "ph-energy",
				title: "Work and energy",
				paragraphs: ["Work is force times distance in the direction of the force. W = Fd. The unit is the joule.", "Kinetic energy is energy of motion: KE = ½mv². Gravitational potential energy is energy of height: PE = mgh, with g = 9.8 m/s²."],
				exampleNote: "Work example: 10 N pushed through 3 m is 30 J. The practice force and distance are different. Kinetic energy example: 2 kg at 3 m/s is 9 J, because ½ × 2 × 9 = 9.",
				steps: [{
					step: "Work",
					work: "W = 10 N × 3 m",
					result: "30 J"
				}, {
					step: "Kinetic energy",
					work: "KE = ½ × 2 kg × (3 m/s)²",
					result: "9 J"
				}],
				practice: {
					kind: "number",
					prompt: "A 20 N force pushes a box 4 m in the direction of the force. How much work is done?",
					unit: "J",
					answer: 80,
					why: "W = 20 × 4 = 80 J. This is work, not kinetic energy."
				}
			},
			{
				id: "ph-machines",
				title: "Simple machines",
				paragraphs: ["A simple machine changes the size or direction of a force. It does not create energy.", "The six classic machines are the lever, pulley, wheel and axle, inclined plane, wedge, and screw. With no friction, the work you put in equals the work you get out. A smaller force just acts through a longer distance."],
				practice: {
					kind: "choice",
					prompt: "An ideal simple machine (no friction)…",
					choices: [
						"Trades force for distance but does not create energy",
						"Makes energy from nothing",
						"Removes the need for a force",
						"Changes mass into meters"
					],
					answer: 0,
					why: "Work in equals work out when friction is ignored. The machine changes force or direction."
				}
			}
		],
		test: [
			{
				id: "pt1",
				prompt: "Speed equals…",
				choices: [
					"Distance ÷ time",
					"Mass × acceleration",
					"½mv²",
					"Force × time"
				],
				answer: 0,
				why: "v = d / t."
			},
			{
				id: "pt2",
				prompt: "A cart rolls 40 m in 8 s. Its speed is…",
				choices: [
					"5 m/s",
					"32 m/s",
					"48 m/s",
					"0.2 m/s"
				],
				answer: 0,
				why: "40 ÷ 8 = 5 m/s."
			},
			{
				id: "pt3",
				prompt: "Velocity is different from speed because velocity…",
				choices: [
					"Includes direction",
					"Is always larger",
					"Has no units",
					"Is a force"
				],
				answer: 0,
				why: "Velocity is speed plus direction."
			},
			{
				id: "pt4",
				prompt: "From rest to 12 m/s in 3 s, acceleration is…",
				choices: [
					"4 m/s²",
					"36 m/s²",
					"15 m/s²",
					"9 m/s²"
				],
				answer: 0,
				why: "12 ÷ 3 = 4 m/s²."
			},
			{
				id: "pt5",
				prompt: "Newton’s second law is…",
				choices: [
					"F = ma",
					"v = d/t",
					"PE = mgh",
					"W = Fd"
				],
				answer: 0,
				why: "Net force equals mass times acceleration."
			},
			{
				id: "pt6",
				prompt: "A 3 kg object accelerates at 4 m/s². The net force is…",
				choices: [
					"12 N",
					"0.75 N",
					"7 N",
					"1.33 N"
				],
				answer: 0,
				why: "3 × 4 = 12 N."
			},
			{
				id: "pt7",
				prompt: "Newton’s third law says…",
				choices: [
					"Forces come in equal and opposite pairs",
					"Heavier objects always fall faster with no air",
					"Energy can be created in a lever",
					"Speed equals mass"
				],
				answer: 0,
				why: "Every force has a partner of the same size in the opposite direction."
			},
			{
				id: "pt8",
				prompt: "KE for 2 kg moving at 4 m/s is…",
				choices: [
					"16 J",
					"8 J",
					"32 J",
					"4 J"
				],
				answer: 0,
				why: "½ × 2 × 16 = 16 J."
			},
			{
				id: "pt9",
				prompt: "PE for 2 kg lifted 5 m (g = 9.8) is…",
				choices: [
					"98 J",
					"10 J",
					"19.6 J",
					"49 J"
				],
				answer: 0,
				why: "2 × 9.8 × 5 = 98 J."
			},
			{
				id: "pt10",
				prompt: "Which is a simple machine?",
				choices: [
					"Lever",
					"Newton",
					"Joule",
					"Meter"
				],
				answer: 0,
				why: "Lever, pulley, wheel and axle, inclined plane, wedge, and screw are the six simple machines."
			}
		],
		cards: [
			{
				id: "pc1",
				front: "Speed formula",
				back: "v = d / t"
			},
			{
				id: "pc2",
				front: "Acceleration formula",
				back: "a = change in velocity / time"
			},
			{
				id: "pc3",
				front: "Newton’s second law",
				back: "F = ma"
			},
			{
				id: "pc4",
				front: "Unit of force",
				back: "Newton (N)"
			},
			{
				id: "pc5",
				front: "Work formula",
				back: "W = Fd"
			},
			{
				id: "pc6",
				front: "Kinetic energy",
				back: "KE = ½mv²"
			},
			{
				id: "pc7",
				front: "Potential energy",
				back: "PE = mgh"
			},
			{
				id: "pc8",
				front: "g near Earth",
				back: "9.8 m/s²"
			},
			{
				id: "pc9",
				front: "Newton’s first law",
				back: "Motion stays the same unless a net force acts"
			},
			{
				id: "pc10",
				front: "Six simple machines include",
				back: "Lever, pulley, wheel and axle, inclined plane, wedge, screw"
			}
		]
	},
	english: {
		id: "english",
		name: "English",
		blurb: "Parts of speech, complete sentences, agreement, punctuation, and tricky word pairs.",
		reading: [{
			label: "GrammarBook (no school login)",
			href: "https://www.grammarbook.com/"
		}],
		lessons: [
			{
				id: "en-pos",
				title: "Parts of speech",
				paragraphs: ["A noun names a person, place, thing, or idea. A verb shows action or a state of being. An adjective describes a noun. An adverb often describes a verb and frequently ends in -ly.", "A pronoun stands in for a noun (she, they, it). A preposition shows a relationship such as in, on, under, or after. A conjunction joins words or groups (and, but, or)."],
				practice: {
					kind: "choice",
					prompt: "In “The quick fox ran silently,” what is “silently”?",
					choices: [
						"Noun",
						"Verb",
						"Adjective",
						"Adverb"
					],
					answer: 3,
					why: "Silently tells how the fox ran, so it describes the verb. Quick describes fox, so quick is an adjective."
				}
			},
			{
				id: "en-sent",
				title: "Sentences and fragments",
				paragraphs: ["A complete sentence has a subject and a verb and expresses a complete thought.", "A fragment is missing one of those pieces. “Running down the hill.” has no subject. “The red bicycle.” has no verb. Both are fragments."],
				practice: {
					kind: "choice",
					prompt: "Which is a complete sentence?",
					choices: [
						"After the long hike.",
						"The lantern glowed.",
						"Running across the field.",
						"Because the gate was shut."
					],
					answer: 1,
					why: "“The lantern glowed” has a subject (lantern) and a verb (glowed). The others leave the thought unfinished or have no subject."
				}
			},
			{
				id: "en-agree",
				title: "Subject-verb agreement",
				paragraphs: ["A singular subject takes a singular verb. A plural subject takes a plural verb. “The dog runs.” “The dogs run.”", "Match the verb to the real subject, not to a noun in a phrase beside it. In “The box of pencils is full,” the subject is box, not pencils."],
				practice: {
					kind: "choice",
					prompt: "Choose the correct sentence.",
					choices: [
						"The stack of books are tall.",
						"The stack of books is tall.",
						"The stack of books be tall.",
						"The stack of books were tall."
					],
					answer: 1,
					why: "The subject is stack, which is singular, so the verb is is."
				}
			},
			{
				id: "en-punct",
				title: "Punctuation you use every day",
				paragraphs: [
					"A period ends a statement. A question mark ends a question. An exclamation point shows strong feeling and should be rare in school writing.",
					"Use commas between items in a list: “Bring pencils, paper, and a folder.”",
					"An apostrophe can show a missing letter or possession. It’s means it is. Its means belonging to it. Those two are not interchangeable."
				],
				practice: {
					kind: "choice",
					prompt: "Which sentence uses its / it’s correctly?",
					choices: [
						"The owl turned it’s head.",
						"Its going to rain.",
						"The tree lost its leaves.",
						"Its’ a long walk."
					],
					answer: 2,
					why: "Its shows belonging: the leaves belong to the tree. It’s would mean “it is.”"
				}
			},
			{
				id: "en-words",
				title: "Words that get mixed up",
				paragraphs: [
					"There is a place or a starter (“There is a book”). Their shows belonging to them. They’re means they are.",
					"Your shows belonging. You’re means you are. To is a direction or part of a verb. Too means also or overly. Two is the number.",
					"Than compares. Then tells time or order."
				],
				practice: {
					kind: "choice",
					prompt: "Choose the correct sentence.",
					choices: [
						"Their going to the library.",
						"They’re going to the library.",
						"There going to the library.",
						"Theyre going to the library."
					],
					answer: 1,
					why: "They’re = they are. Their would show belonging. There would point to a place."
				}
			}
		],
		test: [
			{
				id: "et1",
				prompt: "In “A small boat drifted,” the word “small” is…",
				choices: [
					"An adjective",
					"A verb",
					"A conjunction",
					"A pronoun"
				],
				answer: 0,
				why: "Small describes the noun boat."
			},
			{
				id: "et2",
				prompt: "Which word is a conjunction?",
				choices: [
					"Under",
					"But",
					"Slowly",
					"River"
				],
				answer: 1,
				why: "But joins ideas. Under is a preposition. Slowly is an adverb. River is a noun."
			},
			{
				id: "et3",
				prompt: "Which is a fragment?",
				choices: [
					"The bell rang once.",
					"When the lights dimmed.",
					"She closed the book.",
					"Birds crossed the yard."
				],
				answer: 1,
				why: "“When the lights dimmed” needs a main clause to finish the thought."
			},
			{
				id: "et4",
				prompt: "The flock of geese ___ overhead.",
				choices: [
					"fly",
					"flies",
					"flying",
					"are fly"
				],
				answer: 1,
				why: "The subject is flock, singular, so the verb is flies."
			},
			{
				id: "et5",
				prompt: "Choose the correct verb.",
				choices: [
					"The dogs in the yard runs.",
					"The dogs in the yard run.",
					"The dogs in the yard running.",
					"The dogs in the yard is run."
				],
				answer: 1,
				why: "Dogs is plural, so the verb is run, not runs."
			},
			{
				id: "et6",
				prompt: "Which list is punctuated correctly?",
				choices: [
					"We packed maps, water, and coats.",
					"We packed maps water and coats.",
					"We packed, maps water and, coats.",
					"We packed maps water, and coats."
				],
				answer: 0,
				why: "Commas separate the three items in the list."
			},
			{
				id: "et7",
				prompt: "Choose the correct word.",
				choices: [
					"The cabin lost it’s roof.",
					"The cabin lost its roof.",
					"The cabin lost its’ roof.",
					"The cabin lost it roof."
				],
				answer: 1,
				why: "Its shows belonging. It’s means it is."
			},
			{
				id: "et8",
				prompt: "“___ books are on the table.” The books belong to those students.",
				choices: [
					"There",
					"Their",
					"They’re",
					"Theyre"
				],
				answer: 1,
				why: "Their shows belonging."
			},
			{
				id: "et9",
				prompt: "This soup is ___ hot to eat.",
				choices: [
					"to",
					"too",
					"two",
					"tu"
				],
				answer: 1,
				why: "Too means overly. Two is the number. To is a direction word."
			},
			{
				id: "et10",
				prompt: "She is taller ___ her brother.",
				choices: [
					"then",
					"than",
					"their",
					"there"
				],
				answer: 1,
				why: "Than compares. Then is for time."
			}
		],
		cards: [
			{
				id: "ec1",
				front: "Noun",
				back: "Names a person, place, thing, or idea"
			},
			{
				id: "ec2",
				front: "Adjective",
				back: "Describes a noun"
			},
			{
				id: "ec3",
				front: "Adverb",
				back: "Often describes a verb (how, when, where)"
			},
			{
				id: "ec4",
				front: "A complete sentence needs",
				back: "A subject, a verb, and a complete thought"
			},
			{
				id: "ec5",
				front: "It’s means",
				back: "It is"
			},
			{
				id: "ec6",
				front: "Its means",
				back: "Belonging to it"
			},
			{
				id: "ec7",
				front: "They’re means",
				back: "They are"
			},
			{
				id: "ec8",
				front: "Their means",
				back: "Belonging to them"
			},
			{
				id: "ec9",
				front: "Too means",
				back: "Also, or overly"
			},
			{
				id: "ec10",
				front: "Than vs then",
				back: "Than compares. Then is time or order."
			}
		]
	}
};
function isSubjectId(value) {
	return value === "anatomy" || value === "chemistry" || value === "physics" || value === "english";
}
function parseAnswer(raw) {
	const trimmed = raw.trim().toLowerCase().replace(/\s+/g, "").replace(/×/g, "x");
	const sci = trimmed.match(/^([+-]?\d*\.?\d+)x10\^?([+-]?\d+)$/);
	if (sci) return Number(sci[1]) * 10 ** Number(sci[2]);
	return Number(trimmed);
}
function closeEnough(got, target) {
	if (!Number.isFinite(got) || !Number.isFinite(target)) return false;
	if (Math.abs(target) >= 1e6) {
		const ratio = got / target;
		return ratio > .97 && ratio < 1.03;
	}
	const tol = Math.max(Math.abs(target) * .02, .05);
	return Math.abs(got - target) <= tol;
}
var $$splitComponentImporter$4 = () => import("./subject._subject-DToixqlR.mjs");
var Route$4 = createFileRoute("/subject/$subject")({
	beforeLoad: ({ params }) => {
		if (!isSubjectId(params.subject)) throw new Error("Unknown subject");
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./subject._subject.index-DyqE9zRb.mjs");
var Route$3 = createFileRoute("/subject/$subject/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./subject._subject.memorize-CftHWZSo.mjs");
var Route$2 = createFileRoute("/subject/$subject/memorize")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./subject._subject.study-C_qL91vH.mjs");
var Route$1 = createFileRoute("/subject/$subject/study")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./subject._subject.test-CuYdBkx-.mjs");
var Route = createFileRoute("/subject/$subject/test")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var IndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$6
});
var SubjectSubjectRoute = Route$4.update({
	id: "/subject/$subject",
	path: "/subject/$subject",
	getParentRoute: () => Route$6
});
var SubjectSubjectIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => SubjectSubjectRoute
});
var SubjectSubjectRouteChildren = {
	SubjectSubjectMemorizeRoute: Route$2.update({
		id: "/memorize",
		path: "/memorize",
		getParentRoute: () => SubjectSubjectRoute
	}),
	SubjectSubjectStudyRoute: Route$1.update({
		id: "/study",
		path: "/study",
		getParentRoute: () => SubjectSubjectRoute
	}),
	SubjectSubjectTestRoute: Route.update({
		id: "/test",
		path: "/test",
		getParentRoute: () => SubjectSubjectRoute
	}),
	SubjectSubjectIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	SubjectSubjectRoute: SubjectSubjectRoute._addFileChildren(SubjectSubjectRouteChildren)
};
var routeTree = Route$6._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
export { Route$3 as a, closeEnough as c, useProgress as d, Route$2 as i, isSubjectId as l, Route as n, SUBJECTS as o, Route$1 as r, SUBJECT_ORDER as s, router_exports as t, parseAnswer as u };
