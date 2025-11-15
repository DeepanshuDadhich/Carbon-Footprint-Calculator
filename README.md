# 🌍 CalCarbo - Carbon Footprint Calculator

A full-stack web application that helps users track, calculate, and visualize their carbon emissions from various daily activities using real-time API integration with Climatiq.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Team](#team)

## ✨ Features

### 🔐 Authentication
- Email/Password authentication
- Google Sign-In integration
- Secure session management
- User profile management

### 📊 Emission Calculations
Supports 5 activity types:
- ⚡ **Electricity Usage** - Track energy consumption
- 🚗 **Travel** - Calculate emissions from car, bus, train, or plane
- 📦 **Freight/Shipping** - Logistics and shipping emissions
- 🛒 **Procurement** - Purchase-based emissions
- ⛽ **Fuel Consumption** - Direct fuel emissions

### 📈 Data Visualization
- **Daily Emissions Chart** - 7-day trend visualization
- **Weekly Emissions Chart** - 4-week aggregation
- **Activity Breakdown Chart** - Pie chart by activity type
- Interactive charts with Chart.js

### 📊 Statistics & Analytics
- Total CO₂e emissions (kg & tons)
- Total activities tracked
- Daily average emissions
- Activity breakdown by category
- Estimated carbon offset cost

### 💾 Data Persistence
- Client-side storage using localStorage
- Data persists across page reloads
- Activity history tracking

## 🛠️ Tech Stack

### Frontend
- **HTML5/CSS3/JavaScript** - Core web technologies
- **Chart.js** - Data visualization library
- **Firebase Authentication** - User authentication
- **localStorage** - Client-side data persistence

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web server framework
- **Netlify Functions** - Serverless backend (production)
- **Axios** - HTTP client for API calls

### External APIs
- **Climatiq API** - Real-time carbon emission calculations
- **Gold Standard API** - Carbon offset project suggestions

### Deployment
- **Netlify** - Static site hosting and serverless functions

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **Git** (for cloning the repository)

You'll also need:
- **Climatiq API Key** - Get it from [https://www.climatiq.io/](https://www.climatiq.io/)
- **Firebase Project** - Create one at [https://console.firebase.google.com/](https://console.firebase.google.com/)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Carbon-Footprint-Calculator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the environment template file:

```bash
# On Windows (PowerShell)
Copy-Item ENV_TEMPLATE.txt .env

# On Linux/Mac
cp ENV_TEMPLATE.txt .env
```

Edit `.env` and add your API keys:

```env
PORT=3000
CLIMATIQ_API_KEY=your_actual_climatiq_api_key_here
CLIMATIQ_API_URL=https://api.climatiq.io
GOLD_STANDARD_API_KEY=your_gold_standard_api_key_here
GOLD_STANDARD_API_URL=https://api.goldstandard.org
NODE_ENV=development
```

### 4. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication:
   - Go to Authentication → Sign-in method
   - Enable Email/Password
   - Enable Google Sign-In
3. Copy your Firebase configuration
4. Update the following files with your Firebase config:
   - `public/login-firebase.js`
   - `public/dashboard-auth.js`
   - `public/profile-firebase.js`

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};
```

## 💻 Usage

### Local Development

#### Option 1: Using npm scripts

```bash
# Start development server (with auto-reload)
npm run dev

# Or start production server
npm start
```

#### Option 2: Using batch files (Windows)

```bash
# Development mode
start-dev.bat

# Production mode
start.bat
```

The application will be available at `http://localhost:3000`

### Using the Application

1. **Sign Up / Login**
   - Visit `http://localhost:3000`
   - Create an account or sign in with Google
   - You'll be redirected to the dashboard

2. **Calculate Emissions**
   - Select an activity type (Electricity, Travel, etc.)
   - Fill in the required fields
   - Click "Calculate Emission"
   - View results on the results page

3. **View Statistics**
   - Click "View Results" button
   - See your total emissions
   - View interactive charts
   - Check activity history

4. **Manage Profile**
   - Click "Profile" button
   - View account information
   - Logout or manage account settings

## 📁 Project Structure

```
Carbon-Footprint-Calculator/
├── public/                 # Frontend files
│   ├── *.html            # HTML pages (login, dashboard, results, profile)
│   ├── *.js              # Frontend JavaScript files
│   ├── *.css             # Stylesheets
│   └── storage.js        # Client-side storage wrapper
├── services/              # Backend services
│   ├── climatiqService.js    # Climatiq API integration
│   ├── goldStandardService.js # Gold Standard API integration
│   └── dataStore.js         # In-memory data storage
├── routes/                 # Express routes (local dev)
│   ├── emissions.js      # Emission calculation routes
│   └── offsets.js         # Offset suggestion routes
├── netlify/
│   └── functions/        # Netlify Functions (production)
│       ├── emissions-calculate.js
│       ├── emissions-statistics.js
│       ├── emissions-history.js
│       ├── emissions-daily.js
│       ├── emissions-weekly.js
│       └── offsets-total.js
├── server.js             # Express server (local development)
├── netlify.toml          # Netlify configuration
├── package.json          # Dependencies
└── .env                  # Environment variables (create from ENV_TEMPLATE.txt)
```

## 🔌 API Endpoints

### Emission Calculation
```
POST /api/emissions/calculate
Body: {
  activity_type: "electricity" | "travel" | "freight" | "procurement" | "fuel",
  // ... activity-specific parameters
}
```

**Example Request (Electricity):**
```json
{
  "activity_type": "electricity",
  "energy": 100,
  "energy_unit": "kWh",
  "region": "US",
  "year": 2021
}
```

**Example Response:**
```json
{
  "success": true,
  "message": "Emission calculated successfully",
  "data": {
    "co2e_kg": 12.5,
    "co2e_unit": "kg",
    "co2e_calculation_method": "ar4"
  }
}
```

### Statistics
```
GET /api/emissions/statistics
Returns: Total emissions, activity count, averages
```

### History
```
GET /api/emissions/history
Returns: List of all emission records
```

### Daily Aggregation
```
GET /api/emissions/daily?days=7
Returns: Daily aggregated emissions
```

### Weekly Aggregation
```
GET /api/emissions/weekly?weeks=4
Returns: Weekly aggregated emissions
```

### Offset Suggestions
```
GET /api/offsets/total
Returns: Offset cost and project suggestions
```

## 🚀 Deployment

### Deploy to Netlify

1. **Push to Git Repository**
   ```bash
   git add .
   git commit -m "Deploy to Netlify"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your repository

3. **Configure Build Settings**
   - Build command: `echo 'No build step needed for static files'`
   - Publish directory: `public`
   - Functions directory: `netlify/functions`

4. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add:
     - `CLIMATIQ_API_KEY` (Required)
     - `CLIMATIQ_API_URL` (Optional, defaults to https://api.climatiq.io)
     - `GOLD_STANDARD_API_KEY` (Optional)
     - `GOLD_STANDARD_API_URL` (Optional)

5. **Deploy**
   - Netlify will automatically deploy on every push
   - Your site will be available at `https://your-site.netlify.app`

### Important Notes

- **Netlify Functions are stateless** - Data doesn't persist between function calls
- We use **localStorage** on the frontend to persist data
- For production, consider using a database (MongoDB, PostgreSQL) for cross-device persistence

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration and login
- [ ] Google Sign-In
- [ ] All 5 activity type calculations
- [ ] Chart rendering
- [ ] Data persistence across page reloads
- [ ] Authentication flow
- [ ] Error handling
- [ ] Responsive design

### API Testing

Use the provided `postman_collection.json` file to test API endpoints in Postman.

## 🐛 Troubleshooting

### Issue: API returns 404 errors
**Solution**: Make sure your Netlify Functions are properly deployed and environment variables are set in Netlify dashboard.

### Issue: Authentication redirect loops
**Solution**: Check that Firebase configuration is correct in all auth files (`login-firebase.js`, `dashboard-auth.js`, `profile-firebase.js`) and redirect flags are working properly.

### Issue: Data not persisting
**Solution**: localStorage is browser-specific. Clear browser cache if needed, or implement a database for cross-device sync.

### Issue: Climatiq API errors
**Solution**: 
- Verify your API key is correct in `.env` file (local) or Netlify environment variables (production)
- Check the activity IDs match Climatiq's current format
- Ensure `data_version: '^27'` is included in requests

### Issue: PowerShell execution policy error (Windows)
**Solution**: Run this command in PowerShell as Administrator:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Or use the provided `.bat` files instead.

## 🔧 Development

### Key Files Explained

- **`server.js`** - Express server for local development
- **`services/climatiqService.js`** - Main service for Climatiq API integration
- **`netlify/functions/emissions-calculate.js`** - Serverless function for production
- **`public/storage.js`** - Client-side localStorage wrapper
- **`public/app.js`** - Frontend logic for dashboard
- **`public/results.js`** - Frontend logic for results page

### How It Works

1. User fills form on dashboard → Frontend sends POST request
2. Netlify Function receives request → Routes to appropriate service
3. ClimatiqService formats data → Sends to Climatiq API
4. API returns CO₂e value → Saved to localStorage
5. Results page displays data → Reads from localStorage and shows charts

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Team

**Team 39**  
Polaris School of Technology

## 🙏 Acknowledgments

- [Climatiq](https://www.climatiq.io/) - For providing the carbon emission calculation API
- [Gold Standard](https://www.goldstandard.org/) - For carbon offset project data
- [Firebase](https://firebase.google.com/) - For authentication services
- [Chart.js](https://www.chartjs.org/) - For data visualization
- [Netlify](https://www.netlify.com/) - For hosting and serverless functions

## 📞 Support

For support, email support@calcarbo.com or open an issue in the repository.

## 🔮 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User-specific data storage
- [ ] Export functionality (CSV/PDF)
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Social sharing features
- [ ] Team/organization features
- [ ] Advanced analytics and insights
- [ ] Real-time offset purchasing
- [ ] Historical data analysis

## 📚 Additional Resources

- [Climatiq API Documentation](https://www.climatiq.io/docs)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)

---

**Made with ❤️ for a sustainable future**

