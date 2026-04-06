# 📱 Personal Finance Companion App

## 🚀 Overview

This is a personal finance mobile app built using React Native.  
The goal of this app is to help users easily track their daily expenses, understand their spending habits, and stay consistent with managing their money.

The app focuses on simplicity, usability, and a smooth mobile experience.

---

## 🧠 What This App Does

- Track income and expenses
- View spending patterns with charts
- Manage transactions with filters
- Maintain daily tracking streaks
- Get insights using an AI assistant

---

## 🛠️ Tech Stack

### Frontend
- React Native (Expo)
- NativeWind (for styling)
- React Native Paper

### State Management
- Context API
- Custom Hooks

### Backend & Database
- Firebase Authentication
- Firestore Database

### Storage
- Supabase (for receipt images)

### Charts
- React Native Charts

---

## 📂 Project Structure

This project follows a **feature-based folder structure** for better scalability and organization.
add photot


Each feature contains its own screens, components, and logic, making the project easier to maintain and extend.

---

## 🔄 App Flow

1. Splash Screen  
2. Login / Signup  
3. Home Dashboard  
4. Add Transaction  
5. Transaction History  
6. Insights Screen  
7. Profile Screen  
8. AI Assistant  

---

## ✨ Key Features

### 🏠 Dashboard
- Shows balance, income, and expenses
- Recent transactions
- Chart overview

---

### 💸 Transactions
- Add, edit, delete transactions
- Supports income, expense, transfer
- Filters by type and date
- Upload receipt images

---

### 📊 Insights
- Spending breakdown
- Category analysis
- Trends over time

---

### 🎯 Streak System
- Tracks daily activity
- Encourages consistent usage

---

### 🤖 AI Assistant
- Chat-based interface
- Answers questions based on user data
- Quick prompts for insights

---

## 🔐 Authentication

- Implemented secure login using Firebase Email & Password authentication  
- Google OAuth was started but not fully completed due to redirect URI configuration issues  
- Encountered a 401 Unauthorized error related to authorized redirect URIs  

---

## ⚡ Performance Optimizations

- Used custom hooks to avoid unnecessary API calls and re-fetching  
- Applied Firestore indexing for faster query performance  
- Managed state updates efficiently to reduce re-renders  
- Implemented a lazy refresh approach to keep data updated without excessive calls  

---

## 🧪 Testing

- Tested core logic at a unit level  
- Performed manual UI testing across different screens  
- Checked performance for smooth data loading and rendering  
- Reviewed user flows to ensure a consistent experience  

---

## 🎨 UI/UX

- Designed a clean and minimal interface  
- Ensured touch-friendly interactions for mobile users  
- Maintained smooth navigation across screens  
- Handled empty states, loading states, and error states properly  
- Added toast messages for user feedback  

---

## 🔄 Development Workflow

Followed a structured Git workflow:

- `main` → production-ready code  
- `staging` → testing environment  
- `feature` branches → individual feature development  

### Flow:
1. Created feature branches  
2. Merged features into staging  
3. Tested in staging  
4. Merged stable code into main  

---

## 🧩 Challenges Faced

- Setting up Firebase Web SDK correctly within React Native (Expo)  
- Optimizing Firestore queries for better performance  
- Configuring Supabase storage policies for secure file uploads  
- Debugging Google OAuth redirect URI issues  

### 🔐 Authentication
- Email & Password login (Firebase)

> Note: Google login was started but not completed due to redirect configuration issue.
 

---

## 📦 Installation & Setup

```bash
git clone https://github.com/Bharathsivanesh/Personal-Finance-Companion.git
cd BudgetApp
npm install
npx expo start
```
## 📸 Screenshots & Demo

### 📸 App Screenshots

### 📱 Auth Screens & Splash Screen
<p align="center">
  <img src="https://github.com/user-attachments/assets/63ac5f4c-c9ed-4e98-8674-96102df7cbcc" width="250"/>
  <img src="https://github.com/user-attachments/assets/473e2fbf-de3a-4cb8-819c-bee7979f5c93" width="250"/>
  <img src="https://github.com/user-attachments/assets/0b459093-0294-4404-90ec-50822a776c6c" width="250"/>
</p>

### 💸 Home & Transactions
<p align="center">
  <img src="https://github.com/user-attachments/assets/2614ef8d-9166-4274-9f93-9a65fc0b152b" width="250"/>
  <img src="https://github.com/user-attachments/assets/2981ba23-231c-4634-a21f-54a7d3f2d5ea" width="250"/>
  <img src="https://github.com/user-attachments/assets/646a0b72-aea6-41b2-b043-bcef7e4fb87c" width="250"/>
</p>

### 📊 Insights & Analytics
<p align="center">
  <img src="https://github.com/user-attachments/assets/57a7bdfa-af48-4f54-a15f-0333e52415f0" width="250"/>
  <img src="https://github.com/user-attachments/assets/77464a22-29ec-4813-b1ce-f6e4affdb32b" width="250"/>
  <img src="https://github.com/user-attachments/assets/d400eb20-105e-431e-a11b-7fa73d6ed88c" width="250"/>
</p>

### 🤖 AI Assistant & Profile
<p align="center">
  <img src="https://github.com/user-attachments/assets/b69e7673-9735-4d06-96b4-cb3702aa398f" width="250"/>
  <img src="https://github.com/user-attachments/assets/65bbe45b-20e8-4a94-81de-34114dc19ac0" width="250"/>
  <img src="https://github.com/user-attachments/assets/a8e5fb1c-3209-4217-9d30-5370c86a30d1" width="250"/>
</p>

* Splash Screen
* Login / Signup
* Dashboard
* Transactions
* Insights
* AI Assistant

---

## 📁 APK / Build

```https://expo.dev/accounts/sivaneshs/projects/BudgetApp/builds/92404e8a-d4f9-4244-b784-6ffd905b4606```

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
