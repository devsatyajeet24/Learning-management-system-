import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
}

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourse();
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

  const handleCompleteLesson = async () => {
    if (!selectedLesson) return;

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

  if (loading || !course) {
    return <div className="text-center py-10">Loading course...</div>;
  }

  const progress = (completedLessons.length / course.lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/courses')}
            className="text-blue-500 hover:underline flex items-center gap-2"
          >
            ← Back to Courses
          </button>
          <div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">{course.title}</h1>
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Course Progress</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {selectedLesson && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-4">{selectedLesson.title}</h2>
                <div className="bg-gray-900 rounded-lg h-96 mb-4 flex items-center justify-center">
                  <iframe
                    width="100%"
                    height="100%"
                    src={selectedLesson.videoUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg"
                  ></iframe>
                </div>
                <p className="text-gray-600 mb-4">{selectedLesson.description}</p>
                <button
                  onClick={handleCompleteLesson}
                  disabled={completedLessons.includes(selectedLesson._id)}
                  className={`w-full py-2 rounded font-semibold ${
                    completedLessons.includes(selectedLesson._id)
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {completedLessons.includes(selectedLesson._id) ? '✓ Completed' : 'Mark as Complete'}
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Lessons</h3>
                <div className="space-y-2">
                  {course.lessons.map((lesson) => (
                    <button
                      key={lesson._id}
                      onClick={() => setSelectedLesson(lesson)}
                      className={`w-full text-left px-4 py-3 rounded transition ${
                        selectedLesson._id === lesson._id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {completedLessons.includes(lesson._id) && <span className="text-green-500">✓</span>}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
