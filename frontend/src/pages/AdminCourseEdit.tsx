import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

interface Lesson {
  _id?: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  lessons: Lesson[];
}

export default function AdminCourseEdit() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessonForm, setLessonForm] = useState<Lesson>({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
    order: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchCourse();
    }
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
      setLessonForm({ ...lessonForm, order: data.lessons.length + 1 });
    } catch (error) {
      console.error('Failed to fetch course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/courses/${id}/lessons`, lessonForm);
      if (course) {
        setCourse({
          ...course,
          lessons: [...course.lessons, { ...lessonForm, _id: Math.random().toString() }],
        });
      }
      setLessonForm({
        title: '',
        description: '',
        videoUrl: '',
        duration: 0,
        order: (course?.lessons.length || 0) + 2,
      });
      alert('Lesson added successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add lesson');
    }
  };

  if (loading || !course) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <button onClick={() => navigate('/admin')} className="text-blue-500 hover:underline">
            ← Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{course.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Add Lesson</h2>
              <form onSubmit={handleAddLesson}>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Lesson Title"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                  <textarea
                    placeholder="Description"
                    value={lessonForm.description}
                    onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    rows={3}
                  ></textarea>
                  <input
                    type="text"
                    placeholder="Video URL (YouTube embed)"
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={lessonForm.duration}
                      onChange={(e) => setLessonForm({ ...lessonForm, duration: Number(e.target.value) })}
                      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Order"
                      value={lessonForm.order}
                      onChange={(e) => setLessonForm({ ...lessonForm, order: Number(e.target.value) })}
                      className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600"
                  >
                    Add Lesson
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold mb-4">Lessons ({course.lessons.length})</h3>
              <div className="space-y-2">
                {course.lessons.map((lesson, idx) => (
                  <div key={idx} className="p-3 bg-gray-100 rounded">
                    <p className="font-semibold text-sm">{lesson.title}</p>
                    <p className="text-xs text-gray-600">{lesson.duration} min</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
