import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface Enrollment {
  _id: string;
  course: {
    _id: string;
    title: string;
    description: string;
    category: string;
    price: number;
    lessons: any[];
    instructor?: {
      name: string;
    };
  };
  progress: number;
  completedLessons: string[];
}

export default function StudentCourses() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    averageProgress: 0,
    totalLessonsCompleted: 0,
  });
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      const { data } = await api.get('/enrollments/my-courses');
      setEnrollments(data);

      // Calculate stats
      const totalCourses = data.length;
      const completedCourses = data.filter((e: Enrollment) => e.progress === 100).length;
      const averageProgress =
        totalCourses > 0
          ? Math.round(data.reduce((sum: number, e: Enrollment) => sum + e.progress, 0) / totalCourses)
          : 0;
      const totalLessonsCompleted = data.reduce((sum: number, e: Enrollment) => sum + e.completedLessons.length, 0);

      setStats({
        totalCourses,
        completedCourses,
        averageProgress,
        totalLessonsCompleted,
      });
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/course/${courseId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleHomePage = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">EduLearn</h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-500">Welcome</p>
                <p className="text-lg font-semibold text-gray-800">{state.user?.name}</p>
              </div>
              <button
                onClick={handleHomePage}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Browse Courses
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">My Learning Dashboard</h2>
          <p className="text-gray-600">Track your progress and continue where you left off</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Courses */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Courses</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                📚
              </div>
            </div>
          </div>

          {/* Completed Courses */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.completedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">
                ✅
              </div>
            </div>
          </div>

          {/* Average Progress */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Avg Progress</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.averageProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl">
                📈
              </div>
            </div>
          </div>

          {/* Lessons Completed */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Lessons Done</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalLessonsCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-2xl">
                🎬
              </div>
            </div>
          </div>
        </div>

        {/* Enrolled Courses Section */}
        {enrollments.length > 0 ? (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">My Subscribed Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment._id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                >
                  {/* Course Header */}
                  <div className="h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -mr-20 -mt-20"></div>
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                          {enrollment.course.category}
                        </span>
                        {enrollment.progress === 100 && (
                          <span className="text-2xl">🏆</span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold">{enrollment.course.title}</h3>
                    </div>
                  </div>

                  {/* Course Body */}
                  <div className="p-6">
                    {/* Instructor */}
                    {enrollment.course.instructor && (
                      <p className="text-sm text-gray-500 mb-3">
                        👨‍🏫 {enrollment.course.instructor.name}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {enrollment.course.description}
                    </p>

                    {/* Course Stats */}
                    <div className="flex justify-between text-sm mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-1 text-gray-600">
                        <span>🎬</span>
                        <span>{enrollment.course.lessons.length} lessons</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <span>✓</span>
                        <span>{enrollment.completedLessons.length} done</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-semibold text-gray-700">Progress</span>
                        <span className="text-xs font-bold text-blue-600">{enrollment.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Continue Learning Button */}
                    <button
                      onClick={() => handleViewCourse(enrollment.course._id)}
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        enrollment.progress === 100
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                      }`}
                    >
                      {enrollment.progress === 100 ? '🎉 Completed!' : 'Continue Learning'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Courses Yet</h3>
            <p className="text-gray-600 mb-8">You haven't subscribed to any courses yet.</p>
            <button
              onClick={handleHomePage}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition"
            >
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
