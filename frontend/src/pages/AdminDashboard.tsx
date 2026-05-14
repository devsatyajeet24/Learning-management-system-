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
}

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    thumbnail: '',
  });
  const [loading, setLoading] = useState(true);
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data.filter((c: Course) => c.lessons)); // Only show admin's courses
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/courses', formData);
      setCourses([...courses, data.course]);
      setFormData({ title: '', description: '', category: '', price: 0, thumbnail: '' });
      setShowCreateForm(false);
      alert('Course created successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create course');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await api.delete(`/courses/${courseId}`);
      setCourses(courses.filter((c) => c._id !== courseId));
      alert('Course deleted!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg sticky top-0 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer hover:scale-105 smooth-transition" onClick={() => navigate('/')}>
            <span className="text-2xl animate-bounce-slow">👨‍🏫</span>
            <h1 className="text-2xl font-bold text-white">Instructor Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold animate-fade-in">{state.user?.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 smooth-transition hover:scale-110 hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 animate-fade-in-up">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 animate-slide-in-left">📊 My Courses</h2>
            <p className="text-gray-600 mt-2 animate-slide-in-left stagger-2">You have <span className="font-bold text-purple-600">{courses.length}</span> course(s)</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold smooth-transition hover:shadow-xl hover:scale-110 transform animate-fade-in-up stagger-3"
          >
            {showCreateForm ? '✕ Cancel' : '+ Create New Course'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border-l-4 border-purple-600 animate-fade-in-up stagger-4 transform hover:shadow-2xl smooth-transition">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Create New Course</h3>
            <form onSubmit={handleCreateCourse}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none smooth-transition hover:border-purple-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Programming, Design)"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none smooth-transition hover:border-purple-400"
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none smooth-transition hover:border-purple-400"
                />
                <input
                  type="text"
                  placeholder="Thumbnail URL"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none smooth-transition hover:border-purple-400"
                />
              </div>
              <textarea
                placeholder="Course Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none smooth-transition hover:border-purple-400"
                rows={4}
                required
              ></textarea>
              <button
                type="submit"
                className="mt-4 bg-green-500 text-white px-8 py-3 rounded-lg font-semibold smooth-transition hover:bg-green-600 hover:scale-110 hover:shadow-lg transform"
              >
                Create Course
              </button>
            </form>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center animate-fade-in-up">
            <span className="text-6xl mb-4 block animate-bounce-slow">📚</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 animate-slide-in-down">No courses yet</h3>
            <p className="text-gray-600 mb-6 animate-fade-in">Create your first course to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold smooth-transition hover:bg-purple-700 hover:scale-110 hover:shadow-lg transform"
            >
              Create First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md smooth-transition-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-3 overflow-hidden group cursor-pointer animate-fade-in-up"
                style={{animationDelay: `${idx * 0.05}s`}}
              >
                <div className="h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-pink-600 p-4 text-white flex flex-col justify-end group-hover:from-purple-600 group-hover:via-pink-600 group-hover:to-pink-700 smooth-transition relative overflow-hidden">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white smooth-transition"></div>
                  <h3 className="text-lg font-bold relative z-10">{course.title}</h3>
                  <p className="text-sm opacity-90 relative z-10">{course.category}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="font-semibold text-green-600 animate-pulse">${course.price}</span>
                    <span className="text-gray-500">🎬 {course.lessons.length} lessons</span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/admin/course/${course._id}`)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg smooth-transition hover:bg-blue-700 hover:shadow-lg font-semibold transform hover:scale-105"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="w-full bg-red-500 text-white py-2 rounded-lg smooth-transition hover:bg-red-600 hover:shadow-lg font-semibold transform hover:scale-105"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
