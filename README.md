# Mood Diary

Lightweight, client‑side mood & journaling tracker. Pick a mood, jot a note, and watch simple stats build over time — all stored privately in your own browser (localStorage). No backend, no signup.

## Features
- Quick mood selection (😢 😐 😊 😍 🤩)
- Contextual prompts & dynamic button text per mood
- LocalStorage persistence (entries never leave your device)
- Auto “Quote of the Day” (deterministic rotation)
- Animated mood distribution chart
- Entry history with relative dates (Today / Yesterday)
- Delete entries + toast feedback & subtle animations

## Tech Stack
Pure HTML + CSS + Vanilla JS (no dependencies).

## Use It
1. Clone or download.
2. Open `index.html` in a browser (double‑click or drag into a tab). That’s it.

Optional: run a local server for cleaner file URLs.

## Development
All logic lives in `script.js`; styling in `style.css`. Feel free to:
- Add moods (extend `moodConfig`).
- Change quotes (edit `quotes` array).
- Adjust animations or colors in the CSS.

## Data & Privacy
Everything is stored under the key `mood-diary-entries` in `localStorage`. Clearing browser data or using a different browser/device resets the diary.

## Ideas / Next
- Dark mode toggle
- Streaks & insights
- API's for quotes
- Authentication


![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)  ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) 
 ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
---
Made with 💖 — reflect daily and be kind to yourself.
