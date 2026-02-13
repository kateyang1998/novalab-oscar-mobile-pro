# OSCAR Mobile Pro

A mobile-optimized Electronic Medical Records (EMR) application designed to provide clinicians with convenient access to essential patient information on the go.

## About the Project

OSCAR Mobile Pro is a capstone project inspired by the existing OSCAR EMR web application. This project aims to create an essential mobile version with enhanced UI design, offering improved convenience and accessibility for clinicians who use OSCAR EMR in their daily practice.

### Team Nova Lab

- **Jiwoo Lee**
- **Kate Yang**
- **Kyle Essien**
- **Rohit Talwar**

## Features

- **User Authentication**: Secure sign-in with User ID and Password
- **Bottom Tab Navigation**: Easy access to key sections (Home, Patients, Schedule, Chat)
- **Patient Management**: View and manage patient records
- **Schedule Management**: Track appointments and schedules
- **Clinical Notes**: Create and view clinical documentation
- **Patient Records**: Access patient summaries, notes, history, and vitals
- **Notifications**: Stay updated with important alerts
- **User Profile**: Manage account settings and preferences

## Tech Stack

- **React 19** - UI framework
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and development server
- **ESLint** - Code quality and consistency

## Project Structure

```
src/
├── assets/          # Images and static assets
├── components/      # Reusable components (BottomTab, etc.)
├── screens/         # Screen components
│   ├── SplashScreen.jsx
│   ├── SignInScreen.jsx
│   ├── HomeScreen.jsx
│   ├── PatientsScreen.jsx
│   ├── ScheduleScreen.jsx
│   ├── ChatScreen.jsx
│   ├── NotificationsScreen.jsx
│   ├── ProfileScreen.jsx
│   ├── PatientRecordSummaryScreen.jsx
│   ├── PatientRecordNotesScreen.jsx
│   ├── PatientRecordHistoryScreen.jsx
│   ├── PatientRecordVitalsScreen.jsx
│   └── ClinicalNoteScreen.jsx
├── App.jsx          # Main application component
└── main.jsx         # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd novalab-oscar-mobile-pro
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to the local development URL (typically `http://localhost:5173`)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint for code quality checks
- `npm run preview` - Preview production build locally

## Navigation Flow

1. **Splash Screen** (`/splash`) - Displays for 3 seconds on app launch
2. **Sign In Screen** (`/signin`) - User authentication
3. **Home Screen** (`/home`) - Main dashboard after successful sign-in
4. Access other sections via bottom tab navigation

## Design

The application features a mobile-first design with:
- Maximum width of 390px (mobile device viewport)
- iOS-inspired bottom tab navigation
- Blue accent color (#007AFF) for active states
- Clean, minimalist interface focused on usability

## Future Development

- [ ] Implement actual authentication logic with backend integration
- [ ] Add form validation rules for sign-in
- [ ] Integrate with OSCAR EMR backend API
- [ ] Implement patient data fetching and display
- [ ] Add offline support for critical features
- [ ] Implement push notifications
- [ ] Add biometric authentication support
- [ ] Create comprehensive unit and integration tests

## Contributing

This is a capstone project for Conestoga College. If you would like to contribute or have suggestions, please contact the team members.

## License

This project is developed as part of a capstone project at Conestoga College.

## Acknowledgments

- Inspired by OSCAR EMR (Open Source Clinical Application & Resource)
- Special thanks to our project supervisors and mentors at Conestoga College
- Design inspiration from modern mobile health applications

---

**Project Type**: Capstone Project
**Institution**: Conestoga College
**Program**: Winter 2026
**Team**: Nova Lab
