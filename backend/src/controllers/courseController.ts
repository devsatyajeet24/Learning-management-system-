import { Request, Response } from 'express';
import Course from '../models/Course';
import Enrollment from '../models/Enrollment';

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description, category, price, thumbnail } = req.body;

    const course = new Course({
      title,
      description,
      category,
      price,
      thumbnail,
      instructor: req.user?.id,
      lessons: [],
      students: [],
    });

    await course.save();
    res.status(201).json({ message: 'Course created', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name email');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ message: 'Course updated', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addLesson = async (req: Request, res: Response) => {
  try {
    const { title, description, videoUrl, duration, order } = req.body;
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user?.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    course.lessons.push({ title, description, videoUrl, duration, order } as any);
    await course.save();

    res.json({ message: 'Lesson added', course });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
