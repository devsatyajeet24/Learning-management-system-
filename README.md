# 🎓 EduLearn - Learning Management System

A beautiful, fully-featured Learning Management System built with React, Node.js, Express, and MongoDB. Features a stunning public homepage showcasing all courses, student enrollment, video lectures, and a powerful instructor dashboard.

## 🎨 Features at a Glance

### 🏠 **Public Homepage** (No Login Required!)
- ✨ Beautiful course showcase with gradient designs
- 🔍 Real-time search functionality
- 🏷️ Category filtering (Programming, Design, Backend, Database, etc.)
- 💳 Course cards showing pricing, instructor, and lesson count
- 📱 Fully responsive - works on all devices
- 🎯 Clear call-to-action buttons

### 🎓 **For Students**
- 📝 Create account in seconds
- 🎬 Watch high-quality video lectures (YouTube embedded)
- 📊 Track progress with visual progress bars
- ✅ Mark lessons as complete
- 👨‍🏫 See instructor information
- 📈 View course progress percentage

### 👨‍🏫 **For Instructors**
- 📚 Create unlimited courses
- 🎥 Add video lessons with descriptions
- 💰 Set course pricing
- 🏷️ Organize by categories
- 📊 View student enrollment stats
- ✏️ Edit and manage courses
- 🗑️ Delete courses easily

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MongoDB (local or Atlas)
- npm or yarn

### Installation (3 Steps!)

1. **Install dependencies**
   ```bash
   npm install && npm --prefix backend install && npm --prefix frontend install
   ```

2. **Ensure MongoDB is running**
   ```bash
   mongod
   ```

3. **Start the app**
   ```bash
   npm run dev
   ```

Open **http://localhost:3000** 🎉

### 🌱 Populate with Sample Courses
```bash
npm --prefix backend run seed
```

This creates 6 sample courses and demo accounts!

## 🔐 Demo Accounts

| User | Email | Password |
|------|-------|----------|
| 👨‍🏫 Instructor | admin@example.com | password123 |
| 👨‍🎓 Student | student@example.com | password123 |

(Pre-created in database after seeding)

## 📁 Project Structure

```
lms-app/
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx           ← Public homepage
│   │   │   ├── CourseDetail.tsx    ← Course page
│   │   │   ├── AdminDashboard.tsx  ← Instructor dashboard
│   │   │   └── Login.tsx, Register.tsx
│   │   ├── components/
│   │   ├── context/
│   │   └── utils/
│   └── package.json
│
├── backend/                     # Express + MongoDB
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── index.ts
│   │   └── seed.ts              ← Database seeder
│   └── package.json
│
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Vite |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB |
| **Auth** | JWT + Bcryptjs |
| **API** | RESTful |

## 🔄 How It Works

### Student Journey
1. 🏠 Land on homepage → Browse all courses
2. 📖 Click a course → See details & preview
3. 📝 Click "Enroll" → Sign up
4. 🎬 Watch lessons → Track progress
5. ✅ Complete course → Earn progress!

### Instructor Journey
1. 📝 Sign up as Instructor
2. 📚 Create first course
3. 🎥 Add video lessons
4. 📊 View student progress
5. 💬 Manage course content

## 🎬 Video Lesson Format

The app uses YouTube embedded URLs. Example:
```
https://www.youtube.com/embed/dQw4w9WgXcQ
https://www.youtube.com/embed/jNQXAC9IVRw
```

Simply paste YouTube video IDs into the "Video URL" field when creating lessons!

## 🗄️ API Endpoints

### Authentication (Public)
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Courses (Public)
```
GET    /api/courses              # Get all courses
GET    /api/courses/:id          # Get course details
```

### Courses (Instructors Only)
```
POST   /api/courses              # Create course
PUT    /api/courses/:id          # Update course
DELETE /api/courses/:id          # Delete course
POST   /api/courses/:id/lessons  # Add lesson
```

### Enrollments (Students Only)
```
POST   /api/enrollments/enroll              # Enroll
GET    /api/enrollments/my-courses          # My courses
POST   /api/enrollments/complete-lesson     # Mark complete
```

## 📊 Database Schema

### User
```
{
  name: String
  email: String (unique)
  password: String (hashed)
  role: 'student' | 'admin'
  createdAt: Date
}
```

### Course
```
{
  title: String
  description: String
  instructor: ObjectId → User
  category: String
  price: Number
  lessons: [{
    title: String
    videoUrl: String
    description: String
    duration: Number
    order: Number
  }]
  students: [ObjectId] → User[]
  createdAt: Date
}
```

### Enrollment
```
{
  student: ObjectId → User
  course: ObjectId → Course
  progress: Number (0-100)
  completedLessons: [ObjectId]
  createdAt: Date
}
```

## 🎯 Sample Courses Included

After seeding, you get:
- ✅ JavaScript Fundamentals ($49.99)
- ✅ React - Build Modern UIs ($59.99)
- ✅ Python for Beginners ($39.99)
- ✅ Web Design Essentials ($44.99)
- ✅ Node.js and Express ($54.99)
- ✅ MongoDB Mastery ($49.99)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Railway/Render/Heroku)
```bash
npm run build
npm start
```

**Environment Variables needed:**
```
MONGODB_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=8000
NODE_ENV=production
```

## 🐛 Troubleshooting

### MongoDB won't connect
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/lms
```

### Port already in use
```bash
# Kill port 8000
lsof -ti:8000 | xargs kill -9

# Kill port 3000
lsof -ti:3000 | xargs kill -9
```

### Courses not showing
```bash
# Reseed database
npm --prefix backend run seed
```

### Build errors
```bash
# Clean and reinstall
rm -rf node_modules **/node_modules
npm install && npm --prefix backend install && npm --prefix frontend install
```

## 📝 Available Commands

```bash
# Development (both frontend & backend)
npm run dev

# Backend only
npm run backend:dev

# Frontend only
npm run frontend:dev

# Build for production
npm run build

# Start production
npm start

# Seed database
npm --prefix backend run seed
```

## 🎨 UI Highlights

- 🌈 Beautiful gradient design
- ⚡ Smooth animations
- 📱 Mobile responsive
- 🎯 Clean, modern layout
- 🔍 Smart search
- 📊 Progress tracking
- 🎬 Video player integration

## 🔮 Future Features

- 📝 Quizzes & Assignments
- 🏆 Certificates
- 💳 Payment Integration (Stripe)
- 💬 Discussion Forums
- 📧 Email Notifications
- ⭐ Course Ratings
- 👥 Social Features
- 📱 Mobile App
- 🤖 AI Recommendations

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Express Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

## 📄 License

MIT - Open source and free to use!

## 🤝 Support

Questions or issues? Feel free to reach out or check the documentation.

---

**Built with ❤️ using MERN Stack**

**Ready to learn? Start now! 🚀**
