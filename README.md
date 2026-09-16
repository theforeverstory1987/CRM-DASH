# Gitbub

A client dashboard for tracking clients, notes, and reminders. Plain HTML/CSS/JS, no build step, no dependencies. Data is stored in the browser's localStorage.

## Running it

Open [index.html](index.html) directly in a browser, or serve it locally:

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then visit http://localhost:8080.

## Features

- Add/edit/delete clients (name, company, email, phone)
- Per-client notes
- Per-client reminders with due dates, overdue/due-soon highlighting, and completion tracking
- Dashboard overview with client count and upcoming/overdue reminders across all clients
