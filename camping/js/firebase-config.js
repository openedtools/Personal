// ============================================================
// FIREBASE SETUP — fill this in before sharing the site
// ============================================================
//
// Steps:
//  1. Go to https://console.firebase.google.com
//  2. Click "Add project" → name it "josh-vetri-camping" → Continue
//  3. Disable Google Analytics (not needed) → Create project
//  4. Click "</> Web" to add a web app → Register app (any nickname)
//  5. Copy the firebaseConfig object below and paste your values
//  6. In the left sidebar: Build → Firestore Database → Create database
//     → Start in "test mode" → pick any region → Enable
//  7. In Firestore: Rules tab → replace everything with:
//
//       rules_version = '2';
//       service cloud.firestore {
//         match /databases/{database}/documents {
//           match /trips/{tripId} {
//             allow read, write: if true;
//           }
//         }
//       }
//
//     Click "Publish". This lets anyone with the URL read/write — fine
//     for a private group trip. You can tighten it later if needed.
//
// ============================================================

const firebaseConfig = {
  apiKey:            "AIzaSyC9KHeINwy8-Nd47bkNYIzG1exsO4PjwKw",
  authDomain:        "joshua-tree-26.firebaseapp.com",
  projectId:         "joshua-tree-26",
  storageBucket:     "joshua-tree-26.firebasestorage.app",
  messagingSenderId: "615332626266",
  appId:             "1:615332626266:web:82626c55df2892c1bd3d63"
};

firebase.initializeApp(firebaseConfig);
const db       = firebase.firestore();
const TRIP_DOC = db.collection('trips').doc('thanksgiving-2026');

// ============================================================
// BACKUP MIRROR (Google Sheets via Apps Script)
// ------------------------------------------------------------
// Paste the deployed Apps Script Web App URL between the quotes
// below. See camping/backup/README.md for one-time setup. If
// blank, the site works exactly as before — backup is just off.
// ============================================================
const BACKUP_WEBHOOK_URL = '';
const BACKUP_SECRET      = 'desert-turkey-2026';
