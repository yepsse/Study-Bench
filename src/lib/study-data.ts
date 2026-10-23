import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const testRecordSchema = z.object({
  subject: z.string().min(1).max(100),
  score: z.number().int().nonnegative(),
  total: z.number().int().nonnegative(),
  at: z.number().int().nonnegative(),
});

const spellingStatSchema = z.object({
  correct: z.number().int().nonnegative(),
  wrong: z.number().int().nonnegative(),
});

export const studyProgressSchema = z.object({
  lessons: z.array(z.string().min(1).max(200)).max(1000),
  known: z.array(z.string().min(1).max(200)).max(1000),
  tests: z.array(testRecordSchema).max(24),
  words: z.array(z.string().max(500)).max(1000).optional(),
  spellStats: z.record(z.string(), spellingStatSchema).optional(),
  daily: z.object({
    date: z.string(),
    n: z.number().int().nonnegative(),
  }).optional(),
  focusBlocks: z.number().int().nonnegative().optional(),
});

export const spellingWordSchema = z.object({
  id: z.string().min(1).max(200),
  word: z.string().min(1).max(500),
});

export const spellingWordsSchema = z.array(spellingWordSchema).max(1000);

export const studyDataSchema = z.object({
  progress: studyProgressSchema,
  spellingWords: spellingWordsSchema,
});

export type TestRecord = z.infer<typeof testRecordSchema>;
export type ProgressState = z.infer<typeof studyProgressSchema>;
export type SpellingWord = z.infer<typeof spellingWordSchema>;
export type StudyData = z.infer<typeof studyDataSchema>;

export const emptyStudyData: StudyData = {
  progress: { lessons: [], known: [], tests: [] },
  spellingWords: [],
};

export const getStudyData = createServerFn({ method: "GET" }).handler(async () => {
  const [{ getSql, dbSource }, { assertSameSiteRequest }] = await Promise.all([
    import("./db"),
    import("./auth/isolation.server"),
  ]);
  assertSameSiteRequest();
  const sql = await getSql();
  const rows = await sql.query<{
    progress: unknown;
    spelling_words: unknown;
    updated_at: string;
  }>(
    "select progress, spelling_words, updated_at::text as updated_at " +
      "from study_bench_data where id = 'single-user'",
  );
  const row = rows[0];
  return {
    source: dbSource,
    data: row
      ? studyDataSchema.parse({
          progress: row.progress,
          spellingWords: row.spelling_words,
        })
      : null,
    updatedAt: row?.updated_at ?? null,
  };
});

export const saveStudyData = createServerFn({ method: "POST" })
  .validator((input: unknown) => studyDataSchema.parse(input))
  .handler(async ({ data }) => {
    const [{ getSql, dbSource }, { assertSameSiteRequest }] = await Promise.all([
      import("./db"),
      import("./auth/isolation.server"),
    ]);
    assertSameSiteRequest();
    const sql = await getSql();
    const rows = await sql.query<{ updated_at: string }>(
      "insert into study_bench_data (id, progress, spelling_words) " +
        "values ('single-user', $1::jsonb, $2::jsonb) " +
        "on conflict (id) do update set " +
        "progress = excluded.progress, " +
        "spelling_words = excluded.spelling_words, " +
        "updated_at = now() " +
        "returning updated_at::text as updated_at",
      [JSON.stringify(data.progress), JSON.stringify(data.spellingWords)],
    );
    const row = rows[0];
    if (!row) throw new Error("Database did not return the saved study data.");
    return { source: dbSource, updatedAt: row.updated_at };
  });
