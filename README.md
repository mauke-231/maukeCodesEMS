# Campus Event Management System

A **Campus Event Management System** that allows admins to create and manage events while enabling non-admin users to view events on a calendar and RSVP for events.

This project uses **JavaScript**, **React (with Vite)** for the frontend, and **Node.js** for the backend, along with HTML and CSS for additional structure and styling.

---
## Deployment Links:
### Frontend:
### Backend: https://campus-backend-oxyd.onrender.com

---

## Features

### Admin Users:
- Log in to access admin features.
- Create events and specify capacities for events.

### Non-Admin Users:
- Log in to view available events.
- View events on an interactive calendar.
- RSVP for events.

---

## Technologies Used

### Frontend:
- **React (Vite)**: For building the user interface.
- **HTML/CSS**: For structuring and styling the UI.
- **JavaScript**: For interactivity.

### Backend:
- **Node.js**: For the server and API logic.
- **Express.js**: For handling backend routes.
- **MongoDB**: For the database.

---

## Getting Started

Follow the steps below to set up the project locally.

### Prerequisites
Make sure you have the following installed on your system:
1. [Node.js](https://nodejs.org/)
2. npm (comes with Node.js)
3. MongoDB (if running locally) or a database connection string.

---

### Installation

#### 1. Clone the Repository:
```bash
git clone https://github.com/yourusername/campus-event-management-system.git
cd campus-event-management-system
```

#### 2. Install Dependencies:

**For the Backend:**
```bash
cd ems/api
npm install
```

**For the Frontend:**
```bash
cd ems/client
npm install
```

---

### Running the Application

#### Backend:
Start the backend server:
```bash
cd ems/api
node index.js
```

The backend runs on: `http://localhost:4000` (or the configured port).

#### Frontend:
Run the frontend application:
```bash
cd ems/api
npm start
```

The frontend runs on: `http://localhost:5173` (Vite default).

---

## Directory Structure
```
ems/
|-- client/                # Frontend code (React + Vite)
|   |-- src/
|       |-- components/    # Reusable React components
|       |-- pages/         # Page components (Home, Calendar, etc.)
|       |-- App.jsx        # Main React App component
|       |-- main.jsx       # Entry point for React
|   |-- index.html         # HTML template
|   |-- package.json       # Frontend dependencies
|
|-- api/                # Backend code (Node.js + Express)
|   |-- models/            # Database models
|   |-- routes/            # API routes
|   |-- index.js           # Entry point for backend server
|   |-- package.json       # Backend dependencies
|
|-- README.md              # Project documentation
```

---

## Screenshots

### Example:
![Admin Dashboard](./assets/admin-dashboard.png)
![Calendar View](./assets/calendar-view.png)

- **Tip**: Place your images/screenshots in an `assets` folder at the root of your project and reference them like `./assets/your-image.png`.

---

## API Endpoints

| Endpoint             | Method | Description                    |
|----------------------|--------|--------------------------------|
| `/api/events`        | GET    | Fetch all events               |
| `/api/events/:id`    | GET    | Fetch a single event by ID     |
| `/api/events`        | POST   | Create a new event (Admin)     |
| `/api/events/:id`    | PUT    | Update an event (Admin)        |
| `/api/events/:id`    | DELETE | Delete an event (Admin)        |
| `/api/rsvp/:eventId` | POST   | RSVP to an event (Non-admin)   |
