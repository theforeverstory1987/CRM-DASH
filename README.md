# Gustavo

A concierge CRM: keep a database of clients and open a case ("file") for every request that comes in by phone or email. Plain HTML/CSS/JS, no build step.

## What's in it

- **Side menu** (plain icon buttons, top to bottom): **Home** (a blue house: the main dashboard; the page you're on shows white on a solid blue square), **+** new file (a blue outline, always opens in a new browser tab), search a client (ID or full name) or case (number), Activity, Suppliers, Settings (your profile is there), and Log out. Advanced search is on the Search page and dark mode in Settings.
- **My dashboard**: your cases, whether the admin assigned them or you took them, filtered by status (Open, Ongoing, Waiting, Done), whose, priority and due date, plus the open pool (cases nobody has taken yet, with a Take button) and recent activity.
- **Home** (the main dashboard) has one tab, **Open cases**: your open cases as squares; the whole team's are in All files, as rows. Rows (All files): No. / Client (with the card type under the name) / Info (the request type and its headline) / Due date / Status, plus two buttons that show when you point at a row (add a follow-up, email the client). **Squares** (Open cases), like a board's cards: file ID and date, the client's name in Playfair Display, their card (small), the request type in capitals (VIP AT THE AIRPORT, TICKETS, TRANSPORT…), and quick tools to change the status, add a follow-up and email the client. Rows and squares float on a gentle shadow with a short, thin dash in the status colour at the bottom left. Pointing at the file ID shows a copy button; a pink flag before it marks a case that needs attention. The tools (Calendar, Opened, Status) sit over the list, with *All files*, *Reminders* and *Sticky notes* at their far end. **Pull a thread from Reminders onto a case** and a reminder for it pops up right there. **Calendar** opens a sliding strip of just the days that have cases; pick one to see its cases. Clicking a case opens the case window in three columns: the client on the left (name, then boxes for card type, gender, ID number, phone, email, additional phone and email, each with copy on pointing; an Additional info free-text box; additional contacts such as a secretary or partner with phone and email), the request in the middle (requested dates such as 12–16.10, headline, description, how many, location, budget, what the client insists on and #hashtags), the follow-ups chat on the right. Screens change with a short, soft fade, and no scrollbars show.
- **Tabs** look like folder tabs: the one you're on is a folder tab joined to the frosted panel under it, the rest plain words; under them, a frosted panel holds the cases. After Open cases, each case you keep open is a tab (client and file ID), a case you only preview is an italic tab with + to keep it, and pointing at a tab shows its × to close it. The whole app uses a calm, smaller scale (14px text, 13px controls).
- **Look**: a soft grey-to-pale-blue background with frosted-glass panels (the rail and the panel under the tabs), white case tiles, a folder tab joined to the panel for the one you're on and outline buttons, all with small, square-ish corners. Before that: the rail sits on a soft blue, apart from the page; the tabs and every case are white boxes on a gentle bluish shadow, with no outlines; small corners (no round pills); plenty of space. Type is Plus Jakarta Sans, with Instrument Serif for page titles. The rail stays on screen on every page; cases and side windows open beside it.
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
