<div align="center">
<img src="./frontend/public/logo.png" alt="URLite Logo" width="200" height="200"/>

# URLite - URL Shortener & Analytics Platform
A modern URL shortening service with advanced analytics, QR code generation, and user authentication.

[🌐 Live Demo](https://urlite-kartikk.vercel.app/) | [📖 Documentation](#-overview) | [🚀 Quick Start](#-installation)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC)](https://tailwindcss.com/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

## 🌟 Overview

**URLite** is a powerful URL shortening application that combines simplicity with powerful analytics. It enables users to create short, shareable links, track their performance with detailed analytics, and generate QR codes for easy sharing. Perfect for social media, marketing campaigns, and any situation where you need concise, trackable URLs.

### 🎯 Key Highlights

- **Fast URL Shortening**: Create short links in seconds
- **Advanced Analytics**: Track clicks, referrers, devices, and geographic data
- **QR Code Generation**: Generate QR codes for each shortened URL
- **User Authentication**: Secure login and registration system
- **Dashboard**: Comprehensive view of all your shortened URLs
- **Real-time Statistics**: Live analytics for each link
- **Responsive Design**: Works perfectly on desktop and mobile devices

## ✨ Features

### 🔐 Authentication & User Management

- JWT-based secure authentication
- User registration with email validation
- User login with secure password hashing
- Session management
- Profile management

### 🔗 URL Shortening

- **Create Short Links**: Convert long URLs into short, memorable links
- **Custom Short Codes**: Option to customize the short code
- **Auto-generation**: Automatic short code generation using nanoid
- **Copy to Clipboard**: One-click copy functionality
- **QR Code Integration**: Automatic QR code generation for each URL
- **Original URL Retrieval**: Access original URL from short code
- **URL Validation**: Verify and validate input URLs

### 📊 Advanced Analytics

- **Click Tracking**: Count total clicks on each link
- **Referrer Tracking**: See where clicks are coming from
- **Device Analytics**: Track clicks by device type (Mobile, Desktop, Tablet)
- **Browser Analytics**: Identify which browsers users are using
- **Geographic Data**: Track location of visitors
- **Timestamp Data**: Know when links are clicked
- **User-specific Analytics**: View analytics for your own links
- **Visual Charts**: Interactive charts using Recharts
- **Export Data**: Download analytics data

### 🎨 User Dashboard

- **URL Management**: View, organize, and manage all shortened URLs
- **Quick Actions**: Edit, delete, or copy short links
- **Analytics View**: Detailed view of link performance
- **Filter & Search**: Find links quickly
- **Sorting Options**: Sort by date, clicks, or custom code

### 📱 QR Codes

- **Automatic Generation**: QR codes generated for each short URL
- **QR Preview Modal**: View QR code before sharing
- **Download QR Code**: Save QR code as image
- **Dynamic QR**: Updates if the short link changes

## ⚙️ Tech Stack

### Frontend

```
  Framework: React 19.1 🛠️
  Build Tool: Vite 7.x ⚙️
  Styling: Tailwind CSS v4 🎨
  State Management: Redux Toolkit 📦
  Routing: React Router 7.x 🗺️
  Data Fetching: TanStack React Query 🔌
  Charts: Recharts 📊
  QR Code: qrcode.react 📱
  HTTP Client: Axios 🌐
  Icons: Tailwind Icons 🌟
```

### Backend

```
  Runtime: Node.js 18+ 🟢
  Framework: Express.js 5.x 🚀
  Database: MongoDB + Mongoose 🗄️
  Authentication: JWT (jsonwebtoken) 🔑
  Password Security: Bcryptjs 🔐
  Short Code Generation: nanoid 🔢
  QR Code Generation: qrcode 📱
  User Agent Parsing: ua-parser-js 🖥️
  Security: CORS, Helmet concepts 🔒
```

### DevOps & Deployment

```
Frontend: Vercel 🌐
Backend: Render 🚀
Database: MongoDB Atlas 🗄️
Version Control: Git + GitHub 🧑‍💻
```
## 📸 Screenshots

![Login](frontend/public/login.png)
![Signup](frontend/public/signup.png)
![Homepage](frontend/public/homepage.png)
![Dashboard](frontend/public/dashboard.png)
![Analytics](frontend/public/analytics.png)
![QR Code](frontend/public/qrcode.png)

## 📁 Project Structure

```
URLite/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Url.js                # URL schema
│   │   └── Analytics.js          # Analytics schema
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth/* routes
│   │   ├── urlRoutes.js          # /api/shorten and shortcode routes
│   │   ├── analyticsRoutes.js    # /api/analytics/* routes
│   │   └── qrRoutes.js           # /api/qr/* routes
│   ├── utils/
│   │   ├── generateShortCode.js  # Short code generation logic
│   │   ├── generateToken.js      # JWT token generation
│   │   └── analyticsHelper.js    # Analytics processing helper
│   ├── .env
│   ├── .env.example
│   ├── server.js                 # Entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── logo.png              # Logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── ShortenForm.jsx       # URL shortening form
│   │   │   ├── ShortUrlDisplay.jsx   # Display shortened URL
│   │   │   ├── UrlList.jsx           # List of user's URLs
│   │   │   ├── QrCodeModal.jsx       # QR code modal
│   │   │   └── AnalyticsChart.jsx    # Analytics visualization
│   │   ├── pages/
│   │   │   ├── Home.jsx          # Landing page
│   │   │   ├── Dashboard.jsx     # User dashboard
│   │   │   ├── Analytics.jsx     # Analytics page
│   │   │   ├── Login.jsx         # Login page
│   │   │   └── Register.jsx      # Registration page
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx   # Auth context for state management
│   │   ├── App.jsx               # Root component
│   │   ├── main.jsx              # Entry point
│   │   ├── index.css             # Global styles
│   │   ├── vite.config.js        # Vite configuration
│   │   ├── eslint.config.js      # ESLint configuration
│   │   ├── .env                  # Environment variables
│   │   ├── .env.example          # Environment example
│   │   ├── index.html            # HTML template
│   │   └── package.json
│
├── .gitignore
├── README.md
└── LICENSE
```

## 🚀 Installation

### Prerequisites

- Node.js 18+ and npm
- MongoDB (Local or Atlas)
- Git & GitHub

### 1. Clone Repository

```bash
git clone https://github.com/kartikkkandpal/URLite.git
cd URLite
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/urlite
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urlite

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173
```

Start backend:

```bash
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in frontend:

```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 4. Access Application

Open browser: `http://localhost:5173`

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### URL Management
- `POST /api/shorten` - Create shortened URL
- `GET /api/urls` - Get user's shortened URLs
- `GET /api/urls/:id` - Get specific URL details
- `PUT /api/urls/:id` - Update shortened URL
- `DELETE /api/urls/:id` - Delete shortened URL
- `GET /:shortCode` - Redirect to original URL

### Analytics
- `GET /api/analytics/:urlId` - Get analytics for specific URL
- `GET /api/analytics` - Get all analytics for user

### QR Codes
- `GET /api/qr/:shortCode` - Generate QR code for short link

## 🤝 Contributing

I welcome contributions! Please follow these guidelines:

### How to Contribute

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m "Add amazing feature"`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 👤 Author

Designed and Developed with 💖 by **Kartik Kandpal**

🔗 **Connect with me:**

- 📧 [Email](mailto:kartikkandpal@gmail.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/kartikkkandpal/)
- 🌐 [Portfolio](https://kartikkkandpaldev.vercel.app/)

📬 Feel free to reach out for questions, suggestions, or collaboration!

## 📄 License

This project is licensed under the **MIT License**.