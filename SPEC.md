# Gustavo: product spec

Gustavo is a CRM for a concierge team. Clients call or email with requests (NBA tickets, a table for 8, a transfer from the airport, a yacht…). Every request becomes a **case** (also called a **file**), the team works it through **follow-ups**, buys from **suppliers**, and closes it when it's done.

This spec describes what the product does today and the rules it follows. [Practice.md](Practice.md) covers how we build it.

- **Status:** working prototype. Plain HTML/CSS/JS, no server. Data is kept in each browser (`localStorage`).
- **Where it runs:** locally (`serve.ps1`), and as a published page: https://claude.ai/artifact/X6p9N9xU3AnTKEJHcpQ6Xy
- **Code:** https://github.com/theforeverstory1987/CRM-DASH
- **Interface language:** English. Sample client names are Israeli.

---

## 1. Words we use

| Term | Meaning |
|---|---|
| **Case / file** | One client request. Number `G-1001`, always shown as **`#G-1001`** in a large chip. |
| **Client** | The person the case is for. Number `C-2001`. Has a **card type** (rank). |
| **Card type / rank** | Client tier: `Standard`, `Gold`, `Platinum`, `VIP`. |
| **Secondary contact** | Whoever opened the case on the client's behalf (an assistant, family). Name, phone, email. Empty when the client opened it. Also shown as "Opened by". |
| **Follow-up** | A note on a case: what happened, what's next. The most important information on a case. |
| **Request type** | One of: Restaurant, Hotel, Flights, Transfers, Massage, Yacht, Events, Tickets, Shopping, Gifts, Other. Shown as a hashtag (`#Tickets`). |
| **Request picture** | The icon for what the request is (🏀 NBA, 🎤 show, ✈️ flight, black car for transfers…). See §8. |
| **Supplier** | A company we buy from (ticket agency, car service, airport VIP, restaurant). |
| **Booking** | A purchase from a supplier for a case: quantity, price, invoice. |
| **Team member** | A user of the system. Role `admin` or `staff`. |
| **Open pool** | Open cases nobody has taken yet. |

---

## 2. Users and sign-in

- **Nothing to type to get in.** The sign-in page has username and password fields, pre-filled, and **Sign in** always goes through (a known username signs in as that person, anything else as the admin). Opening the app directly also signs in (`auth.js`: `ensureSession()`). Real accounts need a server.
- Admins can assign cases to anyone. Staff can take cases from the open pool.
- Sample team: Amit.R (admin), Daniel Reyes (head concierge, admin), Sofia Marín and Noa Adler (concierges).

### Sign-in page (`index.html`)
- **Left side:** "Gustavo", a short welcome, username and password (already filled in), Remember me, and **Sign in**.
- **Right side:** the blue brand panel with the logo and the line **"Gustavo – Concierge Services"** under it
- **Log out** returns to this page.

---

## 3. Layout

- **Side rail** (desktop), top to bottom:
  1. **Your profile picture**: the only place that shows your initials in a corner badge, and bigger.
  2. **+ New case**: opens in a new tab.
  3. Search, Activity, **Suppliers**, Advanced search, Settings.
  4. At the bottom: dark mode and log out.
- **Tab bar** (phones): Me, Search, **+**, Activity, Suppliers, Settings.
- **Side windows** (notes, reminders, search, your icon, add client…) always open on the **left**, next to the menu. On phones they come up from the bottom.
- **Keyboard:** `/` search, `N` new case, `Esc` closes a panel or window.
- **Refresh keeps you in place:** after a refresh you're back where you were (My cases or All files, the view and filters, the supplier, and any open case or calendar day). This is kept per browser tab.

---

## 4. Dashboard

Top row: **Quick search** (file ID, client name or ID) and four tiles: **My cases**, **All files**, **Reminders**, **Sticky notes**.

**My cases** and **All files** switch the dashboard in place. No page change, no jump. Only the side menu and the main area change, and the active tile gets a blue border.

### 4.1 My cases
- **Side menu:** your profile, then *All my cases*, *New cases* (folder icon), *Urgent*, *Waiting on supplier*, *Waiting on client*, each with a count. The *Urgent* count uses the alert colour.
- **Main area:** the case list (§5) with filters: client name/ID search, request type, priority, date, and sort (due date, priority, newest).

### 4.2 All files
Side menu, in this order:

- **Views**
  - *Calendar view*: the default when you open All files
  - *Opened today*
  - *All files*: has the **All / Not done / Done** filter plus the same filters as My cases
- **Needs attention**
  - *Urgent*
  - *Waiting on supplier*
  - *Waiting on client*
- **Filter by**
  - *Date*: quick ranges (overdue, today, this week, later, no date) or a from/until range
  - *Client name*: search, or pick a client chip; sorted A to Z
  - *Status*
  - *Card type*

### 4.3 Calendar view
- **Range:** from the **1st of the current month** to **30 days after today**, in whole Sunday–Saturday weeks. It opens scrolled to today's week, and a **Today** button jumps back. Weekday names stay pinned while scrolling.
- **Each day** shows its number of cases and the request types (for example "3 Transfers, 2 Restaurant").
- **Day colours:**
  - **Green:** every case that day is done ("all done").
  - **Red:** some cases are not done, either a mix of done and open, or a past day that's still open ("2 not done").
  - **Blue, darker when busier:** upcoming days (1 / 2 / 3–4 / 5+).
- **Filter:** All cases / Not done / Done.
- **"N still open from before [1st]"** opens the cases older than the calendar.
- **Clicking a day** opens a side panel:
  - A count per request type at the top (*All 5 · 3 #Transfers · 2 #Restaurant*). Tapping a type shows only those cases.
  - The cases, grouped by type, with time, client, flag, card type, headline, details, status, priority and who's handling each.
  - Clicking a case opens it, and **Back** returns to the day.

---

## 5. Case lists: bars

Every case list (My cases, All files, Activity) shows **compact one-line bars**:

> **Client name + flag | #File ID | headline | status (change it right there) | + Follow-up | ⌄**

- **+ Follow-up:** opens a big input on the bar. Enter or *Add* saves it without opening the case.
- **Clicking the bar** opens the case in the full-screen window (§6). The **⌄** arrow at the end opens a quick preview instead:
  - The request picture, the date label and date (for example *Game date: Sunday, September 27, 18:00*) and a countdown ("In 3 days", "Tomorrow", "Today, 19:30", "Overdue by 1 day")
  - The request type, a label such as *NBA*, and a priority flag when high or urgent
  - **The last follow-up**: who, when, and up to 3 lines at 17px
  - *Email [client]* (subject pre-filled, §9), *Take* (open pool) or *Handled by*, and **Open case**
- **Left edge colour:** each bar shows its status colour (§14), and urgent open cases are red. Done cases are dimmed.

---

## 6. The case window

Opening a case fills the screen (a phone uses the whole screen). A case also has its own page (`app.html#/case/<id>`, "open in new tab") with the same layout.

- **Top bar:** **+ New case**, **My cases**, **All cases** (these leave the case), plus *Back* when opened from a calendar day, *Open in new tab*, and *Close*.
- **Left column, case box**
  - **File ID** (big chip), **Add reminder**, **File status** (a dropdown) and the **supplier name(s)** from its bookings
  - The case's reminders: time and text, with a ✓ to mark each done
  - **General description**: free text
  - **Date** with its label for the request type (Game date, Show date, Flight, Pickup, Check-in, Reservation…), a countdown, and the alert colour when overdue or green when done
  - **Location**: country and flag
  - **What they need**: the headline, such as "5 tickets for Harry Styles", with the request picture, hashtag, label and priority
  - **Budget**: amount and currency (₪, $, €, £)
  - Handled by, came in by (phone or email), **created by** and when, **last updated** (who and when: the newest follow-up or logged event)
  - Take this case (when it's in the open pool), and *Assign to* for admins
  - **Edit case**: changes the headline, date, location, budget and description
- **Left column, client box**
  - **Client name** and flag, **gender**, **card type** (rank badge)
  - **ID** (`C-2001`), with how many open and total cases the client has
  - **Phone** with **Call**, and **email** with **Send email** (pre-filled subject), always visible
  - **Secondary contact** (Add/Change): name, phone with Call, email with Send
  - **Client notes**: preferences, allergies…
- **Right column, follow-ups (§7)** with an **Add new** button.

---

## 7. Follow-ups as a chat

- **Timeline:** oldest at the top, newest at the bottom. It opens scrolled to the newest message, with day separators ("Today", "Yesterday", "Tuesday, September 22").
- **Bubbles:** your follow-ups are blue on the right. Other people's are white on the left, with their name and picture. Every message shows its time.
- **Case events** appear as small centred lines between messages ("Daniel opened the case", "You took the case", "You changed the status: New → Waiting on client").
- **Smart quick replies** are one tap to fill the box. Ones that carry a status also move the case when sent, and a note below the box says so ("Sending also moves the case to Waiting on supplier · Keep the status").
  - *Working on it* → In progress
  - *Called the client, no answer*
  - *Sent options to the client, waiting for their answer* → Waiting on client
  - *Asked the supplier, waiting for confirmation* → Waiting on supplier
  - A "done" line for the request type → Done. For example *Tickets sent to the client ✓* or *Driver details sent to the client ✓*.
  - Replies that would set the current status are hidden.
- **Sending:** **Enter** sends, and **Shift+Enter** starts a new line. The box grows as you type. Message text is 17–18px.

---

## 8. Request pictures and date labels

- **Tickets and Events:** the picture comes from words in the headline:

  | Words in the headline | Picture | Label | Date label |
  |---|---|---|---|
  | NBA | 🏀 | NBA | Game date |
  | basketball, courtside, EuroLeague | 🏀 | Basketball | Game date |
  | football, soccer, Champions League, Premier League | ⚽ | Football | Game date |
  | tennis, Wimbledon | 🎾 | Tennis | Match date |
  | F1, Grand Prix | 🏎️ | F1 | Race date |
  | concert, festival, jazz, arena | 🎤 | Concert | Show date |
  | opera, theatre, musical, premiere, stand-up, comedy, show | 🎤 | Show | Show date |

- **Any other request:** the request type decides:

  | Request type | Picture | Date label |
  |---|---|---|
  | Restaurant | 🍽️ | Reservation |
  | Hotel | 🏨 | Check-in |
  | Flights | ✈️ | Flight |
  | Transfers | **black car** (drawn, not an emoji) | Pickup |
  | Massage | 💆 | Appointment |
  | Yacht | 🛥️ | Sailing |
  | Events | 🎉 | Event date |
  | Tickets | 🎤 | Show date |
  | Shopping | 🛍️ | Needed by |
  | Gifts | 🎁 | Deliver by |
  | Other | 📌 | Needed by |

- **No real logos:** trademarked logos (such as the NBA's) are not used. The picture plus a text label stands in for them.

---

## 9. Creating and changing cases

- **New case** always opens in a **new browser tab**. Fields:
  - Client (or add a new client), and **Opened by**: the client, or someone else (their name is required, phone and email optional)
  - What they need, request type, date needed, **location**, **budget** and currency
  - Came in by (phone or email), priority (low, normal, high, urgent), who handles it (me, the open pool, or a teammate for admins), and details
- **Statuses:** New → Ongoing (*In progress*) → On supplier (*Waiting on supplier*) / On client (*Waiting on client*) → Done. *Done* stamps the completion time.
- **Email to a client** (or a secondary contact) opens the mail app with the subject **`#G-1004 · NBA: Knicks vs. Celtics, 2 courtside seats`**.
- **Clicking an ID chip** copies it (`#G-1004`, `C-2004`).
- **Every change is logged:** created, assigned, taken, status changed, follow-up. That log feeds the chat events, *Last updated* and Activity.

## 10. Clients
- **Fields:** full name, phone, email, country (flag), **gender** (female / male / not set), **card type**, notes and preferences. Client number is automatic.
- **Client panel** (from search): contact actions and all the client's cases, with *New file* for that client.
- **Not built yet:** editing a client after creation.

## 11. Suppliers
- **Page layout** is like the dashboard: a side menu of **categories**, then the category's supplier boxes and the selected supplier's bookings.
- **Categories** (in this order) and their suppliers:
  - Transfers (black car): Assistant, Elite VIP, Blacklane
  - Shows 🎤: Connect, Live, Lord, Alex Thompson, JULIA TV
  - Sports 🏀: none yet
  - Airport VIP ✈️: Flow, Laufer
  - Restaurants 🍽️: none yet
- **Supplier box:** clients, number of tickets or passengers, total in ₪, and invoices missing (alert) or *Invoices in*.
- **Bookings table** for a supplier:
  - **Columns:** client (name and flag), phone, date (*Show date* / *Pickup* / *Flight* / *Reservation* / *Game date*), quantity (*Tickets* / *Passengers* / *Guests*), **price in ₪**, **invoice number** or *Missing*, and case.
  - A totals row at the bottom. Clicking a row opens the case. On narrow screens each booking shows as a card.
- **Add booking:** pick a case (its date fills in), then quantity, price and invoice number (can be empty until the invoice arrives).
- **Add supplier:** name, category, phone, email. Suppliers are saved data, not code.
- **In the case window**, the supplier name appears under the file status.

## 12. Reminders and sticky notes
- **Reminders** (dashboard tile): text and time. Past-due reminders use the alert colour, and each can be ticked done. A reminder added from a case belongs to that case and links back to it.
- **Sticky notes** (dashboard tile): coloured notes (yellow, pink, blue, green).
  - **Share** with teammates, when writing a note or later from the note. Shared notes show "Shared with …" to you and "From …" to them.
  - Only the author can delete a note. Recipients can remove it from their own board.
  - This only works within one browser until there's a server.

## 13. Search, Activity, Settings
- **Search:**
  - *Quick search* (dashboard): file number or client.
  - *Search page* (new tab): case ID, client ID, name, phone or email.
  - *Advanced search*: text, client, status, priority, category, handler, channel, and opened from/until.
- **Activity:**
  - All open cases, with stats and the open pool.
  - *Reports & log*: files per day, team workload heatmap, open cases by priority, files by category, and the full activity log.
- **Settings:**
  - Your icon: photo, emoji or initials; colours; name and initials.
  - Light or dark mode, and a background tint.
  - Sample data: clear or restore.
  - Log out.

---

## 14. Look and feel

- **Colours**
  - **Primary blue:** `#0067ff` (the brand, buttons, selection, upcoming days)
  - **Status colours** are used on status pills, status dropdowns, and the left edge of every case bar:

    | Status | Colour |
    |---|---|
    | New | blue `#0067ff` |
    | **Ongoing** | **purple `#8a3ffc`** |
    | **Waiting on supplier** | **orange `#ff8a00`** |
    | Waiting on client | turquoise `#0891b2` |
    | **Done / closed** | **green `#22c55e`** |

  - **Red `#ff3350`:** **urgent** (an urgent open case's bar edge is red, and the urgent tag is solid red) and the alert colour: overdue, calendar days not all done, missing invoices, errors.
  - **Softer orange:** high priority
- **Dark mode** covers the whole app.
- **Dates and times**
  - Card dates look like **`23.9`**, with **`Sun 19:00`** under them.
  - The clock is 24-hour everywhere.
  - Relative days: *Today*, *Yesterday*, *Tomorrow*.
- **Case numbers** are always the large chip `#G-1001`.
- **Text size:** follow-up text is large (17–18px); body text is 14–16px.
- **Flags** are drawn inside the app (36 countries), so they don't depend on an outside image service.
- **Phones:**
  - At phone width, nothing scrolls sideways (16px side margins).
  - Lists stack.
  - The case window uses the whole screen, with the follow-up box pinned to the bottom.

## 15. Data

Kept in `localStorage` under `gustavo_data_v1`:

| Collection | Fields |
|---|---|
| `team` | id, name, initials, title, role, and icon settings (photo, emoji, tone, colour, bg, dark) |
| `clients` | id, number, name, phone, email, country, gender, tier, notes, createdAt |
| `cases` | id, number, title, clientId, category, channel, priority, status, dueAt, location, budget `{amount, currency}`, details, requester `{name, phone, email}` or null, createdAt, createdBy, assignee, assignedBy, completedAt, updates `[{id, at, by, text}]` |
| `suppliers` | id, name, group, phone, email |
| `bookings` | id, supplierId, caseId, clientId, date, qty, price (₪), invoice |
| `reminders` | id, text, at, by, done, caseId |
| `notes` | id, text, color, by, sharedWith `[memberId]`, at |
| `activity` | id, type, by, at, caseId / clientId, from, to, text |

Other keys:
- `crm_session`: who's signed in
- `gustavo_theme`: light or dark
- `gustavo_home_view`: the My cases view
- `gustavo_ui` (in the tab's `sessionStorage`): where you were, restored after a refresh

**Sample data:** 6 Israeli clients and 46 cases spread over the month (past, done, today and upcoming), plus sample bookings, notes and reminders. Older saves get new sample additions once through migrations, and anything the user entered is never overwritten.

## 16. Known limits and next steps

- **No server yet.** Each browser has its own copy of the data, so shared notes, bookings and cases don't reach other people.
- **One login** (`admin`). Real accounts and passwords need a server.
- **Missing editing:** you can't edit or delete a client, delete a case, or edit or delete a booking or supplier.
- **Suppliers still needed** for Sports and Restaurants (waiting for real names).
- **Currencies:** budgets can be in any of four currencies, but supplier prices are ₪ only.
- **Possible next steps:**
  - A real backend with shared data
  - Real logins
  - Editing clients
  - Hebrew / RTL interface
  - Email integration
  - Reminder notifications
