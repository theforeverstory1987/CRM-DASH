# Gustavo: product spec

Gustavo is a CRM for a concierge team. Clients call or email with requests (NBA tickets, a table for 8, a transfer from the airport, a yacht…). Every request becomes a **case** (also called a **file**), the team works it through **follow-ups**, buys from **suppliers**, and closes it when it's done.

This spec describes what the product does today and the rules it follows. [Practice.md](Practice.md) covers how we build it.

- **Status:** working prototype. Plain HTML/CSS/JS, no server. Data is kept in each browser (`localStorage`).
- **Where it runs:** locally (`serve.ps1`), and as a published page: https://claude.ai/artifact/X6p9N9xU3AnTKEJHcpQ6Xy
- **Code:** https://github.com/theforeverstory1987/CRM-DASH
- **Interface language:** English. Sample client names are Israeli.
- **Fonts:** the app uses **Plus Jakarta Sans** (a clean, slightly rounded sans that many of today's top dashboards use); the page and window titles use **Instrument Serif**, an editorial serif. Both are free Google Fonts. (Playfair Display and Inter were used before.)

---

## 1. Words we use

| Term | Meaning |
|---|---|
| **Case / file** | One client request. Number `G-1001`, always shown as **`#G-1001`** in a large chip. |
| **Needs attention** | **Not a status: a pink flag** (`#ff3d8b`) before the file ID of a case that is still *Open* and has **no follow-ups yet**, i.e. just opened with nothing done. The case's **first follow-up moves it to In progress** by itself (logged like any status change, and said in the toast), and the flag goes. Saved cases that were Open but already had follow-ups became In progress. |
| **Client** | The person the case is for. Number `C-2001`. Has a **card type** (rank). |
| **Card type / rank** | The card the client holds: `Centurion`, `Platinum`, `Fly Card`. Shown as a little credit card with its name in capitals: Centurion black, Platinum silver, Fly Card light blue. Older saves: Standard, Gold and World Elite became Fly Card, VIP became Centurion. |
| **Secondary contact** | Whoever opened the case on the client's behalf (an assistant, family). Name, phone, email. Empty when the client opened it. Also shown as "Opened by". |
| **Follow-up** | A note on a case: what happened, what's next. The most important information on a case. |
| **Request type** | One of: Restaurant, Hotel, Flights, Airport VIP, Transfers, Attractions, Massage, Yacht, Events, Tickets, Shopping, Gifts, Delivery, Other. Shown as a hashtag (`#Tickets`), and by name in the dashboard's Info column. |
| **Request picture** | The icon for what the request is (🏀 NBA, 🎤 show, ✈️ flight, a black Rolls-Royce photo for transfers…), 3D pictures and one photo. See §8. |
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
  1. **Home** (the main dashboard): a house icon in the + blue (white on a solid blue square while you're on it, like any page you're on), where the profile picture used to be (your profile is in Settings).
  2. **+ New case**: opens in a new tab. A **white square with a blue outline and a blue +**, not a filled blue square, so it never looks like the page you're on (the phone bar's + matches).
  3. Search, Activity, **Suppliers**, Settings. The buttons are plain icons with no circle or outline; a soft square shows under the one you point at, and a light blue one under the page you're on. (Advanced search is on the Search page, dark mode in Settings.)
  4. At the bottom: log out.
- **The rail never disappears.** It stays on screen on every page, and case windows and side windows open beside it, never over it. Going somewhere from the rail closes the open window.
- **Tab bar** (phones): Me, Search, **+**, Activity, Suppliers, Settings.
- **Look: dark glass, iOS style** (the default; *Light* in Settings switches to the same glass style in light): a **deep, warm, dark background** with soft coloured light (amber, violet and blue glows), and **frosted glass** for the rail, the menus and the panel under the tabs (translucent, a thin light edge, blurred behind); cases, boxes and fields are lighter glass tiles; white text, the + blue for what you're on. **Light glass** is the same style on a pale background with soft peach, lilac and sky light, frosted white glass and white glass tiles. Before that, the light look was a **soft background that runs from light grey to a pale blue**; the rail and the panel under the tabs are **frosted glass** (translucent white, a thin white edge, small even corners); cases are soft white tiles; the tab you're on is a **folder tab** joined to the frosted panel under it; small actions (follow-up, email, back) are **outline buttons**. **Corners are small and square-ish** (14px panels and rail, 10px tiles, 8px tabs, tools and buttons): no pills or circles. Earlier: the rail is its own column on a soft blue (`#e6eeff`), set apart from the white page, and the tabs, the tools, every case row, the cards and the boxes inside a case are white boxes on a **gentle bluish shadow**, with no outlines. **Each case row and card has a short, thin dash in its status colour at its bottom left**. **Few icons:** the views are names with a short coloured bar, rows have no request pictures, and a row's follow-up and email buttons show when you point at it. Things that float over the page (side windows, the reminder pop-up) keep a soft shadow. There are **no grey fills**; the few soft fills (pointing at something, a picture tile) are a very light blue. Windows open over a light white veil, not a grey one. **Small corners everywhere (6–8px), no round pills or big curves**; only profile pictures and dots stay round. **No scrollbars show** (so they don't cut the screen into strips); everything still scrolls. **Screens change with one short, soft fade** (0.15s): a case window fades in and out, another page fades in, and moving between cases fades just the case; nothing slides, grows or scales. **A calm, smaller scale, like other work apps of this kind:** 14px text, 13px menus, tabs and controls, 12px secondary lines, 11px labels; list rows about 54px, tabs and controls 34px, rail buttons 40px on a 60px floating rail. Generous spacing; nothing crowded.
- **Tabs:** styled like folder tabs: the one you're on is a **folder tab**: part of the frosted panel under it, joined with soft inward curves (its count in blue); the others are plain words with no box. Everything under the tabs (the tools and cases on the dashboard; the cards and the case in a case window) sits on one frosted-glass panel, so the white rows, squares and cards stand out on it. The dashboard has **one tab, All cases**, with how many of your cases are open (clicking it shows them and closes any case window). Every case you keep open is a tab after it (**client name and file ID**, `Tamar Avraham #G-1025`). A case you only look at from the cards is a **preview**: an italic tab at the end with a **+** (a small square with a line round it) that keeps it as a tab; the next preview replaces it. Pointing at a tab shows its **×** to close it (on touch screens it always shows); closing the tab you're on moves to the next one, or back to My tasks after the last (closing the preview just closes it). The tabs show on Activity, Suppliers and Settings too while any are open, and are kept per browser tab (a refresh keeps them).
- **Side windows** (notes, reminders, your icon, add client…) always open on the **left**, next to the rail. On phones they come up from the bottom.
- **Back always returns to the screen before.** Every screen has its own address: My tasks (`#/home`, a view as `?view=new`), All files (`#/files?view=…`), Activity's tab (`?tab=reports`) and the supplier category (`#/suppliers?group=…`), and My tasks' calendar (`?cal=1`, a day as `&day=2026-09-28`). Opening a window adds a Back step too, so Back closes it; a case opened from a calendar day goes Back to the day first. The back button inside a window does the same as the browser's.
- **Keyboard:** `/` search, `N` new case, `Esc` closes a panel or window.
- **Refresh keeps you in place:** after a refresh you're back where you were (My tasks or All files, the view and filters, the supplier, and any open case or calendar day). This is kept per browser tab.

---

## 4. Dashboard

**Home** is the main dashboard: no page title or greeting (there's a hidden title for screen readers), just **one tab, All cases**, then the side menu and **your open cases as squares** (see below). The whole team's cases are in *All files*.

### 4.1 All cases
- **Side menu**, part of the page (no box of its own, a light line down its right edge), like All files': **you** at the top (your icon; clicking it lets you change it: a photo, an icon on a colour, or your initials, and your name) with your first name and how many cases are open and new; **Views**: *Calendar view* (opens the month calendar over the cases; clicking it again goes back to the plain view) and **Open cases** with how many you're working on; **Needs attention**, each with a small square and its count in its colour, in this order: *Urgent* (red), *Waiting on supplier* (orange), *Waiting on client* (light blue) and *New cases* (yellow); **More**: *All files* (the whole team's cases), *Reminders* with a bell (pull a thread from it onto a case) and *Sticky notes* with a note icon. The view showing is light blue with a blue bar and count; picking it again goes back to all open. On phones the menu is one row that scrolls sideways.
- **No search or filters over the cases** (no search box, *Opened* or *Status*): the side menu picks what shows, and the rail's Search finds any case.
- **List**: your open cases as squares, open first and by date (the *Status* tool can show any status, Done included); *Calendar view* in the side menu opens a **month calendar from today on**, with how many cases each day (§4.4).
- **Squares:** like a board's cards, white tiles, several to a row, top to bottom: the **file ID** (grey, with the pink flag when it needs attention, and a copy button on pointing) with the **due date** across from it (plain, never red); the **client's name in Playfair Display**, not too big (17px); their **card** (the little card and its name, much smaller); then the **request type in a chip like the hashtags**, in the regular font and plain words: VIP at the airport, Tickets, Restaurants, Transport, Delivery…; then the quick tools: the **status** (change it right there), **add a follow-up** (opens a line in the square; *Add* or Enter saves) and **email** the client. Clicking the rest opens the case window (§6). On phones they stack in one column.
- **Reminder thread:** press on *Reminders* and pull: a thread (the + blue) follows the pointer from it, sagging a little. Let go on a case (its row, or its card beside an open case; the one under the thread gets a blue ring and a blue number) and a **reminder for that case pops up right there**, already filled in ("Follow up on #G-1036 with Yael", tomorrow at 12:00): *Save* adds it to that case and to your Reminders, *Cancel*, Esc or pressing elsewhere puts it away. A plain click on Reminders still opens them.

### 4.2 All files
The whole team's cases, opened from *All files* at the end of the dashboard's tools. Home in the rail goes back to the dashboard. Its lists use the same rows as My tasks (§5).

Side menu, in this order:

- **Views**
  - *Calendar view*: the default when you open All files
  - *Opened today*
  - *All files*: has the **All / Not done / Done** filter plus client name/ID search, request type, priority, date, and sort (due date, priority, newest)
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
- **Range:** **five whole weeks starting today**. Each row starts on today's weekday (today is always the first box), so there are no empty or faded days, and days that have gone are not shown. A **Today** button jumps back to the top. Weekday names stay pinned while scrolling.
- **Each day** shows its number of cases and the request types (for example "3 Transfers, 2 Restaurant").
- **Day colours:**
  - **Green:** every case that day is done ("all done").
  - **Red:** a mix of done and open cases ("2 not done").
  - **Blue, darker when busier:** upcoming days (1 / 2 / 3–4 / 5+).
- **Filter:** All cases / Not done / Done.
- **"N still open from earlier days"** opens the open cases from days that have gone.
- **Clicking a day** opens a side panel:
  - A count per request type at the top (*All 5 · 3 #Transfers · 2 #Restaurant*). Tapping a type shows only those cases.
  - The cases, grouped by type, with time, client, flag, card type, headline, details, status, priority and who's handling each.
  - Clicking a case opens it, and **Back** returns to the day.

### 4.4 Open cases' calendar
- **Calendar view** (in the side menu) opens a **regular month calendar** over the cases, and clicking it again closes it: the month's name (Instrument Serif) with ← → arrows, the weekdays (Sunday first), then a box for each day.
- **It starts from today:** this month opens on the week with today in it, and the days that have already gone aren't shown (empty boxes keep the weekdays lined up). Today has a blue outline and the word *Today*. The arrows move a month at a time (the next months show in full) and never go back before this month.
- **Each day says how many cases** are needed that day ("1 case", "2 cases", on light blue), counting the cases showing (open ones, with the tools' filters).
- **Picking a day** shows only that day's cases below, the day filled in blue; picking it again, or *All dates*, shows every day. The open calendar and the picked day are part of the address, so Back and a refresh keep them. While it's open, the calendar and the cases scroll together.

---

## 5. Case lists: rows and bars

**Rows** (My tasks, All files): one clean row per case, under column names said once at the top (they stay put while the rows scroll). No squares.

> **No. | Client (card type under it) | Info (request type, headline under it) | Due date | Status | follow-up · email**

1. **#File ID**, light grey, with the **pink Needs attention flag** before it while the case needs attention (a slot keeps the numbers lined up). Pointing at it shows a small **copy** button that copies `#G-1025` (on touch screens it always shows).
2. **Client name** (the only bold text), and under it the **card type**: the little card and its name, Centurion, Platinum or Fly Card (see §1). No flag here.
3. **Info**: the **request type** such as "Transfers", "Restaurant", "Airport VIP" or "Attractions", and under it in grey the case's headline ("Transfer from Paris airport to the hotel"). No picture.
4. **Due date** as 25.09.26 (red when overdue).
5. **Status** as a white pill on a gentle shadow with a **small coloured square** (§14), still a menu to change it.
6. **Two icon buttons:** **add a follow-up** (a speech bubble with a plus, with a small count of follow-ups so far) opens a line under the row to add one without opening the case (*Add* or Enter saves, *Cancel* closes); **email** opens a new email to the client with the case number and request in the subject (greyed out when the client has no email).

- **Look:** each row is a white box floating on a gentle bluish shadow, about 54px tall, 10px apart, with a **short, thin dash in its status colour at the bottom left** (§14); the shadow deepens under the row you point at. Plenty of space between columns; the client and Info get the spare width. Done cases are dimmed.
- **Narrower windows:** a slimmer side menu and tighter columns. **Phones:** file ID and client (with the card) on top, then Info and the date, then the status and the two buttons.
- **Clicking anywhere else on the row** opens the case in the case screen (§6); the My tasks tab, Esc or Back closes it.

**Bars** (Activity): **compact one-line bars**:

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

A case opens as a window that fills the screen beside the rail, which stays visible (a phone uses the whole screen); Back or the Open cases tab closes it. It's laid out in **two columns: the request, and the client card on its right** (on narrower windows and phones the client goes under the request). The follow-ups chat is no longer in the case window; follow-ups are added from a case's square or row. A case also has its own page (`app.html#/case/<id>`, the *Open in new tab* button), titled with the file ID and client (`#G-1025 · Tamar Avraham`), with the same layout.

- **Top bar:** the **tabs** (Open cases and the open cases), plus *Back* when opened from a calendar day and *Open in new tab*. New case is the rail's **+**.
- **The request** (left)
  - **File status** (a dropdown, with the **supplier name(s)** from its bookings) on the left, and the **file ID** (big chip) at the **top right**
  - **The request is written in Hebrew, right to left** (the rest of the app stays in English; Hebrew uses the Heebo font): the **request type in Hebrew** with its line icon (*VIP בשדה* with a plane; הסעה with a car; כרטיסים with a ticket; מסעדה, מלון, מתנות, משלוח…), the case's headline under it in grey, and *עריכה* (edit)
  - Then **one row** with **מדינה** (the country in Hebrew with its flag, or the place as typed) and **תאריך מבוקש** (12.10.26, or a range such as 12–16.10.26; red when overdue). The service type isn't written again: it's the heading
  - Then, on their own lines, the **request type's own details**. *VIP בשדה*: **שם נוסע ראשי** (the client's name until another is typed), **טלפון נוסע ראשי** (the client's phone), **מס׳ נוסעים**, **מס׳ מזוודות**, **מס׳ טיסה**, **שעת המראה** and **שעת מפגש מבוקשת**. *הסעה*: **נוסע ראשי**, **טלפון**, **מס׳ נוסעים**, **מזוודות**, **מס׳ טיסה**, **המראה** and **מפגש עם דייל** (the lead passenger and phone come from the client until other ones are typed). Other types show their count (מס׳ כרטיסים, מס׳ סועדים…). Then **תקציב** (budget). Other types can get their own list the same way
  - **תיאור הפנייה** (description): free text
  - (Location can be a country or free text such as "England / France / Rome"; budget in ₪, $, € or £.)
  - **What they insist on**, on a light blue strip, such as "Seated area only, up to €800 per ticket"
  - **#Hashtags**: the request type plus the case's own (`#Tickets #Oasis #Concert`), saved with the case, and the priority when it's high or urgent
  - **Add reminder**, and the case's reminders (time and text, with a ✓ to mark each done)
  - Handled by, came in by (phone or email), **created by** and when, **last updated** (who and when)
  - Take this case (when it's in the open pool), and *Assign to* for admins
  - **Edit case**: headline, requested from (date and time) and until (an optional last day), description, how many, the request type's own details, location (type a country or anything else), budget, what they insist on, and hashtags (`#Oasis #Concert`, or separated by spaces or commas)
- **The client card** (right)
  - **Client name** in Playfair Display, with the flag (no "Client name" label over it), and **Edit client**
  - Each detail in **its own box**: **card type** and **gender**, then **ID number** with the **phone** beside it, then the **email** across, then the **additional phone** and **additional email**. A phone calls and an email opens one about the case (pre-filled subject). Pointing at a box shows a small **copy** icon (just the icon, no box) ("Not set" when there's none, with nothing to copy)
  - **Additional info**: a free-text box, saved when you leave it
  - **Additional contacts**: other people to reach, each with **name, who they are, phone and email** (for example *Yael · Secretary*, *Dana · Wife*), the phone and email in boxes with copy; *Add contact* adds one and × removes it
  - **Edit client**: gender, card type, ID number, both phones and both emails
  - **Client no.** (`C-2001`) with how many open and total cases the client has
  - **Secondary contact** of this case (Add/Change): who opened it for the client, with phone and email

---

## 7. Follow-ups as a chat (no longer shown in the case window)

- **Timeline:** oldest at the top, newest at the bottom. It opens scrolled to the newest message, with day separators ("Today", "Yesterday", "Tuesday, September 22").
- **Bubbles:** your follow-ups are blue on the right. Other people's are white on the left, with their name and picture. Every message shows its time.
- **Case events** appear as small centred lines between messages ("Daniel opened the case", "You took the case", "You changed the status: Open → Waiting on client").
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

Pictures are Microsoft's Fluent 3D emoji (MIT licence, 256px), loaded from jsDelivr; offline, the plain emoji shows instead. Profile icons chosen from the emoji list use the same 3D pictures.

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
  | Transfers | a real photo of a black Rolls-Royce Phantom (Terry Cohen, Unsplash License) | Pickup |
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
- **Statuses:** Open (the first follow-up moves it on) → Ongoing (*In progress*) → On supplier (*Waiting on supplier*) / On client (*Waiting on client*) → Done. *Done* stamps the completion time.
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
  - Transfers (black Rolls-Royce photo): Assistant, Elite VIP, Blacklane
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
- **Reminders** (box under the side menu): text and time. Past-due reminders use the alert colour, and each can be ticked done. A reminder added from a case belongs to that case and links back to it.
- **Sticky notes** (box under the side menu): coloured notes (yellow, pink, blue, green).
  - **Share** with teammates, when writing a note or later from the note. Shared notes show "Shared with …" to you and "From …" to them.
  - Only the author can delete a note. Recipients can remove it from their own board.
  - This only works within one browser until there's a server.

## 13. Search, Activity, Settings
- **Search:**
  - *Search page* (new tab): case ID, client ID, name, phone or email.
  - *Advanced search*: text, client, status, priority, category, handler, channel, and opened from/until.
- **Activity:**
  - All open cases, with stats and the open pool.
  - *Reports & log*: files per day, team workload heatmap, open cases by priority, files by category, and the full activity log.
- **Settings:**
  - Your icon: photo, emoji or initials; colours; name and initials.
  - Light or dark mode. (The page is always white in light mode; there is no background tint.)
  - Sample data: clear or restore.
  - Log out.

---

## 14. Look and feel

- **Colours**
  - **Primary blue:** `#0067ff` (the brand, buttons, selection, upcoming days)
  - **Status colours** show as a small square (on a white pill with a gentle shadow, on status dropdowns and tags) and on the left edge of every case bar:

    | Status | Colour |
    |---|---|
    | Open | turquoise `#14b8c4` |
    | **Ongoing** | **violet `#7c5cff`** |
    | Waiting on supplier | orange `#ff7a1a` |
    | Waiting on client | blue `#0067ff` (the + blue, like its menu item) |
    | Done / closed | green `#17b26a` |

  - **Red `#ff3350`:** **urgent** (an urgent open case's bar edge is red, and the urgent tag is solid red) and the alert colour: overdue, calendar days not all done, missing invoices, errors.
  - **Softer orange:** high priority
  - **One blue everywhere:** the **+** button's blue (`#0067ff`) with its soft glow is the only strong blue: the active pill tab (Activity's tabs, the filter pills), the Calendar button when open, the case tab you're on, and the picked day's times. Its light version (`#e8f0ff`) marks the side menu's current view, the card that's open, and the picked day.
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
| `team` | id, name, initials, title, role, and icon settings (photo, emoji, tone, colour, dark; `bg` is left over from the old background tint and no longer used) |
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
- (`gustavo_home_view` used to remember the My tasks view; My tasks now always opens on all your tasks)
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
