# 📱 Personal Finance Companion App

## 🚀 Overview

This is a mobile application built as part of the Zorhyn Mobile Developer Internship assignment. The app is designed to help users track their daily financial activities in a simple, structured, and engaging way.
---
## 🧠 Product Thinking

It helps users:

* Track income and expenses
* Understand spending patterns
* Monitor savings
* Build financial habits (streaks & goals)
* Get insights through charts
* AI Assistant

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

![Image](https://github.com/user-attachments/assets/63ac5f4c-c9ed-4e98-8674-96102df7cbcc)
![Image](https://github.com/user-attachments/assets/473e2fbf-de3a-4cb8-819c-bee7979f5c93)
![Image](https://github.com/user-attachments/assets/0b459093-0294-4404-90ec-50822a776c6c)
![Image](https://github.com/user-attachments/assets/2614ef8d-9166-4274-9f93-9a65fc0b152b)
![Image](https://github.com/user-attachments/assets/2981ba23-231c-4634-a21f-54a7d3f2d5ea)
![Image](https://github.com/user-attachments/assets/646a0b72-aea6-41b2-b043-bcef7e4fb87c)
![Image](https://github.com/user-attachments/assets/57a7bdfa-af48-4f54-a15f-0333e52415f0)
![Image](https://github.com/user-attachments/assets/77464a22-29ec-4813-b1ce-f6e4affdb32b)
![Image](https://github.com/user-attachments/assets/d400eb20-105e-431e-a11b-7fa73d6ed88c)
![Image](https://github.com/user-attachments/assets/b69e7673-9735-4d06-96b4-cb3702aa398f)
![Image](https://github.com/user-attachments/assets/65bbe45b-20e8-4a94-81de-34114dc19ac0)
![Image](https://github.com/user-attachments/assets/a8e5fb1c-3209-4217-9d30-5370c86a30d1)

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

```https://expo.dev/accounts/sivaneshs/projects/BudgetApp/builds/1fbd29a5-4680-456b-9dc6-0e32620f5d10```

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


