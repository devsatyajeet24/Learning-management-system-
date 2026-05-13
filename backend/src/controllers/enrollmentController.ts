import { Request, Response } from 'express';
import Enrollment from '../models/Enrollment';
import Course from '../models/Course';

export const enrollCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user?.id;

    // Check if already enrolled
    let enrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (enrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Add student to course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const studentIdObj = require('mongoose').Types.ObjectId(studentId!);
    if (!course.students.includes(studentIdObj)) {
      course.students.push(studentIdObj);
      await course.save();
    }

    // Create enrollment record
    enrollment = new Enrollment({
      student: studentId,
      course: courseId,
      progress: 0,
      completedLessons: [],
    });

    await enrollment.save();
    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getStudentCourses = async (req: Request, res: Response) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user?.id })
      .populate('course')
      .populate('student', 'name email');

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const completeLesson = async (req: Request, res: Response) => {
  try {
    const { courseId, lessonId } = req.body;

    let enrollment = await Enrollment.findOne({
      student: req.user?.id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
    }

    const course = await Course.findById(courseId);
    if (course) {
      const progress = (enrollment.completedLessons.length / course.lessons.length) * 100;
      enrollment.progress = Math.round(progress);
    }

    await enrollment.save();
    res.json({ message: 'Lesson marked complete', enrollment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getEnrollmentStats = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.courseId;
    const enrollments = await Enrollment.find({ course: courseId }).populate('student', 'name email');

    const stats = {
      totalEnrollments: enrollments.length,
      averageProgress: Math.round(
        enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length || 0
      ),
      enrollments,
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
