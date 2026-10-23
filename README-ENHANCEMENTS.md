# Study Bench enhancements

The homepage now includes a Personal Learning Desk with:
- A custom spelling test: add words, choose how long each word appears, type after it hides, and review your score.
- A study timer that transparently gives 1.5 times the planned minutes (20 planned minutes = 30 timer minutes).
- A book-first workflow for the SW Learning Library Science Book, Volume 3, with an “I can’t find it” fallback study framework.
- Read-aloud controls using the browser/operating system's built-in speech synthesis voice.
- A copyable personalized tutor prompt for use with an AI assistant. This project does not have a live AI model connection, so it does not pretend to generate AI lessons inside the app.

Custom spelling words are saved in the browser's localStorage. Speech voice availability and quality depend on the device/browser. The original project dependencies were not installed in this environment, so a full TypeScript/build check could not be completed here.
