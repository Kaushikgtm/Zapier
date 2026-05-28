# Project Report — LaTeX Source

This folder contains the LaTeX source for the B.Tech project report
titled **"Design and Implementation of an Event-Driven Workflow
Automation Platform"**, prepared per the official report-format
guidelines of Saharsa College of Engineering, Bihar Engineering
University, Patna.

## File layout

```
latex/
├── main.tex                          # entry point — title page, certificate, declaration,
│                                     #               copyright, ack, abstract, TOC, lists, abbreviations
├── chapters/
│   ├── introduction.tex              # Chapter 1 — Introduction
│   ├── background.tex                # Chapter 2 — Background & Literature Review
│   ├── problem_definition.tex        # Chapter 3 — Problem Definition
│   ├── proposed_solution.tex         # Chapter 4 — Proposed Solution (architecture & impl)
│   ├── discussion_of_results.tex     # Chapter 5 — Discussion of Results
│   ├── conclusion.tex                # Chapter 6 — Conclusion and Future Work
│   ├── references.tex                # References in IEEE numeric style
│   └── appendices.tex                # Appendix A (env vars) and Appendix B (sample payload trace)
├── figures/                          # place architecture PNGs here
└── README.md                         # this file
```

## Conformance to the official template

The report follows the formatting guidelines specified in the official
`project_report_guidelines.docx`:

| Requirement                  | Setting in `main.tex` |
|------------------------------|-----------------------|
| Font family                  | `helvet` (Arial substitute); for true Arial compile with XeLaTeX and `\setmainfont{Arial}` |
| Body font size               | 12 pt |
| Chapter title                | 14 pt, bold, centred |
| Section / subtitle           | 12 pt, bold, left-justified |
| Line spacing                 | 1.5 |
| Margins                      | left 4.0 cm, right 2.5 cm, top 4.0 cm, bottom 2.5 cm |
| Printing                     | both sides (`twoside`) |
| Reference style              | IEEE numeric |
| Required front matter        | Title, Certificate, Declaration, Copyright, Acknowledgement, Abstract, TOC, List of Figures, List of Tables, Abbreviations |
| Required chapter structure   | Introduction, Background & Literature Review, Problem Definition, Proposed Solution, Discussion of Results, Conclusion & Future Work |
| Required back matter         | References, Appendices |

## Placeholders to fill in before submission

Search the source for the following tokens and replace each one before
compiling the final version.

| Token                       | Where it appears                                   | What to put |
|-----------------------------|----------------------------------------------------|-------------|
| `[STUDENT NAME 1..4]`       | `main.tex` (title page, declaration, ack)          | Full names of the four authors, in registration-number order |
| `[REG. NO. 1..4]`           | `main.tex` (title page, declaration table)         | Registration numbers |
| `[Student Name-1..4]`       | `main.tex` (certificate page)                      | Same names, used in the certificate paragraph |
| `[MONTH]`                   | `main.tex` (title page footer)                     | Submission month, e.g. `MAY` or `JUNE` |

The Guide and Head of Department are pre-filled as
**Dr. Ankur Priyadarshi** in both the certificate page and the
acknowledgement.

## Required image files

The report references four hand-drawn architecture diagrams that must
be saved into `figures/` before compiling, with the exact filenames
below:

| Filename                          | Diagram                                                                | Figure no. |
|-----------------------------------|------------------------------------------------------------------------|------------|
| `figures/kafka-pub-sub.png`       | Kafka producer / topic / consumer concept                              | 2.2 |
| `figures/event-driven-flow.png`   | Browser → Node.js → Kafka → Email/SMS/Push fan-out                     | 2.3 |
| `figures/system-architecture.png` | High-level architecture (FE, BE, hooks, DB, processor, Kafka, workers) | 4.1 |
| `figures/database-schema.png`     | Entity-relationship diagram of all tables                              | 4.2 |

If a file is missing, `pdflatex` will emit a warning and leave a blank
box in its place. The remaining figures (the transactional outbox
pattern in Chapter 2 and the CI/CD pipeline in Chapter 4) are drawn
directly with TikZ and need no external files.

## How to compile

You need a TeX distribution that includes **pdflatex** and the standard
packages (`titlesec`, `tocloft`, `helvet`, `tikz`, `hyperref`,
`booktabs`, `listings`, `parskip`, `fancyhdr`, `setspace`).

### Option A — local TeX install (TeX Live / MiKTeX)

From inside the `latex/` folder:

```bash
pdflatex main.tex
pdflatex main.tex   # second pass updates TOC, list of figures, list of tables
pdflatex main.tex   # third pass to settle cross-references
```

The output `main.pdf` will appear in the same folder.

### Option B — Overleaf (recommended if you don't have TeX installed)

1. Create a new blank project at <https://www.overleaf.com>.
2. Upload all files in this folder, preserving the `chapters/` and
   `figures/` subfolders.
3. Set the main document to `main.tex`.
4. Click **Recompile**.

### Option C — true Arial via XeLaTeX / LuaLaTeX

`pdflatex` substitutes Helvetica for Arial because Arial is a
proprietary font. To embed the actual Arial outlines, replace these
two lines in `main.tex`:

```latex
\usepackage[scaled]{helvet}
\renewcommand{\familydefault}{\sfdefault}
```

with:

```latex
\usepackage{fontspec}
\setmainfont{Arial}
```

and compile with `xelatex` (or `lualatex`) instead of `pdflatex`.

## Notes

- The report is set up for two-sided printing (`twoside` class option),
  so chapters always start on a recto (right-hand) page. Blank verso
  pages will appear between chapters in the compiled PDF; this is
  intentional and required by the guidelines.
- IEEE-style numeric citations such as `[3]` are produced
  automatically by the `\cite` commands in the chapters; the numbers
  are assigned in the order entries appear in `chapters/references.tex`.
- Appendix labelling (`Appendix A`, `Appendix B`) is handled by the
  `\appendix` command in `main.tex` immediately before the
  `appendices.tex` include.
