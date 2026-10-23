import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, r as number, t as array } from "../_libs/zod.mjs";
// node_modules/.nitro/vite/services/ssr/assets/study-data-B0tJZ7xq.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
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
var getStudyData_createServerFn_handler = createServerRpc({
	id: "d3fa4e55edbcda9d3d3df633d0be13dca78ace219023919ee83060e032724af5",
	name: "getStudyData",
	filename: "src/lib/study-data.ts"
}, (opts) => getStudyData.__executeServer(opts));
var getStudyData = createServerFn({ method: "GET" }).handler(getStudyData_createServerFn_handler, async () => {
	const [{ getSql, dbSource }, { assertSameSiteRequest }] = await Promise.all([import("./db-1FgOOJkf.mjs"), import("./isolation.server-DBMXBb5V.mjs")]);
	assertSameSiteRequest();
	const row = (await (await getSql()).query("select progress, spelling_words, updated_at::text as updated_at from study_bench_data where id = 'single-user'"))[0];
	return {
		source: dbSource,
		data: row ? studyDataSchema.parse({
			progress: row.progress,
			spellingWords: row.spelling_words
		}) : null,
		updatedAt: row?.updated_at ?? null
	};
});
var saveStudyData_createServerFn_handler = createServerRpc({
	id: "b81aa4cd5eeea8d0f147ce800b60917787ce49994083bfc011a7991b42ced7ec",
	name: "saveStudyData",
	filename: "src/lib/study-data.ts"
}, (opts) => saveStudyData.__executeServer(opts));
var saveStudyData = createServerFn({ method: "POST" }).validator((input) => studyDataSchema.parse(input)).handler(saveStudyData_createServerFn_handler, async ({ data }) => {
	const [{ getSql, dbSource }, { assertSameSiteRequest }] = await Promise.all([import("./db-1FgOOJkf.mjs"), import("./isolation.server-DBMXBb5V.mjs")]);
	assertSameSiteRequest();
	const row = (await (await getSql()).query("insert into study_bench_data (id, progress, spelling_words) values ('single-user', $1::jsonb, $2::jsonb) on conflict (id) do update set progress = excluded.progress, spelling_words = excluded.spelling_words, updated_at = now() returning updated_at::text as updated_at", [JSON.stringify(data.progress), JSON.stringify(data.spellingWords)]))[0];
	if (!row) throw new Error("Database did not return the saved study data.");
	return {
		source: dbSource,
		updatedAt: row.updated_at
	};
});
export { getStudyData_createServerFn_handler, saveStudyData_createServerFn_handler };
