# DMSApp

A simple Document Management System (DMS) mobile app built with **React Native** — created as an assignment.  
This project demonstrates the UI flow and functionality for Login, Upload, and Search screens.  
> Note: Some parts use mocked data (if backend is unavailable). See the Postman collection included in the repo.

---

## 📖 Project Overview
Features implemented (frontend):
- OTP-based **Login** (calls API if available, else mocked)
- **Upload** screen: file picker (image/PDF), date, major/minor heads, tags, remarks (uploads to API if token is present)
- **Search** screen: filter by major/minor head, tags, date range; preview images/PDFs and download files
- Navigation with React Navigation
- API helpers in `services/` (axios)

APIs referenced (Postman collection included):
- `generateOTP`, `validateOTP`, `saveDocumentEntry`, `searchDocumentEntry`, `documentTags`
(See `Document Management.postman_collection.json` in repo)

---

## 🚀 How to run (developer instructions)

> Prerequisites: Node.js, Java JDK (for Android build), Android SDK (platform-tools), Android emulator OR an Android device with USB debugging enabled.

1. Clone the repository
```bash
git clone https://github.com/singhdiksha17/DMSApp.git
cd DMSApp
Install dependencies

npm install


Start Metro bundler

npm start
# or
npx react-native start


In a new terminal, run on Android

npm run android
# or
npx react-native run-android


To run on a physical Android device: enable Developer options → USB debugging, connect via USB, and ensure adb devices shows your device.

🧪 Testing

Manual testing: navigate through Login → Upload → Search and verify UI behavior.

Unit tests are not added; can add Jest tests in future updates.

📂 Folder structure (key files)
DMSApp/
  ├── screens/
  │   ├── LoginScreen.js
  │   ├── UploadScreen.js
  │   └── SearchScreen.js
  ├── navigation/
  │   └── AppNavigator.js
  ├── services/
  │   └── api.js
  ├── App.js
  ├── package.json
  ├── README.md
  └── Document Management.postman_collection.json

📌 Notes for evaluators

I am a beginner; implemented frontend screens and wiring with axios service helpers.

Backend endpoints (as per assignment Postman collection) are included and the app will call them if reachable.

If the backend is not available during evaluation, mock responses are used — instructions in code comments.
