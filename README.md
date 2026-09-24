# Gustavo

A concierge CRM: keep a database of clients and open a case ("file") for every request that comes in by phone or email. Plain HTML/CSS/JS, no build step.

## What's in it

- **Side menu** (round buttons, top to bottom): **+** new file (always opens in a new browser tab), search a client (ID or full name) or case (number), your avatar (your dashboard), Activity, Advanced search, Settings, and Log out.
- **My dashboard**: your cases, whether the admin assigned them or you took them, filtered by status (Open, Ongoing, Waiting, Done), whose, priority and due date, plus the open pool (cases nobody has taken yet, with a Take button) and recent activity.
- **Activity**: all open cases across the team with the same filters, and a Reports & log tab.
- **Settings**: your profile icon (photo, icon or initials), the team, sample data and log out.
- **Cases**: status (New, In progress, Waiting on client, Done), priority, assignment and updates. Case IDs (`G-1001`) and client IDs (`C-2001`) copy to the clipboard with one click.
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
