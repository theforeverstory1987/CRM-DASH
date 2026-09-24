# Gustavo: how we work

How this project is built and changed. It's based on the owner's feedback so far. What the product does is in [SPEC.md](SPEC.md).

---

## 1. Product principles (from the owner's feedback)

1. **Follow-ups come first.** They're the most important thing on a case: always visible, in large text, one click to add, and shown as a chat.
2. **Don't jump pages.** Switching between My cases and All files, views or suppliers happens in place. Only the parts that change are redrawn.
3. **Keep people where they were.** A refresh brings back the same screen, filters and open case. Redraws keep scroll positions.
4. **Lists stay short, details open on click.** A case bar shows only client | file ID | headline | status | + Follow-up. Everything else appears when the bar is clicked, or in the full case window.
5. **A case opens full screen,** laid out like the owner's sketch: case box and client box on the left, follow-ups on the right, New case / My cases / All cases on top.
6. **Case numbers are big** and written `#G-1001`.
7. **The alert colour means "needs attention" and nothing else:** overdue, urgent, not done, missing invoice. Done is green, upcoming is blue.
8. **Dates are short and clear:** `23.9` with `Sun 19:00`, a 24-hour clock, plus a countdown ("In 3 days", "Overdue by 1 day").
9. **Show what the request is** with a picture (🏀 NBA game, 🎤 show, black car for transfers) next to the hashtag. Never use trademarked logos.
10. **Smart, not busy:** quick replies that also set the status, pre-filled email subjects, dates that fill in from the case. Add helpers that save clicks, not more text on the screen.
11. **Don't invent the owner's business data.** Supplier names, prices and so on come from the owner. When something is missing (Sports or Restaurant suppliers), leave an empty state with an **Add** button and ask.
12. **The interface is in English; sample people are Israeli.**

## 2. Working with the owner

- **Replies:** in the language they wrote in (usually Hebrew), short and concrete: what changed, where to click, and what's still open.
- **Sketches and screenshots are the spec.** When one arrives, match it, and say what was added beyond it.
- **Messages mid-task:** acknowledge in one line, finish the current step, then do it. Say which request each change answers.
- **When a request is ambiguous** (for example "להגיד" that probably meant "להגדיל"), say how you read it, build that, and say it's easy to change.
- **After every change:**
  1. Test it in the browser (see §4).
  2. **Update the published link** at https://claude.ai/artifact/X6p9N9xU3AnTKEJHcpQ6Xy. Always the same link, never a new one.
  3. **Push to GitHub** when the owner asks. They usually do ("push").
- **If the link looks old** after an update, the owner should refresh with Ctrl+Shift+R.
- **Be honest about limits.** Say plainly what doesn't work yet, for example that data is per browser.

## 3. Code conventions

- **Stack:**
  - Plain HTML, CSS and JavaScript. No build step, no framework.
  - `app.html` loads `auth.js` → `data.js` → `flags.js` → `app.js`.
  - `index.html` is the sign-in page (`styles.css`, `auth.js`, `login.js`).
- **Files:**
  - `data.js`: the data layer: constants, sample data, migrations, and every function that changes data.
  - `app.js`: rendering and events.
  - `app.css`: the app's styles.
  - `styles.css`: shared styles and the sign-in page.
  - `flags.js`: country flags drawn inline.
- **Rendering:**
  - HTML is built in template strings. **Every piece of user text goes through `esc()`.**
  - Case numbers use `caseChip()`, request pictures `requestKind()`, dates `timeFmt` / `fmtDayTime` / `dueCountdown`.
- **Events:**
  - One delegated click handler reads `data-*` attributes (`data-case`, `data-expand`, `data-action="…"`, …).
  - `data-stop` marks areas where clicks shouldn't open or expand the case (selects, links, forms).
- **Panels:**
  - `openSheet()` makes a side drawer, and `openSheet(…, { full: true })` makes the full-screen case window.
  - `sheetBack` gives a panel a Back button to where it came from.
  - `currentSheet` is what a refresh reopens.
- **Changing data:**
  - Always change data through a function in `data.js`, then call `saveData()`.
  - Log case events with `logActivity()`.
- **New fields and new sample data need a migration** in `migrate()`, so saved data keeps working:
  - Fill in defaults for old records (`if (x === undefined) …`).
  - Add sample records once, as a batch in `SAMPLE_BATCHES` behind a flag.
  - Rename sample text only when it still matches the old sample (`OLD_SAMPLE_*`, `RETITLED_SAMPLES`).
  - Never overwrite what the user entered.
  - `const` values that `migrate()` uses must be declared **before** `let db = loadData()`.
- **Storage:** wrap every `localStorage` and `sessionStorage` access in `try/catch`. The app has to keep working without storage.
- **CSS:**
  - Use the colour variables on `.app-body`, and set every colour for dark mode too (`html.dark`).
  - Use container queries where a box's own width matters, such as calendar days and the bookings table.
  - Screens must work at 375px with no sideways scroll.
- **Accessibility:**
  - Buttons are buttons.
  - `role="button"` elements get `tabindex="0"`, and Enter/Space work on them.
  - Every icon-only control has an `aria-label`, and focus stays visible.
- **Cache busting:** every time a JS or CSS file changes, bump `?v=N` in **both** `app.html` and `index.html`.
- **Comments:** short, explaining *why*, in the existing style.

## 4. Testing before handing over

1. **Run it locally:** start the `crm` server from `.claude/launch.json` on **port 5173** (Windows blocks 8080). There is no password: Enter (or opening `app.html`) signs you in.
2. **Check for errors:** reload with a fresh URL (`app.html?r=<time>`) so the browser can't serve old files, then check the console for errors.
3. **Try the flow:** click through what changed, and check what the page shows and the saved data (`db`).
4. **Check phone width:** at 375 × 812 the page must not scroll sideways.
5. **Clean up:** remove test data you created (test follow-ups, suppliers, reminders) before publishing.
6. **Publish the same link** with all nine files: `app.html`, `app.css`, `app.js`, `auth.js`, `data.js`, `login.js`, `styles.css`, `favicon.svg`, `flags.js`. Label the version with a few words.

## 5. Git

- **Branch:** work on `main`; that's this repository's history.
- **Commit author:** `amitrotschild <amitrotschild@icloud.com>`, passed per commit (`git -c user.name=… -c user.email=… commit`). The machine has no global git identity.
- **Commit messages:** a short subject, then bullets saying what changed for the user. End with:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
- **Pushing:** push to `origin main` when the owner asks.
