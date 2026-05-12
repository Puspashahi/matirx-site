# Matrix

Matrix is a simple fully static command library for **authorized pentesting labs, CTFs, and security training**.

It has:

- Fast search
- Section and category filters
- Pagination
- One-click copy
- Live placeholders like `{{IP}}`, `{{USERNAME}}`, `{{PASSWORD}}`, `{{DOMAIN}}`, `{{LHOST}}`, and `{{PORT}}`
- Browser memory using `localStorage` for placeholders, filters, search, sort, and page size
- No backend, no accounts, no telemetry
- Generated command data from JSON command packs
- CSV export and build stats

## Safety note

Use these commands only on systems you own or have clear permission to test. This project is intended for legal labs, CTFs, coursework, and defensive security training.

## Local run

Because this is static, you can open `index.html` directly. A local server is better:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Rebuild command library

Edit or add JSON files inside `packs/`, then run:

```bash
python3 tools/build.py
```

The build script will:

- Read all `packs/*.json`
- Normalize placeholders
- Remove duplicate commands
- Generate `src/data.js`
- Export `dist/commands.csv`
- Output `dist/stats.json`

## Add a command pack

Create a file like:

```json
[
  {
    "section": "Recon",
    "category": "Port Scanning",
    "title": "Service scan",
    "command": "nmap -sV -p {{PORT}} {{IP}}",
    "description": "Detect service versions in an authorized lab."
  }
]
```

Then rebuild:

```bash
python3 tools/build.py
```

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Upload all project files.
3. Go to **Settings → Pages**.
4. Select branch: `main`.
5. Select folder: `/root`.
6. Save.

Your Matrix site will be live from GitHub Pages.

## Project structure

```text
matrix-site/
├── index.html
├── src/
│   ├── app.js
│   ├── data.js
│   └── styles.css
├── packs/
│   ├── api.json
│   ├── ctf.json
│   ├── linux.json
│   ├── recon.json
│   ├── web.json
│   └── windows.json
├── tools/
│   └── build.py
└── dist/
    ├── commands.csv
    └── stats.json
```
