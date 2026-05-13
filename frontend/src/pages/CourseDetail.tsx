import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

interface Lesson {
  _id: string;
  title: string;
  videoUrl: string;
  description: string;
  duration: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  instructor?: { name: string };
}

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const { state } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse();
    checkEnrollment();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
      if (data.lessons.length > 0) {
        setSelectedLesson(data.lessons[0]);
      }
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!state.token) return;
    try {
      const { data } = await api.get('/enrollments/my-courses');
      const isEnrolled = data.some((e: any) => e.course._id === id || e.course === id);
      setEnrolled(isEnrolled);
    } catch (error) {
      console.error('Failed to check enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!state.token) {
      navigate('/login');
      return;
    }

    setIsEnrolling(true);
    try {
      await api.post('/enrollments/enroll', { courseId: id });
      setEnrolled(true);
      alert('Enrolled successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Enrollment failed');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!selectedLesson || !enrolled) return;

    try {
      await api.post('/enrollments/complete-lesson', {
        courseId: id,
        lessonId: selectedLesson._id,
      });
      setCompletedLessons([...completedLessons, selectedLesson._id]);
    } catch (error) {
      console.error('Failed to mark lesson complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin text-4xl">⏳</div>
          <p className="text-gray-600 mt-4">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600">Course not found</p>
        </div>
      </div>
    );
  }

  const progress = enrolled ? (completedLessons.length / course.lessons.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline flex items-center gap-2 font-semibold"
          >
            ← Back to Courses
          </button>
          <div>
            {state.token ? (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  navigate('/');
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Course Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white mb-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg opacity-90 mb-4">{course.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-6">
              <div>
                <span className="opacity-75">Instructor</span>
                <p className="font-semibold">{course.instructor?.name || 'Expert Instructor'}</p>
              </div>
              <div>
                <span className="opacity-75">Lessons</span>
                <p className="font-semibold">{course.lessons.length} videos</p>
              </div>
            </div>
            {!enrolled && (
              <button
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 disabled:opacity-50"
              >
                {isEnrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>

        {enrolled ? (
          <>
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-800">Your Progress</span>
                <span className="font-bold text-blue-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-4">
                <div
                  className="bg-green-500 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {selectedLesson && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Video Player */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="bg-black h-96">
                      <iframe
                        width="100%"
                        height="100%"
                        src={selectedLesson.videoUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-6">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        {selectedLesson.title}
                      </h2>
                      <p className="text-gray-600 mb-6">{selectedLesson.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">⏱️ {selectedLesson.duration} minutes</span>
                        <button
                          onClick={handleCompleteLesson}
                          disabled={completedLessons.includes(selectedLesson._id)}
                          className={`px-6 py-2 rounded-lg font-semibold transition ${
                            completedLessons.includes(selectedLesson._id)
                              ? 'bg-green-500 text-white cursor-not-allowed'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {completedLessons.includes(selectedLesson._id)
                            ? '✓ Completed'
                            : 'Mark as Complete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson List */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Course Lessons</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {course.lessons.map((lesson) => (
                        <button
                          key={lesson._id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-2 ${
                            selectedLesson._id === lesson._id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }`}
                        >
                          {completedLessons.includes(lesson._id) && (
                            <span className="text-green-500">✓</span>
                          )}
                          <span className="truncate flex-1">{lesson.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enroll to Watch</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Sign up and enroll in this course to access all video lessons and track your progress.
            </p>
            <button
              onClick={handleEnroll}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700"
            >
              Enroll Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
