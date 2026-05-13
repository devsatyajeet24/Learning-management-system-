# 🚀 Quick Start Guide - Learning Management System

## ✅ Project Setup Complete!

Your full-stack Learning Management System is ready to run. Here's everything you need to know:

## 📦 What's Included

### Backend (Express + MongoDB + TypeScript)
- ✅ User authentication with JWT
- ✅ Role-based access control (Student/Admin)
- ✅ Course management APIs
- ✅ Enrollment system
- ✅ Progress tracking

### Frontend (React + Tailwind CSS + TypeScript)
- ✅ Student dashboard with course browsing
- ✅ Video player for lessons
- ✅ Progress tracking UI
- ✅ Admin course management panel
- ✅ Responsive design

## 🎯 Getting Started

### Step 1: Start MongoDB
```bash
# Make sure MongoDB is running locally or provide MongoDB URI in backend/.env
mongod
```

### Step 2: Run the Application
```bash
# From the project root directory
npm run dev
```

This will automatically start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:3000

### Step 3: Login

Use these demo credentials:

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`

**Student Account:**
- Email: `student@example.com`  
- Password: `password123`

Or create a new account during registration!

## 🎓 User Workflows

### As a Student:
1. Login as a student
2. Browse available courses
3. Click "Enroll Now" to join a course
4. Click "View Course" to access enrolled courses
5. Watch video lessons
6. Mark lessons as complete to track progress
7. View your progress percentage

### As an Admin:
1. Login as an admin
2. Go to Admin Dashboard
3. Click "Create Course" to add new courses
4. Edit course to add lessons (video URLs)
5. Manage all course content
6. View enrollment statistics

## 📁 Project Structure

```
lms-app/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── middleware/     # Auth middleware
│   │   ├── routes/         # API endpoints
│   │   └── index.ts        # Server
│   ├── dist/              # Compiled JS
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API utilities
│   │   └── App.tsx        # Main app
│   ├── dist/             # Built files
│   └── package.json
│
├── README.md              # Full documentation
└── package.json          # Root scripts
```

## 🛠️ Available Commands

```bash
# Development (both frontend & backend)
npm run dev

# Backend only
npm run backend:dev

# Frontend only  
npm run frontend:dev

# Production build
npm run build

# Start production
npm start
```

## 🎮 Features to Try

1. **Register & Login** - Create a student or admin account
2. **Create Courses** (Admin) - Add new courses with details
3. **Add Lessons** (Admin) - Add video lessons to courses
4. **Enroll** (Student) - Subscribe to available courses
5. **Watch Videos** (Student) - Stream video content
6. **Track Progress** (Student) - See completion percentage
7. **Manage Content** (Admin) - Edit/delete courses

## ⚙️ Environment Variables

Backend `.env` file is already configured:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=lms_super_secret_key_change_in_production
NODE_ENV=development
```

## 📝 Sample Video URLs (YouTube Embeds)

For testing, you can use these embed URLs:
```
https://www.youtube.com/embed/dQw4w9WgXcQ
https://www.youtube.com/embed/jNQXAC9IVRw
https://www.youtube.com/embed/9bZkp7q19f0
```

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
brew services start mongodb-community  # Mac
sudo systemctl start mongod            # Linux
# or run mongod in another terminal
```

### Port Already in Use
```bash
# Kill process on port 5000 or 3000
lsof -ti:5000 | xargs kill -9
lsof -ti:3000 | xargs kill -9
```

### Clear Dependencies Cache
```bash
rm -rf node_modules backend/node_modules frontend/node_modules
npm install
npm --prefix backend install
npm --prefix frontend install
```

## 🚢 Deployment Ready

The application is ready for deployment:
- Backend deployable to Heroku, Railway, Render
- Frontend deployable to Vercel, Netlify, or any static host
- MongoDB Atlas compatible

## 📚 Next Steps

1. **Customize** - Modify branding, colors, and content
2. **Add Features** - Implement quizzes, certificates, forums
3. **Deploy** - Push to production servers
4. **Scale** - Add more courses and users

## 💬 Support

For issues or questions, refer to:
- [README.md](README.md) for detailed documentation
- Backend error logs in terminal
- Browser console for frontend errors

---

**Happy Learning! 🎉**
