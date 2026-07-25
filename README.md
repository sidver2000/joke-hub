# Joke Hub

A simple static website for browsing and sharing jokes.

## What’s included

- `index.html` — page structure and joke UI
- `styles.css` — responsive styling
- `script.js` — random joke display, local storage, and form handling

## Usage

1. Open `index.html` in your browser.
2. Click **Show random joke** to view a joke.
3. Add your own jokes using the form.

## Installation

Windows users can install the site locally by running one of the following:

- Double-click `install.cmd`
- Or run `powershell -ExecutionPolicy Bypass -File .\install.ps1`

The installer copies the site files into a local folder (default: `~/JokeHub`), creates a desktop shortcut, and adds a launcher that opens the site in your browser.

## Notes

- Jokes are saved in the browser's `localStorage`.
- This project is intentionally lightweight and works without a server.
