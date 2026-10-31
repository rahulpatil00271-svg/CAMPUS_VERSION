# Campus Explorer

## Project overview
Campus Explorer helps college students discover clubs, events, workshops and useful resources in one place. The site owner can manage all content from an in-browser Admin dashboard, with no code changes. Built as a first-year GDG interview project with plain HTML, CSS and JavaScript.

> All clubs, events and registrations that ship with the project are **demo content**, not official college information.

## Main objectives
- Practise semantic HTML, responsive CSS and vanilla JavaScript
- Show CRUD (create, read, update, delete) with persistent data
- Keep the code readable enough to explain line by line

## Features
- Responsive navbar with hamburger menu and active-section highlighting
- Hero with live search and statistics that update with your content
- Club and event cards with category filters, search and detail modals
- Event registration form with validation and a confirmation message
- Resources section with external links opening in a new tab
- Admin dashboard: overview, club, event and resource management, website settings, reset demo data

## Technologies used
HTML5, CSS3 (Grid and Flexbox), vanilla JavaScript, Google Fonts (Bricolage Grotesque, Source Sans 3), Lucide icons (CDN), LocalStorage.

## Folder structure
```
campus-explorer/
├── index.html
├── style.css
├── script.js
├── README.md
├── .gitignore
└── assets/
    ├── images/
    └── icons/
```
`assets` holds `.gitkeep` files so the empty folders upload to GitHub.

## Installation and running locally
No installation is needed.
1. Download or clone the project.
2. Double-click `index.html`, or in VS Code use the Live Server extension, or run `python -m http.server` and open http://localhost:8000.

You need internet access for the fonts and icons.

## How search and filtering work
- Search splits what you type into words. An item matches if **every word** appears in its text (case-insensitive).
- Filter chips keep items whose category or tags contain the chosen keyword.
- Both run on the same lists, so search and filter combine. Resources respond to search only.

## How LocalStorage works
On first load the demo data is saved under the key `campus_explorer_v2`. Every admin change updates it, and every page load reads it back. Data stays in your browser only. Clearing site data or using **Reset demo data** restores the sample content.

## Admin dashboard
Open the **Admin** link in the navbar (or go to `index.html#admin`).

| Task | Where |
|---|---|
| Add a club | Admin → Clubs → Add club → fill the form → Save |
| Edit a club | Admin → Clubs → Edit next to the club |
| Delete a club | Admin → Clubs → Delete → confirm |
| Add or manage events | Admin → Events (date, time, venue, category, status, registration info) |
| Manage resources | Admin → Resources |
| Customise hero, About, images and links | Admin → Settings |
| Restore sample data | Admin → Overview → Reset demo data |

Images accept a link or an uploaded file under 400 KB, with a preview before saving.

## GitHub upload instructions
1. Create an empty repository on github.com (no README).
2. Open the project folder in VS Code.
3. In the terminal:
```bash
git init
git add .
git commit -m "Initial commit: Campus Explorer"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```
4. **GitHub Pages:** repository → Settings → Pages → Source: *Deploy from a branch* → branch `main`, folder `/ (root)` → Save. The site appears after a minute or two.

Make sure `index.html` is at the top level of the repository, not inside another folder.

## Future improvements
Real login and a database (Firebase or Supabase), event images, calendar view, email confirmations, saved favourites.

## Known limitations
- The admin has **no real authentication**. LocalStorage is not secure, and a real admin needs a backend with authentication, authorization and a database.
- Data is per-browser and per-device, and not shared between visitors.
- Registrations are stored in the browser only and are not sent to any organiser.
- Large uploaded images can fill LocalStorage.

## Screenshots
_Add your own screenshots here after running the project, for example `![Home](assets/images/home.png)`._

## Author and credits
Author: _your name_. Icons by [Lucide](https://lucide.dev). Fonts from Google Fonts. Visual inspiration only from editorial college sites; no branding or code was copied.
