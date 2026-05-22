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
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db       = firebase.firestore();
const TRIP_DOC = db.collection('trips').doc('thanksgiving-2026');
