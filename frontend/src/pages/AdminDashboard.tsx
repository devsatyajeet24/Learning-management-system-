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
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👨‍🏫</span>
            <h1 className="text-2xl font-bold text-white">Instructor Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-white font-semibold">{state.user?.name}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">My Courses</h2>
            <p className="text-gray-600 mt-2">You have {courses.length} course(s)</p>
          </div>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
          >
            {showCreateForm ? '✕ Cancel' : '+ Create New Course'}
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border-l-4 border-purple-600">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">Create New Course</h3>
            <form onSubmit={handleCreateCourse}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Course Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Programming, Design)"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Price ($)"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Thumbnail URL"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                />
              </div>
              <textarea
                placeholder="Course Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
                rows={4}
                required
              ></textarea>
              <button
                type="submit"
                className="mt-4 bg-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-600 transition"
              >
                Create Course
              </button>
            </form>
          </div>
        )}

        {courses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <span className="text-6xl mb-4 block">📚</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No courses yet</h3>
            <p className="text-gray-600 mb-6">Create your first course to get started</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700"
            >
              Create First Course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-600 p-4 text-white flex flex-col justify-end group-hover:shadow-lg">
                  <h3 className="text-lg font-bold">{course.title}</h3>
                  <p className="text-sm opacity-90">{course.category}</p>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
                  <div className="flex justify-between items-center mb-4 text-sm">
                    <span className="font-semibold text-green-600">${course.price}</span>
                    <span className="text-gray-500">{course.lessons.length} lessons</span>
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/admin/course/${course._id}`)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-semibold transition"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-semibold transition"
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
