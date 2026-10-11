# Developer Resource Hub

A small dashboard to find, search and recommend developer tools, sites and tutorials. Built for the GDG on Campus AITR web developer recruitment task (Task 3).

**Live demo:** developer-resource-hub-lac.vercel.app

## Features

- Resource cards with title, description, category and link
- Filter by category (Web Dev, App Dev, AI/ML, Tools)
- Live search that updates as you type
- Add a resource with a simple form (with link validation)
- Saved data: resources persist after refresh using `localStorage`
- Upvote button, one vote per visitor per resource (click again to undo)
- Dark / light mode toggle that remembers your choice
- Responsive layout for mobile and desktop

## Tech stack

HTML, CSS and vanilla JavaScript. No frameworks and no build step.

## Setup

1. Clone the repo: `git clone https://github.com/pranayg7164/gdg-recruitment-task`
2. Open `index.html` in a browser. That's it.

## How it works

- `index.html`: page structure and the add-resource form
- `style.css`: layout and light/dark theme using CSS variables
- `script.js`: keeps a `resources` array, filters and sorts it on every search or filter change, redraws the cards, and saves the array to `localStorage` after each change

## Deploy

Import the repo on [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Framework preset: "Other", no build command needed.
