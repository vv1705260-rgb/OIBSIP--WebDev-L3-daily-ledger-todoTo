## OIBSIP--WebDev-L3-daily-ledger-todoTo
A to-do list web app with add, edit, complete, and delete functionality — organized into pending and completed lists, styled like a paper ledger, with localStorage persistence.

# daily-ledger-todo🗓️

A to-do list web app built with vanilla HTML, CSS, and JavaScript — styled like a page from a paper ledger, where completing a task feels like stamping an entry closed.

## Description

Daily Ledger is a task manager that lets users add, edit, complete, and delete daily tasks, organized into **Pending** and **Completed** columns. Tasks persist across page refreshes using the browser's `localStorage`, so your list is still there the next time you open the app.

## Features

- **Add tasks** — type into the input field and click "Add task" (or press Enter)
- **Pending / Completed lists** — new tasks appear instantly under Pending
- **Mark complete toggle** — a circular "stamp" button moves a task to Completed, with a small stamp animation and an animated strike-through on the text
- **Inline editing** — click the edit (pencil) icon to modify a task's text in place; press Enter to save, Escape to cancel
- **Delete** — permanently remove a task from either list with the trash icon
- **Live counters** — "X pending" and "Y completed" update automatically above each list
- **Timestamps** — every task shows when it was added, and when it was completed
- **Persistence** — tasks are saved to `localStorage` and reloaded automatically on page refresh
- **Empty states** — friendly messages when a list has no tasks yet

## Tech stack

- HTML5
- CSS3 (custom properties, flexbox, grid, keyframe animations)
- Vanilla JavaScript (no frameworks or build step)
- Google Fonts: Fraunces, Inter, IBM Plex Mono

## Project structure

```
daily-ledger-todo/
├── index.html   # Page structure and markup
├── style.css    # Visual design, layout, and animations
├── script.js    # App logic: state, rendering, localStorage persistence
└── README.md    # Project documentation
```

## Getting started

1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser — no build tools, server, or dependencies required.
3. Start adding tasks. They'll be saved automatically in your browser.

## How it works

- All tasks are kept in a single in-memory array, with each task storing an `id`, `text`, `completed` flag, `createdAt` timestamp, and `completedAt` timestamp.
- Every change (add, edit, complete, delete) re-renders the two lists and re-saves the array to `localStorage` under the key `daily-ledger-tasks`.
- On page load, the app reads from `localStorage` first, so previously saved tasks reappear immediately.

## Author

Vaishali🎀

Built as part of the Oasis Infobyte web development internship task series (Task 3 — To-Do Web App).
