# LMS Application

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   npm --prefix backend install
   npm --prefix frontend install
   ```

2. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running
   mongod
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## Project Features

✅ **User Authentication** - JWT-based login/register
✅ **Role-Based Access** - Student and Admin roles
✅ **Course Management** - Create, edit, delete courses
✅ **Video Lessons** - Add and manage video content
✅ **Course Enrollment** - Students can enroll in courses
✅ **Progress Tracking** - Track lesson completion
✅ **Responsive Design** - Mobile-friendly UI

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express + TypeScript + MongoDB
- **Authentication**: JWT + Bcryptjs

## Environment Setup

See `backend/.env` for configuration options.
