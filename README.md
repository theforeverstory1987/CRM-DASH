# Gustavo

A concierge CRM: keep a database of clients and open a case ("file") for every request that comes in by phone or email. Plain HTML/CSS/JS, no build step.

## What's in it

- **Side menu** (plain icon buttons, top to bottom): **+** new file (always opens in a new browser tab), search a client (ID or full name) or case (number), your avatar (your dashboard), Activity, Advanced search, Settings, and Log out.
- **My dashboard**: your cases, whether the admin assigned them or you took them, filtered by status (Open, Ongoing, Waiting, Done), whose, priority and due date, plus the open pool (cases nobody has taken yet, with a Take button) and recent activity.
- **My tasks** shows your cases as a list of rows only: No. / Client (with the card type under the name) / Info (the request type and its headline, with a picture) / Due date / Status, then two icon buttons (add a follow-up, email the client). Pointing at the file ID shows a copy button; a pink flag before it marks a case that needs attention. No page title; the tools (Calendar first) sit at the top of the list. The side menu starts with *Needs attention* (pink flag), then *Urgent* (red), *Waiting on supplier* (orange) and *Waiting on client* (blue); Needs attention and the two Waiting views open a picker of their cases in a tab of their own. **Pull a thread from Reminders onto a case** and a reminder for it pops up right there. **Calendar** opens a sliding strip of just the days that have cases; pick one to see its cases. Clicking a row opens the case screen: the list's cases as cards down the left (a click previews one, + keeps it as a tab), the case on the right. Screens change with a short, soft fade, and no scrollbars show.
- **Case tabs**: the first tab is **My tasks** with your total; each case you keep open is a tab (client and file ID), a case you only preview is an italic tab with + to keep it, and pointing at a tab shows its × to close it. The whole app uses a calm, smaller scale (14px text, 13px controls) with very light lines and a very gentle shadow.
- **Look**: everything on one white background with no shadows; very light lines split the side menu's parts, the rows, and outline fields, tabs and case boxes; small corners (no round pills); plenty of space. The side rail (plain icons, no circles) stays on screen on every page; cases and side windows open beside it.
- **Back**: the browser's Back button always returns to the screen before, closing an open window first.
- **Card types**: Centurion (black card), Platinum (silver) and Fly Card (light blue), shown as a little credit card with its name.
- **All files** (from *All files* in My tasks' side menu): the whole team's cases, opening on a calendar of five weeks starting today, showing how many cases are due each day and of which request types; click a day for a side panel that counts its cases by type (tap a type to show only those) and lists them grouped by type. The side menu switches to Opened today, All files, and filters by date, client name, status and card type (membership).
- **Calendar colours**: the calendar starts today, with today as the first box of each week row; days that have gone aren't shown, and still-open cases from them sit behind a "still open from earlier days" button. A day where every case is done is green, a day with some cases still open is red, and upcoming days are blue by how busy they are. All / Not done / Done filters the calendar and the All files list.
- **Suppliers** (side menu): shows (Connect, Live, Lord, Alex Thompson, JULIA TV), transfers (Assistant, Elite VIP, Blacklane) and airport VIP (Flow, Laufer). Each supplier lists what was bought from it: client, phone, date, tickets or passengers, price and invoice number (or "Missing"), linked to the case. "Add booking" records a new purchase, and the case shows which supplier it was bought from.
- **Activity**: all open cases across the team with the same filters, and a Reports & log tab.
- **Settings**: your profile icon (photo, icon or initials), the team, sample data and log out.
- **Case rows** (My tasks and All files): No. / Client and card type / Info / Due date / Status / follow-up and email buttons, under column names shown once. Statuses are white pills with a small coloured square (turquoise open, violet ongoing, orange on supplier, blue on client, green done). Activity keeps one-line bars with a date tile, countdown and the last follow-up.
- **A case** (drawer or its own page): the client with phone and email always showing (Call, Send email), who opened it (the client, or someone on their behalf, like an assistant, with their own phone and email), the dates, status, free-text details and the follow-ups, then suppliers and assignment. Case numbers are the big `#G-1001` chips everywhere.
- **Refresh**: a refresh keeps you where you were: My tasks or All files, the view and filters, the supplier, and the open case or calendar day.
- **Cases**: status (Open, In progress, Waiting on supplier, Waiting on client, Done), plus a pink **Needs attention** flag on a case with nothing done yet (its first follow-up moves it to In progress), priority, assignment and updates. Case IDs (`G-1001`) and client IDs (`C-2001`) copy to the clipboard with one click. "Email" on a case opens a new email with the case number and request in the subject (`#G-1001 · Table for 4`).
- **Sticky notes and reminders** (a floating box under the dashboard's side menu): notes can be shared with teammates, who see them on their own notes marked "From …"; only the author can delete a note.
- **Reports** (on Activity): files opened and completed, time to complete, team workload, open cases by priority, person and category, and the full activity log.

Data is stored in the browser (localStorage) and starts with sample data, which you can clear or restore in Settings.

## Running it

Open [index.html](index.html) in a browser, or serve it locally:

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then visit http://localhost:8080.

## Sign in

- Username: `admin`
- Password: `12345`

The login is a front-end prototype: users are defined in [auth.js](auth.js) and checked in the browser. It needs a real backend before clients use it.
