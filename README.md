# Gustavo

A concierge CRM: keep a database of clients and open a case ("file") for every request that comes in by phone or email. Plain HTML/CSS/JS, no build step.

## What's in it

- **Side menu** (round buttons, top to bottom): **+** new file (always opens in a new browser tab), search a client (ID or full name) or case (number), your avatar (your dashboard), Activity, Advanced search, Settings, and Log out.
- **My dashboard**: your cases, whether the admin assigned them or you took them, filtered by status (Open, Ongoing, Waiting, Done), whose, priority and due date, plus the open pool (cases nobody has taken yet, with a Take button) and recent activity.
- **All files** (the tile on the dashboard): switches the dashboard in place, without leaving the page, to a calendar of today and the month ahead, showing how many open cases are due each day and of which request types; click a day for a side panel that counts its cases by type (tap a type to show only those) and lists them grouped by type. The side menu switches to Opened today, All files, and filters by date, client name, status and card type (membership).
- **Calendar colours**: the calendar starts on the 1st of the month and opens on today. A day where every case is done is green, a day with cases still open (partly done, or already past) is orange, and upcoming days are blue by how busy they are. All / Not done / Done filters the calendar and the All files list.
- **Suppliers** (side menu): shows (Connect, Live, Lord, Alex Thompson, JULIA TV), transfers (Assistant, Elite VIP, Blacklane) and airport VIP (Flow, Laufer). Each supplier lists what was bought from it: client, phone, date, tickets or passengers, price and invoice number (or "Missing"), linked to the case. "Add booking" records a new purchase, and the case shows which supplier it was bought from.
- **Activity**: all open cases across the team with the same filters, and a Reports & log tab.
- **Settings**: your profile icon (photo, icon or initials), the team, sample data and log out.
- **Case cards**: a date tile with the request's picture (🏀 and an "NBA" label for an NBA game, 🎭 for a show, ✈️ for a flight…), the date and time it's for, how far off it is ("In 3 days", "Overdue by 1 day"), and the last follow-up with who wrote it and when.
- **A case** (drawer or its own page): the client with phone and email always showing (Call, Send email), who opened it (the client, or someone on their behalf, like an assistant, with their own phone and email), the dates, status, free-text details and the follow-ups, then suppliers and assignment. Case numbers are the big `#G-1001` chips everywhere.
- **Refresh**: a refresh keeps you where you were: My cases or All files, the view and filters, the supplier, and the open case or calendar day.
- **Cases**: status (New, In progress, Waiting on client, Done), priority, assignment and updates. Case IDs (`G-1001`) and client IDs (`C-2001`) copy to the clipboard with one click. "Email" on a case opens a new email with the case number and request in the subject (`#G-1001 · Table for 4`).
- **Sticky notes and reminders** (tiles on the dashboard): notes can be shared with teammates, who see them on their own notes marked "From …"; only the author can delete a note.
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
