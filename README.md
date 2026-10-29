# SmartLearn — Smart Learning Management System

A modern learning management dashboard designed to help students organize courses, monitor learning progress, explore exams, and access academic information through a clean, responsive interface.

## Overview

SmartLearn is a full-stack web development project created for the CodeAlpha Full Stack Web Development Internship. It combines a React-based frontend with a Node.js and Express backend.

## Features

- **Learning Dashboard:** A centralized view of learning activities and academic information.
- **Course Management:** Browse available courses and view course-related information.
- **Exam Section:** Access exam-related information through the dashboard.
- **Learning Analytics:** View learning statistics and progress information.
- **Student Profiles:** Demonstration student data and profile interactions.
- **Responsive Interface:** A modern interface with a lavender and purple visual theme.
- **REST API:** Express endpoints provide application data to the frontend.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React 19 |
| Build Tool | Vite |
| Backend | Node.js |
| Server Framework | Express.js |
| Styling | CSS |
| Icons | Lucide React |
| AI Integration Package | Google GenAI SDK |

## Project Structure

```text
CodeAlpha_SmartLearn/
├── public/             # Public assets
├── src/                # React application source
├── dist/               # Production build output (generated)
├── server.js           # Express backend server
├── index.html          # Frontend entry HTML
├── package.json        # Scripts and dependencies
├── package-lock.json   # Dependency lockfile
├── vite.config.js      # Vite configuration
├── .env.example        # Example environment configuration
└── README.md           # Project documentation
```

## Prerequisites

- Node.js and npm
- Git (optional, for cloning the repository)

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/shibatharshiniiyappan/CodeAlpha_SmartLearn.git
cd CodeAlpha_SmartLearn
```

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Start the application

```bash
npm run dev
```

Open the local application at:

http://localhost:3000

### 4. Create a production build

```bash
npm run build
```

The generated production files are placed in the `dist/` directory.

## API Endpoints

The Express backend includes endpoints such as:

- `GET /api/health` — Check API health.
- `GET /api/auth/me` — Retrieve the current demonstration user.
- `GET /api/courses` — Retrieve course information.

Additional endpoints support other dashboard data and interactions.

## Current Implementation Notes

- The application currently uses in-memory demonstration data. Changes may be lost when the server restarts.
- The current demonstration login endpoint does not verify passwords and is not suitable for production authentication.
- A persistent database and secure authentication workflow are future improvements.
- Configure any required API keys through environment variables. Never commit real secrets to GitHub.

## Future Enhancements

- Integrate persistent database storage.
- Implement secure registration, login, password hashing, and session management.
- Add course enrollment and progress persistence.
- Expand assessment and analytics functionality.
- Add automated testing and production deployment configuration.

## Internship Project

**Program:** CodeAlpha Full Stack Web Development Internship  
**Project:** SmartLearn — Smart Learning Management System

This project demonstrates a React frontend, an Express backend, REST API integration, and a modern dashboard interface.
