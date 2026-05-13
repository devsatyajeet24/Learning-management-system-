import mongoose, { Schema, Document } from 'mongoose';

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrolledAt: Date;
  progress: number;
  completedLessons: mongoose.Types.ObjectId[];
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    completedLessons: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IEnrollment>('Enrollment', enrollmentSchema);
