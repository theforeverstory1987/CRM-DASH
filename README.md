# Gustavo

A concierge CRM: keep a database of clients and open a case ("file") for every request that comes in by phone or email. Plain HTML/CSS/JS, no build step.

## What's in it

- **Side menu** (round buttons, top to bottom): **+** new file (always opens in a new browser tab), search a client (ID or full name) or case (number), your avatar (your dashboard), Activity, Advanced search, Settings, and Log out.
- **My dashboard**: your cases, whether the admin assigned them or you took them, filtered by status (Open, Ongoing, Waiting, Done), whose, priority and due date, plus the open pool (cases nobody has taken yet, with a Take button) and recent activity.
- **My cases** shows your cases as **Squares**, a **List**, or a **Calendar** of just your cases.
- **All files** (from "All cases" in a case window): the whole team's cases, opening on a calendar of five weeks starting today, showing how many cases are due each day and of which request types; click a day for a side panel that counts its cases by type (tap a type to show only those) and lists them grouped by type. The side menu switches to Opened today, All files, and filters by date, client name, status and card type (membership).
- **Calendar colours**: the calendar starts today, with today as the first box of each week row; days that have gone aren't shown, and still-open cases from them sit behind a "still open from earlier days" button. A day where every case is done is green, a day with some cases still open is red, and upcoming days are blue by how busy they are. All / Not done / Done filters the calendar and the All files list.
- **Suppliers** (side menu): shows (Connect, Live, Lord, Alex Thompson, JULIA TV), transfers (Assistant, Elite VIP, Blacklane) and airport VIP (Flow, Laufer). Each supplier lists what was bought from it: client, phone, date, tickets or passengers, price and invoice number (or "Missing"), linked to the case. "Add booking" records a new purchase, and the case shows which supplier it was bought from.
- **Activity**: all open cases across the team with the same filters, and a Reports & log tab.
- **Settings**: your profile icon (photo, icon or initials), the team, sample data and log out.
- **Case squares** (dashboard), top to bottom: file ID (with the request's picture in the corner), client and flag, headline, date (25.09.26), Follow-up (with the count so far) and Email, and the status. The List view and Activity keep one-line bars with a date tile, countdown and the last follow-up.
- **A case** (drawer or its own page): the client with phone and email always showing (Call, Send email), who opened it (the client, or someone on their behalf, like an assistant, with their own phone and email), the dates, status, free-text details and the follow-ups, then suppliers and assignment. Case numbers are the big `#G-1001` chips everywhere.
- **Refresh**: a refresh keeps you where you were: My cases or All files, the view and filters, the supplier, and the open case or calendar day.
- **Cases**: status (New, In progress, Waiting on client, Done), priority, assignment and updates. Case IDs (`G-1001`) and client IDs (`C-2001`) copy to the clipboard with one click. "Email" on a case opens a new email with the case number and request in the subject (`#G-1001 · Table for 4`).
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
