# OSCAR Mobile Pro

A mobile-first Electronic Medical Records (EMR) application designed to provide clinicians with convenient access to essential patient information on the go. Built as a capstone project inspired by the OSCAR EMR system.

### Team Nova Lab — Conestoga College, Winter 2026

- **Jiwoo Lee**
- **Kate Yang**
- **Kyle Essien**
- **Rohit Talwar**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, Vite 7 |
| Backend | Express 4 (Node.js) |
| Database | SQLite via Node's built-in `node:sqlite` module |
| Styling | Inline styles with a centralized theme (`src/styles/theme.js`) |

> **Node.js requirement:** v22.5 or higher (`node:sqlite` is stable since Node v23.4). **Node v25 is recommended.**

---

## Getting Started

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 2. Start the app

```bash
npm run dev
```

This starts both servers concurrently:
- **Express API** on `http://localhost:3001` — creates and seeds the SQLite database automatically on first run
- **Vite dev server** on `http://localhost:5173` — waits for the API to be ready before launching

Then open **`http://localhost:5173`** in your browser.

### 3. Log in

Use the demo credentials on the Sign In screen:

| Field | Value |
|---|---|
| User ID | `CL000001` |
| Password | `oscar123` |

---

## Features

- **Authentication** — Sign in with User ID and password
- **Home Dashboard** — Today's schedule, recent patients, patient search
- **Patient List** — Searchable grid of all patients
- **Patient Records** — Demographics, allergies, medications, conditions, vitals, clinical notes, and visit history
- **Schedule** — Month / week / day calendar views with real appointment data
- **Edit Appointments** — Update type, status, date, time, duration, reason; cancel appointments
- **Clinical Notes** — Create and edit SOAP notes with assessment, plan, and action checkboxes
- **Inbox** — View messages, mark as read individually or all at once
- **Profile** — View clinician info, change password, trigger data sync
- **Settings** — Toggle security, notification, and sync preferences — all persisted to the database

---

## Project Structure

```
├── server/                    # Express API backend
│   ├── index.js               # Server entry point, mounts all routes
│   ├── db.js                  # SQLite schema creation and data seeding
│   ├── utils.js               # Shared formatting and mapping utilities
│   ├── oscar.db               # SQLite database file (auto-created on first run)
│   └── routes/
│       ├── auth.js            # POST /api/auth/login
│       ├── clinician.js       # GET /api/clinician, PUT password, POST sync
│       ├── patients.js        # Patient list, detail, notes, vitals, history
│       ├── appointments.js    # List, update, cancel appointments
│       ├── notes.js           # Create, read, update, delete clinical notes
│       ├── messages.js        # Inbox, send, mark-as-read
│       └── settings.js        # Get and update user settings
│
├── src/
│   ├── screens/               # One file per screen
│   │   ├── SplashScreen.jsx
│   │   ├── SignInScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── PatientsScreen.jsx
│   │   ├── PatientRecordScreen.jsx
│   │   ├── ScheduleScreen.jsx
│   │   ├── EditAppointmentScreen.jsx
│   │   ├── ClinicalNoteScreen.jsx
│   │   ├── InboxScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   └── SettingsScreen.jsx
│   ├── components/            # Reusable UI components organized by domain
│   │   ├── appointment/
│   │   ├── clinical_note/
│   │   ├── common/
│   │   ├── home/
│   │   ├── layout/
│   │   ├── patient/
│   │   ├── profile/
│   │   ├── schedule/
│   │   └── settings/
│   ├── styles/
│   │   └── theme.js           # Centralized colors, fonts, spacing, shadows
│   └── App.jsx                # Route definitions
│
├── vite.config.js             # Proxies /api/* requests to localhost:3001
└── package.json
```

---

## API Reference

### Auth
| Method | Path | Description |
|---|---|---|
| POST | `/api/auth/login` | Sign in with `{ userId, password }` |

### Clinician
| Method | Path | Description |
|---|---|---|
| GET | `/api/clinician` | Get current clinician profile |
| PUT | `/api/clinician/password` | Change password |
| POST | `/api/clinician/sync` | Trigger sync, returns timestamp |

### Patients
| Method | Path | Description |
|---|---|---|
| GET | `/api/patients` | List all patients |
| GET | `/api/patients/:id` | Full patient record |
| GET | `/api/patients/:id/notes` | Clinical notes for a patient |
| GET | `/api/patients/:id/vitals` | Vital signs history |
| GET | `/api/patients/:id/history` | Appointment history |

### Appointments
| Method | Path | Description |
|---|---|---|
| GET | `/api/appointments` | All appointments (schedule calendar) |
| GET | `/api/appointments/today` | Today's appointments (home screen) |
| PUT | `/api/appointments/:id` | Update appointment details |
| PATCH | `/api/appointments/:id/cancel` | Cancel an appointment |

### Clinical Notes
| Method | Path | Description |
|---|---|---|
| GET | `/api/notes/:noteId` | Get a specific note |
| POST | `/api/notes` | Create a new note |
| PUT | `/api/notes/:noteId` | Update a note |
| DELETE | `/api/notes/:noteId` | Delete a note |

### Messages
| Method | Path | Description |
|---|---|---|
| GET | `/api/messages` | Get inbox |
| POST | `/api/messages` | Send a message |
| PATCH | `/api/messages/:id/read` | Mark one message as read |
| PATCH | `/api/messages/read-all` | Mark all messages as read |

### Settings
| Method | Path | Description |
|---|---|---|
| GET | `/api/settings` | Get all settings for current clinician |
| PUT | `/api/settings` | Update one or more settings |

---

## Database

The SQLite database (`server/oscar.db`) is created and seeded automatically on first run. Sample data includes:

- **4 clinicians** — Dr. Lee (logged-in user), Dr. Smith, Dr. Brown, Nurse Johnson
- **10 patients** — with allergies, emergency contacts, medical conditions, medications, and vitals
- **Appointments** — 3 historical appointments + 3–4 appointments auto-seeded for today every time the server starts on a new date
- **4 clinical notes** — SOAP notes linked to patients
- **4 inbox messages** — sent to Dr. Lee

To reset the database and re-seed from scratch, delete `server/oscar.db` and restart the server.

---

## npm Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start both Express API and Vite dev server |
| `npm run server` | Start Express API only |
| `npm run client` | Start Vite only |
| `npm run build` | Production build of the frontend |
| `npm run lint` | Run ESLint |

---

## Design

- Mobile-first layout, optimized for a 390px viewport
- iOS-inspired bottom tab navigation
- Blue accent color (`#007AFF`) for interactive elements
- Shared design tokens defined in `src/styles/theme.js`

---

## Acknowledgments

- Inspired by [OSCAR EMR](https://oscar-emr.com/) (Open Source Clinical Application & Resource)
- Special thanks to our project supervisors and mentors at Conestoga College
