# ILS212 FOR COVENANT GENERALS

A browser-based practice quiz for **ILS 212 — Information Literacy Skills**, covering all five course modules plus a Past Questions (CAT) section. Built with plain HTML, CSS, and JavaScript — no build step, no dependencies to install.

**Website author:** SamistInTech

## Features

- Choose how many questions to attempt (5–200) and which modules to include
- Questions and options are shuffled on every run
- Live running score while you play
- Results screen with overall score, percentage, and a per-module accuracy breakdown
- Full answer review after finishing, showing your answer vs. the correct one for every question
- Past Questions section (two-option format) drawn from an actual FUTO ILS 212 CAT paper
- All other sections use four options (A–D); answer positions are spread evenly across A–D rather than clustered

## File structure

```
index.html          Markup for the three screens (setup, quiz, results)
style.css            Visual design ("reading room" / library index-card theme)
app.js               Quiz logic: state, scoring, rendering, results
questions.js          Module 1–5 question bank (181 questions)
pastquestions.js       Past Questions / CAT bank (24 questions, two options each)
```

## Source material and citations

### Primary source

All Module 1–5 questions in `questions.js` are drawn from the course handout:

> **FUTO-ILS 212: Information Literacy Skills** (course pack), Federal University of Technology, Owerri.
> Module 1 authors: Dr. Mrs. Opara, G.C.; Dr. Mrs. Chima-James, N.; Dr. Mrs. Emerole, N.; Dr. Mrs. Obiano, D.C.; Dr. Mrs. Osuji, C.; Dr. Mrs. Eden, A.A.; Dr. Mrs. Ndu, M.
> Modules covered: (1) Information Literacy, Needs and Access; (2) Library and User Education; (3) Effective Search Strategies, Techniques and Study Skills; (4) Tools for Accessing Information; (5) Ethical Issues and Trends.

The Past Questions in `pastquestions.js` are adapted from:

> **FUTO ILS 212 Continuous Assessment Test** (past question paper, "Answer any three questions" — 5 essay questions), Federal University of Technology, Owerri. Converted here into objective two-option items, with answers drawn from the course handout above.

### Works cited within the course handout

The handout itself references the following external sources, which indirectly inform some question content:

- Leigh, R. D. (1980) — definition of a public library
- Mutula, S. M. & Ojedokun, A. A. (2008) — features of digital/virtual libraries
- Ogunmodede, T. A. & Emeghara, E. E. (2010) — rationale for library user education
- Cassell, K. A. & Hiremath, U. (2018) — definition of reference services
- Ashikuzzaman, M. (2024) — ethical use of information
- Association of College & Research Libraries (ACRL) — *Framework for Information Literacy for Higher Education*
- World Intellectual Property Organization (WIPO) — definition of intellectual property
- Nigeria's Patents and Designs Act (1970) and Trademarks Act — patent/trademark infringement provisions

These are cited as they appear in the original course material; this project does not independently verify or add to those citations.

### Notes on adaptation

- Question wording and answer options were written independently based on the facts, definitions, and lists in the source handout — no passages are reproduced verbatim.
- The correct-answer position within each set of options was deliberately distributed evenly across A–D (main bank) and A–B (Past Questions) rather than left clustered, in addition to being re-shuffled at random on every quiz attempt.

## Running locally

No build tools required — just open `index.html` in a browser, or serve the folder with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Deploying

Since this is a static site, it can be pushed directly to a GitHub repository and served via GitHub Pages (Settings → Pages → deploy from the `main` branch / root), or hosted on any static host (Netlify, Vercel, etc.).
