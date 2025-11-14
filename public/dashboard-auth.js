import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase configuration (using your Firebase project)
const firebaseConfig = {
  apiKey: "AIzaSyCvjEzgvggdqFj_c3cjrhBUbwKxnfRR-f4",
  authDomain: "oauth-47e7f.firebaseapp.com",
  projectId: "oauth-47e7f",
  storageBucket: "oauth-47e7f.firebasestorage.app",
  messagingSenderId: "658592373814",
  appId: "1:658592373814:web:50bd952954e186c4e38c97",
  measurementId: "G-6LFDC2WYYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Prevent redirect loops
let authChecked = false;
let redirecting = false;

// Check authentication state
onAuthStateChanged(auth, (user) => {
  // Prevent multiple checks
  if (authChecked) return;
  authChecked = true;
  
  const userDisplayName = document.getElementById("userDisplayName");
  
  if (user) {
    // User is signed in - display user name
    if (userDisplayName) {
      const displayName = user.displayName || user.email?.split('@')[0] || "User";
      userDisplayName.textContent = displayName;
      userDisplayName.style.display = "inline";
    }
    
    // Store user data for use in other scripts
    window.currentUser = user;
    console.log("User logged in:", user.email);
  } else {
    // User is not signed in - redirect to login (only if not already redirecting or on login page)
    const currentPath = window.location.pathname;
    const isLoginPage = currentPath.includes('login.html') || currentPath.endsWith('/login.html') || currentPath === '/login.html';
    
    if (!redirecting && !isLoginPage) {
      redirecting = true;
      console.log("No user logged in, redirecting to login...");
      window.location.href = "/login.html";
    }
  }
});

// Function to navigate to profile page
window.goToProfile = function() {
  const user = auth.currentUser;
  if (user) {
    window.location.href = "/profile.html";
  } else {
    // Redirect to login if not authenticated
    window.location.href = "/login.html";
  }
};

