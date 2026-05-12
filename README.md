# MATRIX

> Static command library for authorized pentesting labs, CTFs, and cybersecurity training.

![Matrix Banner](https://img.shields.io/badge/MATRIX-Command%20Library-00ff88?style=for-the-badge)
![Static Site](https://img.shields.io/badge/Static-Website-black?style=for-the-badge)
![Security](https://img.shields.io/badge/Cybersecurity-Training-0f0f0f?style=for-the-badge)

---

## Overview

MATRIX is a fully static cybersecurity command library built for:

- Authorized penetration testing
- CTF practice
- Security training labs
- Red team learning
- Quick command lookup

The project works completely offline and can run locally or on GitHub Pages without any backend, accounts, analytics, or telemetry.

---

# Features

- Fast command search
- Live placeholder replacement
- Section & category filters
- Pagination system
- One-click command copy
- Local browser storage memory
- Fully static architecture
- GitHub Pages compatible
- CSV export support
- Generated command database
- Duplicate cleanup
- Placeholder normalization
- Command statistics generation

---

# Live Placeholder System

Commands automatically update in real time when values are entered.

Supported placeholders:

```text
{{IP}}
{{PORT}}
{{DOMAIN}}
{{USERNAME}}
{{PASSWORD}}
{{LHOST}}
{{RHOST}}
```

Example:

```bash
nmap -sV {{IP}} -p {{PORT}}
```

Input:

```text
IP = 10.10.10.5
PORT = 80
```

Result:

```bash
nmap -sV 10.10.10.5 -p 80
```

All matching commands update instantly across the site.

---

# Project Structure

```text
matrix/
│
├── index.html
├── style.css
├── app.js
│
├── data/
│   ├── commands.json
│   ├── commands.csv
│   └── stats.json
│
├── packs/
│   ├── recon.json
│   ├── web.json
│   ├── api.json
│   ├── windows.json
│   ├── linux.json
│   └── ctf.json
│
├── build.py
├── README.md
└── assets/
```

---

# Local Usage

## Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/matrix.git
cd matrix
```

---

## Run Locally

### Option 1 — Open Directly

Open:

```text
index.html
```

in your browser.

---

### Option 2 — Python HTTP Server

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

---

# Build Command Database

Whenever command packs are updated:

```bash
python3 build.py
```

The build script will:

- Merge command packs
- Remove duplicates
- Normalize placeholders
- Generate command database
- Export CSV
- Generate statistics

---

# GitHub Pages Deployment

Push the project:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/matrix.git
git push -u origin main
```

Enable GitHub Pages:

- Repository Settings
- Pages
- Deploy from branch
- Select `main` and `/root`

Your static site will be live.

---

# Sample Sections

- Recon
- Enumeration
- Web Testing
- API Testing
- Linux
- Windows
- Privilege Escalation
- Active Directory
- CTF
- Networking

---

# Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- Python

No frameworks.
No backend.
No tracking.

---

# Safety Notice

This project is intended ONLY for:

- Authorized security testing
- Educational labs
- CTF environments
- Systems you own or have permission to assess

Do NOT use these commands against unauthorized targets.

The author is not responsible for misuse.

---

# Future Ideas

- Dark/Light themes
- Tag system
- Import custom packs
- Offline PWA mode
- Keyboard shortcuts
- Favorite commands
- Markdown export
- Advanced filtering

---

# Author

BATIST  
Cybersecurity Student • Offensive Security Learner • Bug Bounty Hunter

GitHub:
```text
https://github.com/Puspashahi
```

LinkedIn:
```text
https://www.linkedin.com/in/puspa-shahi-224987285/
```

---

