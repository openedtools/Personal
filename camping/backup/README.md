# Backup mirror setup (Google Sheets)

This is a one-time setup, ~5 minutes. After it's wired up, every time
someone edits a camper, reservation, potluck entry, t-shirt order, or
itinerary day on the site, the data is mirrored to a Google Sheet you
own. If Firestore ever loses data, you can restore from the Sheet.

## What you'll have when this is done

A Google Sheet with these tabs, all written automatically:

- **Campers** — current camper list, one row per camper.
- **Reservations** — current reservations, one row each, with sites
  flattened into a `sites_csv` column (e.g. `25 (Ryan B.), 26`) plus
  a `sites_json` column for exact restore.
- **Potluck**, **T-Shirts**, **Itinerary** — live mirrors.
- **Snapshots** — append-only audit trail; one row per write, with a
  timestamp and the full JSON payload. You can restore from any
  point in time by copying a row's JSON.

## Setup

1. Open https://sheets.google.com and create a blank sheet. Name it
   anything — e.g. "Desert Turkey 2026 — backup".
2. In that sheet, go to **Extensions → Apps Script**.
3. Delete the placeholder `function myFunction()` code.
4. Open `camping/backup/apps-script.gs` in this repo, copy its full
   contents, and paste them into the Apps Script editor.
5. Click the **Save** icon (or Ctrl/Cmd-S). Give the project any name.
6. Click **Deploy → New deployment**.
   - Click the gear icon next to "Select type" and choose **Web app**.
   - Description: `Trip backup mirror`.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Click **Deploy**.
7. The first time, Google will ask you to authorize the script:
   - Click **Authorize access**, pick your account.
   - You'll see a "Google hasn't verified this app" screen — that's
     normal for personal Apps Scripts. Click **Advanced** →
     **Go to (project name) (unsafe)** → **Allow**.
8. Copy the **Web app URL** that's shown (ends in `/exec`).
9. Open `camping/js/firebase-config.js` and paste that URL between
   the quotes:
   ```js
   const BACKUP_WEBHOOK_URL = 'https://script.google.com/.../exec';
   ```
10. Commit and push. Done.

## Verifying it works

- Paste the `/exec` URL into a browser tab. You should see:
  `{"status":"Desert Turkey 2026 backup mirror is live."}`
- On the live site, edit any camper, reservation, potluck, etc.
- Open your Sheet — the tabs should populate within a few seconds.
- Subsequent edits append a new row to the **Snapshots** tab.

## If you want to rotate the secret

The secret stops random web pages from posting garbage to your sheet.
It's not truly secret (it's in the public site code) but it's a
useful sanity check.

To change it: edit the `SECRET` constant in `apps-script.gs` and the
`BACKUP_SECRET` constant in `firebase-config.js` to the same value,
then redeploy the Apps Script (Deploy → Manage deployments → pencil
icon → New version → Deploy).

## How to restore from a snapshot

If Firestore data is lost or corrupted:

1. Open the **Snapshots** tab.
2. Find the row at the time you want to restore to.
3. Copy the JSON in column B.
4. In Firebase Console → Firestore Database → `trips/thanksgiving-2026`,
   paste the fields back in (or use the Firebase CLI / a small script).

Or — easier — open the live mirror tabs (Campers, Reservations, etc.)
and re-enter the data manually on the site.
