import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  lessons: any[];
  instructor?: { name: string; email: string };
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();
  const { state } = useAuth();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['All', ...new Set(courses.map((c) => c.category).filter(Boolean))];

  const handleEnroll = (courseId: string) => {
    if (!state.token) {
      navigate('/login');
      return;
    }
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div
            onClick={() => navigate('/')}
            className="cursor-pointer flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="font-bold text-blue-600">📚</span>
            </div>
            <h1 className="text-2xl font-bold text-white">EduLearn</h1>
          </div>

          <div className="flex items-center gap-4">
            {state.token ? (
              <>
                <span className="text-white">{state.user?.name}</span>
                <button
                  onClick={() => navigate(state.user?.role === 'admin' ? '/admin' : '/courses')}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
                >
                  {state.user?.role === 'admin' ? 'Dashboard' : 'My Courses'}
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                  }}
                  className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-white hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 -mr-48 -mt-48 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-200 rounded-full opacity-20 -ml-36 -mb-36 animate-float" style={{animationDelay: '1s'}}></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 animate-fade-in-up">
            Learn Anything, Anytime, Anywhere
          </h2>
          <p className="text-xl text-gray-600 mb-8 animate-fade-in-up stagger-2">
            Explore our comprehensive collection of courses and start your learning journey today
          </p>
          <div className="flex justify-center gap-4 animate-fade-in-up stagger-3">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none smooth-transition hover:border-blue-400 shadow-lg hover:shadow-xl"
              />
              <span className="absolute right-4 top-3 text-gray-400">🔍</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-3 overflow-x-auto pb-4 animate-fade-in-up stagger-4">
          {categories.map((category, idx) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold smooth-transition ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50 scale-105'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:scale-105'
              }`}
              style={{animationDelay: `${idx * 0.05}s`}}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin">⏳</div>
            <p className="text-gray-600 mt-2">Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-2xl text-gray-600">No courses found</p>
            <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Available Courses ({filteredCourses.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden group"
                >
                  {/* Course Header Image */}
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white flex flex-col justify-end group-hover:from-blue-600 group-hover:to-indigo-700 transition">
                    <h3 className="text-2xl font-bold mb-2">{course.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                        {course.category}
                      </span>
                      <span className="text-sm">📚 {course.lessons.length} lessons</span>
                    </div>
                  </div>

                  {/* Course Body */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>

                    {/* Instructor Info */}
                    {course.instructor && (
                      <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                        <span>👨‍🏫</span>
                        <span>{course.instructor.name}</span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div>
                        {course.price > 0 ? (
                          <span className="text-3xl font-bold text-green-600">${course.price}</span>
                        ) : (
                          <span className="text-2xl font-bold text-green-600">FREE</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleEnroll(course._id)}
                        className={`px-6 py-2 rounded-lg font-semibold transition ${
                          state.token
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                      >
                        {state.token ? 'Enroll' : 'View'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2026 EduLearn. All rights reserved.</p>
          <p className="text-gray-400 mt-2">Empowering learners worldwide 🌍</p>
        </div>
      </footer>
    </div>
  );
}
