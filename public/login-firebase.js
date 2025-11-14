import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup, 
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR59j50bM6ufEu29ROT0CwHNs9BrPrIHQ",
  authDomain: "oauth-d3a17.firebaseapp.com",
  projectId: "oauth-d3a17",
  storageBucket: "oauth-d3a17.appspot.com",
  messagingSenderId: "240226710966",
  appId: "1:240226710966:web:91d64abfb67cffd1083d17",
  measurementId: "G-YPC9CPEZYM"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Prevent redirect loops
let loginAuthChecked = false;
let loginRedirecting = false;

// Check if user is already logged in
onAuthStateChanged(auth, (user) => {
  // Prevent multiple checks
  if (loginAuthChecked) return;
  loginAuthChecked = true;
  
  if (user) {
    // User is already logged in, redirect to dashboard (only if not already on dashboard)
    const currentPath = window.location.pathname;
    const isDashboardPage = currentPath.includes('dashboard.html') || currentPath.endsWith('/dashboard.html') || currentPath === '/dashboard.html';
    
    if (!loginRedirecting && !isDashboardPage) {
      loginRedirecting = true;
      console.log("User already logged in, redirecting to dashboard...");
      window.location.href = "/dashboard.html";
    }
  }
});

// Switch between login and signup forms
window.switchToSignup = function() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
};

window.switchToLogin = function() {
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
};

// Login Form Handler
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const loginBtn = document.getElementById("loginBtn");
  
  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }
  
  try {
    loginBtn.disabled = true;
    loginBtn.classList.add("loading");
    loginBtn.textContent = "Logging in";
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    showToast(`Welcome back, ${user.email}!`, "success");
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 1000);
    
  } catch (error) {
    console.error("Login error:", error);
    let errorMessage = "Login failed. Please try again.";
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = "No account found with this email. Please sign up.";
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = "Incorrect password. Please try again.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Invalid email address.";
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = "Invalid email or password.";
    }
    
    showToast(errorMessage, "error");
    loginBtn.disabled = false;
    loginBtn.classList.remove("loading");
    loginBtn.textContent = "🔓 Login";
  }
});

// Signup Form Handler
document.getElementById("signupForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value.trim();
  const signupBtn = document.getElementById("signupBtn");
  
  if (!email || !password) {
    showToast("Please fill in all fields", "error");
    return;
  }
  
  if (password.length < 6) {
    showToast("Password must be at least 6 characters", "error");
    return;
  }
  
  try {
    signupBtn.disabled = true;
    signupBtn.classList.add("loading");
    signupBtn.textContent = "Creating Account";
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    showToast("Account created successfully!", "success");
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 1000);
    
  } catch (error) {
    console.error("Signup error:", error);
    let errorMessage = "Signup failed. Please try again.";
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = "Email already in use. Please login instead.";
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = "Invalid email address.";
    } else if (error.code === 'auth/weak-password') {
      errorMessage = "Password is too weak. Use at least 6 characters.";
    }
    
    showToast(errorMessage, "error");
    signupBtn.disabled = false;
    signupBtn.classList.remove("loading");
    signupBtn.textContent = "✨ Create Account";
  }
});

// Google Sign In Handler
document.getElementById("googleSignupBtn").addEventListener("click", async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    showToast(`Welcome, ${user.displayName || user.email}!`, "success");
    
    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "/dashboard.html";
    }, 1000);
    
  } catch (error) {
    console.error("Google sign in error:", error);
    let errorMessage = "Google sign in failed. Please try again.";
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = "Sign in cancelled.";
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = "Popup was blocked. Please allow popups and try again.";
    }
    
    showToast(errorMessage, "error");
  }
});

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

