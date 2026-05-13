import { Router } from 'express';
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  addLesson,
} from '../controllers/courseController';
import { authMiddleware, roleMiddleware } from '../middleware/auth';

const router = Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);
router.post('/', authMiddleware, roleMiddleware(['admin']), createCourse);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteCourse);
router.post('/:id/lessons', authMiddleware, roleMiddleware(['admin']), addLesson);

export default router;
