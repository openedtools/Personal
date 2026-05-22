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
