# Study Bench enhancements

The homepage now includes a Personal Learning Desk with:
- A custom spelling test: add words, choose how long each word appears, type after it hides, and review your score.
- A study timer that transparently gives 1.5 times the planned minutes (20 planned minutes = 30 timer minutes).
- A book-first workflow for the SW Learning Library Science Book, Volume 3, with an “I can’t find it” fallback study framework.
- Read-aloud controls using the browser/operating system's built-in speech synthesis voice.
- A copyable personalized tutor prompt for use with an AI assistant. This project does not have a live AI model connection, so it does not pretend to generate AI lessons inside the app.

Study progress and custom spelling words are stored in the single-user `study_bench_data` PostgreSQL row. Existing browser-saved progress and spelling words are imported the first time the database is empty. `npm run db:migrate` applies the table migration; `npm run build` applies it during deploy. The home page shows whether data is loading, saving, saved to Neon, or could not be saved. To verify a write in the database, run:

```sql
SELECT id, progress, spelling_words, updated_at
FROM study_bench_data
WHERE id = 'single-user';
```

Keep this app private: its study-data endpoints share one record and do not require an account. Speech voice availability and quality depend on the device/browser.
