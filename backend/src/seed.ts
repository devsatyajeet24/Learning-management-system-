import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';
import Course from './models/Course';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Alex Johnson',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    // Create sample courses
    const courses = await Course.create([
      {
        title: 'JavaScript Fundamentals',
        description: 'Master the basics of JavaScript programming. Learn variables, functions, loops, and more.',
        instructor: admin._id,
        category: 'Programming',
        price: 49.99,
        lessons: [
          {
            title: 'Introduction to JavaScript',
            description: 'Get started with JavaScript basics',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 15,
            order: 1,
          },
          {
            title: 'Variables and Data Types',
            description: 'Learn about variables, primitives, and objects',
            videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
            duration: 20,
            order: 2,
          },
          {
            title: 'Functions and Scope',
            description: 'Understanding functions, scope, and closures',
            videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
            duration: 25,
            order: 3,
          },
        ],
      },
      {
        title: 'React - Build Modern UIs',
        description: 'Learn React and create interactive user interfaces with component-based architecture.',
        instructor: admin._id,
        category: 'Web Development',
        price: 59.99,
        lessons: [
          {
            title: 'React Basics',
            description: 'Introduction to React components',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 30,
            order: 1,
          },
          {
            title: 'Hooks and State Management',
            description: 'Master React hooks and state',
            videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
            duration: 35,
            order: 2,
          },
        ],
      },
      {
        title: 'Python for Beginners',
        description: 'Start your Python journey with comprehensive beginner-friendly tutorials.',
        instructor: admin._id,
        category: 'Programming',
        price: 39.99,
        lessons: [
          {
            title: 'Python Setup and Basics',
            description: 'Install Python and write your first program',
            videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
            duration: 20,
            order: 1,
          },
          {
            title: 'Data Structures',
            description: 'Lists, dictionaries, and sets in Python',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 25,
            order: 2,
          },
        ],
      },
      {
        title: 'Web Design Essentials',
        description: 'Learn the principles of good web design and create beautiful websites.',
        instructor: admin._id,
        category: 'Design',
        price: 44.99,
        lessons: [
          {
            title: 'Color Theory',
            description: 'Understanding colors and palettes',
            videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
            duration: 15,
            order: 1,
          },
          {
            title: 'Typography',
            description: 'Font selection and text styling',
            videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
            duration: 20,
            order: 2,
          },
        ],
      },
      {
        title: 'Node.js and Express',
        description: 'Build powerful backend applications with Node.js and Express framework.',
        instructor: admin._id,
        category: 'Backend',
        price: 54.99,
        lessons: [
          {
            title: 'Getting Started with Node.js',
            description: 'Node.js fundamentals and setup',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 25,
            order: 1,
          },
          {
            title: 'Creating RESTful APIs',
            description: 'Build APIs with Express',
            videoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
            duration: 30,
            order: 2,
          },
        ],
      },
      {
        title: 'MongoDB Mastery',
        description: 'Complete guide to MongoDB - the popular NoSQL database.',
        instructor: admin._id,
        category: 'Database',
        price: 49.99,
        lessons: [
          {
            title: 'Database Design',
            description: 'Planning your MongoDB database',
            videoUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
            duration: 20,
            order: 1,
          },
          {
            title: 'Queries and Aggregation',
            description: 'Advanced MongoDB queries',
            videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 35,
            order: 2,
          },
        ],
      },
    ]);

    console.log(`✅ Database seeded successfully!`);
    console.log(`✅ Created ${courses.length} courses`);
    console.log(`\nDemo Admin Account:`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Password: password123`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
