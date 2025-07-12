# Normal App - Voting Platform

A full-stack voting application built with React frontend and Node.js backend.

## Project Structure

```
Normal_app/
├── frontend/           # React frontend application
│   ├── src/           # React source code
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   └── vite.config.js # Vite configuration
├── backend/           # Node.js backend application
│   ├── routes/        # API routes
│   ├── models/        # Database models
│   ├── middleware/    # Express middleware
│   └── package.json   # Backend dependencies
└── package.json       # Root package.json for project management
```

## Features

- **Responsive Design**: Mobile-first approach with responsive grid layouts
- **Authentication**: JWT-based authentication system
- **Voting System**: Upvote/downvote functionality for members, entities, and feedback
- **Real-time Updates**: Server-side vote tracking with immediate UI updates
- **Cross-platform**: Works on mobile, tablet, and desktop

## Responsive Breakpoints

- **Mobile**: 1 column layout
- **Tablet (sm)**: 2 column layout  
- **Desktop (lg)**: 3 column layout
- **Large Desktop (xl)**: 4 column layout

## Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory with:
   ```
   MONGOURI=your_mongodb_connection_string
   JWT_Secret=your_jwt_secret
   ```

## Development

**Run both frontend and backend simultaneously:**
```bash
npm run dev
```

**Run only backend:**
```bash
npm run dev:backend
```

**Run only frontend:**
```bash
npm run dev:frontend
```

## Production

**Build frontend:**
```bash
npm run build
```

**Start production server:**
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout
- `GET /home` - Check authentication status

### Members
- `GET /api/members/:id` - Get member with voting status
- `POST /api/members/:id/vote` - Vote for member

### Entities
- `GET /api/entities/:id` - Get entity with voting status
- `POST /api/entities/:id/vote` - Vote for entity

### Feedback
- `GET /api/feedback/:id` - Get feedback with voting status
- `POST /api/feedback/:id/vote` - Vote for feedback

## Authentication Flow

1. **Unauthenticated users** can view all cards and voting results
2. **Voting attempts** redirect to login page with message
3. **Authenticated users** can vote once per item
4. **Vote status** is tracked server-side and persists across sessions

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, NextUI
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS with responsive design 
"# normal_app2" 
