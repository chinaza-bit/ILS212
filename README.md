# ILS212 Test/Quiz for Covenant Generals

A self-test quiz app for FUTO's **ILS 212: Information Literacy Skills** course, styled as a library card catalog. Built with plain HTML, CSS, and JavaScript — no frameworks, no build step.

## Features

- Two switchable question banks, chosen on the setup screen:
  - **Practice Bank** — 200 multiple-choice questions covering all five course modules (Information Literacy & Access, Library and User Education, Search Strategies & Study Skills, Tools for Accessing Information, Ethical Issues & Trends)
  - **Past Questions** — 20 multiple-choice questions built from an actual FUTO ILS 212 Continuous Assessment Test paper
- Choose how many questions to draw before starting (options adjust to the size of the selected bank)
- Questions and answer order are shuffled each session
- Instant feedback after each answer, showing the correct option
- Live running score and progress bar
- Final results screen with percentage, a rating, and a full answer review

## Files

- `index.html` — page structure
- `style.css` — all styling
- `script.js` — quiz logic (bank switching, setup, scoring, results)
- `questions.js` — the 200-question Practice Bank
- `pastQuestions.js` — the 20-question Past Questions (CA Test) bank

## Running it

No build tools needed. Just open `index.html` in a browser, or serve the folder with any static file server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying with GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set the source to **Deploy from a branch**, pick `main` and `/ (root)`.
4. Save — GitHub will publish the site at `https://<username>.github.io/<repo-name>/`.

## Editing the question banks

Each question in `questions.js` and `pastQuestions.js` follows this shape:

```js
{ m: "Module 1", q: "Question text?", options: ["A", "B", "C", "D"], correct: 0 }
```

`correct` is the zero-based index of the right option. Add, remove, or edit entries freely — the app reads directly from these arrays. To add a new bank entirely (e.g. another past paper), create a new `.js` file exporting a `const` array in the same shape, add a `<script>` tag for it in `index.html`, and register it in the `BANKS` object at the top of `script.js`.
