import { Router } from 'express';
import {
  enrollCourse,
  getStudentCourses,
  completeLesson,
  getEnrollmentStats,
} from '../controllers/enrollmentController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

router.post('/enroll', authMiddleware, roleMiddleware(['student']), enrollCourse);
router.get('/my-courses', authMiddleware, roleMiddleware(['student']), getStudentCourses);
router.post('/complete-lesson', authMiddleware, roleMiddleware(['student']), completeLesson);
router.get('/:courseId/stats', authMiddleware, roleMiddleware(['admin']), getEnrollmentStats);

export default router;
