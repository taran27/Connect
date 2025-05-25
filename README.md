# 🚀 Connect

## A Comprehensive Salesforce Integration Mobile App for Insurance Services

---

## 📖 Description

**Connect** is a sophisticated mobile application designed to streamline agency interactions and improve operational efficiency for agents at Insurance Services. Leveraging seamless Salesforce integration through REST APIs, the app enables agents to effortlessly manage agency searches, calendar appointments, user profiles, biometric security, and local calendar synchronization—significantly enhancing productivity and user experience.

---

## 🛠️ Tech Stack

- **Framework:** React Native (Expo)
- **Backend Integration:** Salesforce REST API, Google Calendar API
- **State Management:** Zustand, React Query
- **Build & CI/CD:** Expo EAS, GitLab CI/CD
- **Testing & Quality:** Jest, ESLint, Prettier, Typescript
- **Authentication & Security:** Expo Auth Session, JWT, Biometric Authentication (Face ID, Touch ID)
- **Platform Support:** iOS, Android, Web (Preview Mode)

---

## ✅ Features & Functionality

### 📍 Agency Lookup

- **Real-time search:** Search agencies by Name, City, State, or Phone Number.
- **Detailed agency view:** Includes agency address, phone number, status, and industry classification.

### 📅 Appointment Management

- **Integrated calendar:** View, create, and manage appointments seamlessly integrated with Salesforce.
- **Event reminders:** Automatic reminders for upcoming appointments.
- **Google Calendar integration:** Sync events bi-directionally.

### 👤 User Profile Management

- **Detailed profile:** View personal details, contact information, account status, and login statistics.
- **Profile customization:** Upload profile images, manage settings, and adjust notification preferences.
- **Biometric security:** Enable Face ID or Touch ID for secure access.

### 🔒 Security & Authentication

- **Secure login:** OAuth 2.0-based secure Salesforce login.
- **Biometric authentication:** Device-native biometric authentication methods.
- **Local data encryption:** Secure Store integration.

### 🌐 Local & Remote Calendar Sync

- **Device calendar synchronization:** Read-only integration to local device calendars.
- **Real-time synchronization:** Periodic polling with Salesforce and Google Calendar.

### 🎨 Theme Customization

- **System, dark, and light modes:** Adaptive theming.

### 📊 User Activity Monitoring

- **Login analytics:** Track login activity and access details.
- **Health status:** Real-time status indicators for integrations.

---

## 🛠️ Installation & Setup

Clone the repository and install dependencies using Yarn:

```bash
yarn install
```

### Run the App Locally

- **Start Development Server**

```bash
yarn start
```

- **iOS Simulator/Device**

```bash
yarn ios
```

- **Android Emulator/Device**

```bash
yarn android
```

- **Web Preview**

```bash
yarn web
```

### Additional Utility Scripts

- **Testing**

```bash
yarn test
```

- **Linting and Formatting**

```bash
yarn lint
yarn format
```

- **Clean Project Dependencies**

```bash
yarn clean
```

---

## 🖥️ Screenshots & Previews

_Placeholder for app screenshots and walkthrough GIFs._

---

## 🤝 Contribution Guidelines

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/<feature-name>`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature/<feature-name>`).
5. Create a Merge Request (MR) describing the changes clearly.

---

## 👨‍💻 Development Team

- Insurance Services Technical Team

---

## 📄 License

### To Be Determined

---

## 📌 Project Status

- ✅ **Actively Maintained**
- 🚧 **In Continuous Development**
- 🚀 **New Features Regularly Added**
