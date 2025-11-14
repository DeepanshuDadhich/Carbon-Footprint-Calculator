import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { 
  getAuth, 
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  deleteUser
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase configuration
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
const analytics = getAnalytics(app);
const auth = getAuth(app);

// Check authentication state
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    displayUserInfo(user);
    await loadUserStatistics();
  } else {
    // User is not signed in, redirect to login
    window.location.href = "/login.html";
  }
});

// Display user information
function displayUserInfo(user) {
  // User name
  const userName = user.displayName || "Anonymous User";
  document.getElementById("userName").textContent = userName;
  
  // User email
  document.getElementById("userEmail").textContent = user.email || "No email";
  
  // User ID
  document.getElementById("userId").textContent = user.uid.substring(0, 20) + "...";
  
  // User initials for avatar
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  document.getElementById("userInitials").textContent = initials || "U";
  
  // User avatar (if from Google)
  if (user.photoURL) {
    document.getElementById("userAvatar").src = user.photoURL;
    document.getElementById("userAvatar").style.display = "block";
    document.getElementById("avatarPlaceholder").style.display = "none";
  }
  
  // Auth provider
  const providerData = user.providerData;
  let authProvider = "Email";
  if (providerData.length > 0) {
    const providerId = providerData[0].providerId;
    if (providerId === "google.com") {
      authProvider = "Google";
    } else if (providerId === "password") {
      authProvider = "Email/Password";
    }
  }
  document.getElementById("authProvider").textContent = authProvider;
  
  // Email verified
  const emailVerifiedBadge = user.emailVerified 
    ? '<span class="badge badge-verified">✓ Verified</span>'
    : '<span class="badge badge-pending">Not Verified</span>';
  document.getElementById("emailVerified").innerHTML = emailVerifiedBadge;
  
  // Hide verify email button if already verified
  if (user.emailVerified) {
    document.getElementById("verifyEmailBtn").style.display = "none";
  }
  
  // Last sign in
  if (user.metadata.lastSignInTime) {
    const lastSignIn = new Date(user.metadata.lastSignInTime);
    document.getElementById("lastSignIn").textContent = formatDate(lastSignIn);
  }
  
  // Account created
  if (user.metadata.creationTime) {
    const creationTime = new Date(user.metadata.creationTime);
    document.getElementById("accountCreated").textContent = formatDate(creationTime);
    
    // Calculate account age
    const accountAgeDays = Math.floor((Date.now() - creationTime.getTime()) / (1000 * 60 * 60 * 24));
    document.getElementById("accountAge").textContent = `${accountAgeDays} days`;
  }
}

// Load user statistics from the API
async function loadUserStatistics() {
  try {
    const statsResponse = await fetch('/api/emissions/statistics');
    const statsData = await statsResponse.json();
    
    if (statsData.success) {
      const stats = statsData.data;
      
      // Update statistics cards
      document.getElementById("userTotalEmissions").textContent = 
        `${stats.total_emissions_kg.toFixed(2)} kg`;
      
      document.getElementById("userTotalActivities").textContent = 
        stats.total_activities;
      
      // Calculate offset amount
      const offsetCost = (parseFloat(stats.total_emissions_kg) / 1000 * 15).toFixed(2);
      document.getElementById("offsetAmount").textContent = `$${offsetCost}`;
    }
  } catch (error) {
    console.error('Error loading statistics:', error);
    // Keep default values if API call fails
  }
}

// Logout function
window.logout = async function() {
  if (confirm("Are you sure you want to logout?")) {
    try {
      await signOut(auth);
      showToast("Logged out successfully!", "success");
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 1000);
    } catch (error) {
      showToast(`Logout failed: ${error.message}`, "error");
    }
  }
};

// Send verification email
window.sendVerificationEmail = async function() {
  const user = auth.currentUser;
  
  if (!user) {
    showToast("No user is signed in", "error");
    return;
  }
  
  if (user.emailVerified) {
    showToast("Your email is already verified!", "success");
    return;
  }
  
  try {
    await sendEmailVerification(user);
    showToast("Verification email sent! Please check your inbox.", "success");
  } catch (error) {
    showToast(`Error: ${error.message}`, "error");
  }
};

// Reset password
window.resetPassword = async function() {
  const user = auth.currentUser;
  
  if (!user || !user.email) {
    showToast("No email associated with this account", "error");
    return;
  }
  
  if (confirm(`Send password reset email to ${user.email}?`)) {
    try {
      await sendPasswordResetEmail(auth, user.email);
      showToast("Password reset email sent! Check your inbox.", "success");
    } catch (error) {
      showToast(`Error: ${error.message}`, "error");
    }
  }
};

// Delete account
window.deleteAccount = async function() {
  const confirmation = prompt(
    'This action cannot be undone! Type "DELETE" to confirm account deletion:'
  );
  
  if (confirmation === "DELETE") {
    const user = auth.currentUser;
    
    if (!user) {
      showToast("No user is signed in", "error");
      return;
    }
    
    try {
      await deleteUser(user);
      showToast("Account deleted successfully", "success");
      setTimeout(() => {
        window.location.href = "/login.html";
      }, 1500);
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        showToast("Please logout and login again before deleting your account", "error");
      } else {
        showToast(`Error: ${error.message}`, "error");
      }
    }
  } else if (confirmation !== null) {
    showToast("Account deletion cancelled", "error");
  }
};

// Go back to dashboard
window.goBack = function() {
  window.location.href = "/dashboard.html";
};

// Format date
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.className = 'toast';
  }, 3000);
}

