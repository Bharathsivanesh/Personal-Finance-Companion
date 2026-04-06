# 📱 Personal Finance Companion App

## 🚀 Overview

This is a mobile application built as part of the Zorhyn Mobile Developer Internship assignment. The app is designed to help users track their daily financial activities in a simple, structured, and engaging way.

The focus of this project is not just functionality, but **product thinking, clean architecture, and smooth user experience**.

---

## 🧠 Product Thinking

This app is built as a **lightweight personal finance companion**, not a banking app.

It helps users:

* Track income and expenses
* Understand spending patterns
* Monitor savings
* Build financial habits (streaks & goals)
* Get insights using AI

---

## 🛠️ Tech Stack

### Frontend

* React Native (Expo)
* NativeWind (Tailwind for React Native)
* React Native Paper (UI Components)

### State Management

* Context API
* Custom Hooks

### Backend & Database

* Firebase Authentication (Email/Password)
* Firestore (Database)

### Storage

* Supabase (Receipt Image Storage)

### Charts & Visualization

* React Native Charts

---

## 📂 Folder Structure (Feature-Based)

```
src/
 ├── features/
 │    ├── auth/
 │    ├── transactions/
 │    ├── dashboard/
 │    ├── insights/
 │    ├── profile/
 │    └── ai/
 │
 ├── components/
 ├── hooks/
 ├── context/
 ├── services/
 ├── utils/
 └── constants/
```

---

## 🔄 App Flow

1. Splash Screen
2. Login / Signup
3. Home Dashboard
4. Add Transaction (Modal)
5. Transaction History
6. Insights Screen
7. Profile Screen
8. AI Assistant

---

## ✨ Features

### 🏠 Home Dashboard

* Current Balance
* Total Income
* Total Expenses
* Savings Overview
* Recent Transactions
* Weekly/Monthly Filters
* Visual Charts (Income vs Expense)

---

### 💸 Transaction Management

* Add Transaction (Income / Expense / Transfer)
* Edit & Delete
* Category selection
* Date & Notes
* Receipt Upload (via Supabase)

#### Filters:

* Type: All / Income / Expense / Transfer
* Time: Today / Week / Month / All

---

### 📊 Insights Screen

* Category Breakdown
* Income vs Expense Trend
* Top Spending Category
* Weekly & Monthly Comparisons

---

### 🎯 Unique Feature (Streak System)

* Tracks daily financial activity
* Encourages consistent usage
* Visual heatmap-style tracking

---

### 🤖 AI Assistant

* Chat-based interface
* Answers based on user financial data
* Quick prompts:

  * "Where did I spend the most?"
  * "How can I save more?"
  * "Show my spending breakdown"

---

### 👤 Profile Screen

* User details
* App settings
* Logout

---

## 🔐 Authentication

### Implemented:

* Email & Password (Firebase Auth)

### Attempted:

* Google OAuth (Not fully working due to redirect URI issue)

> Issue: 401 Unauthorized (Authorized redirect URIs mismatch)

---

## ⚡ Performance Optimizations

* Custom hooks to avoid unnecessary API calls
* Firestore indexing for faster queries
* Efficient state updates
* Lazy data refresh mechanism

---

## 🧪 Testing Strategy

* Unit-level testing (logic validation)
* UI testing (manual)
* Performance testing
* UX testing

---

## 🎨 UI/UX Considerations

* Clean and minimal design
* Touch-friendly interactions
* Smooth navigation
* Empty states
* Loading indicators
* Error handling
* Toast messages

---

## 🔄 Development Workflow

Followed a production-level Git workflow:

* main → production
* staging → testing
* feature branches → development

Flow:

1. Create feature branch
2. Merge into staging
3. Test in staging
4. Merge to production

---

## 🧩 Challenges Faced

* Firebase Web SDK configuration issues
* Firestore query optimization
* Supabase storage policies
* Google OAuth redirect URI errors

---

## 📦 Installation & Setup

```bash
npm install
npx expo start
```

---

## 📸 Screenshots & Demo

(Add screenshots here)

* Splash Screen
* Login / Signup
* Dashboard
* Transactions
* Insights
* AI Assistant

---

## 📹 Demo Video

(Add video link here)

---

## 📁 APK / Build

(Add APK link here)

---

## 📌 Assumptions

* Single user device usage
* Internet connection required for Firebase
* Lightweight data storage

---

## 📈 Future Improvements

* Fix Google OAuth
* Add notifications
* Dark mode
* Offline support
* Multi-currency support
* Biometric authentication

---

## 🙌 Conclusion

This project demonstrates:

* Strong mobile architecture
* Product thinking
* Clean UI/UX
* Efficient state & data handling

The focus was on building a **polished, usable, and scalable mobile app**, rather than just adding features.

---

# 📘 Detailed Documentation

## 🧭 Development Journey

### Step 1: Planning

* Understood requirements
* Defined features
* Researched similar apps

### Step 2: UI Design

* Created UI sketches
* Referenced modern finance apps
* Focused on clarity & simplicity

### Step 3: Architecture Setup

* Feature-based folder structure
* Context + hooks setup

### Step 4: UI Development

* Built screens first
* Ensured responsiveness

### Step 5: Backend Integration

* Firebase setup
* Firestore schema design
* Supabase storage setup

### Step 6: Optimization

* Indexed queries
* Reduced re-renders

### Step 7: Testing

* Functional testing
* UX improvements

---

## 🧱 Database Design (Firestore)

Collections:

* users
* transactions

Transaction Fields:

* amount
* type
* category
* date
* note
* receiptUrl

---

## 🔁 State Flow

* Global state via Context
* Custom hooks for:

  * fetching data
  * updating data
  * syncing UI

---

## 🎯 Key Highlights

* Feature-based architecture
* Real-world Git workflow
* AI integration
* Optimized data handling

---

## 📎 Submission Notes

* Google OAuth partially implemented
* All core features completed
* Focused on UX & structure over complexity

---

## 👨‍💻 Author

Bharath Sivanesh

---
