import mongoose, { Schema, Document } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  order: number;
}

export interface ICourse extends Document {
  title: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  category: string;
  thumbnail: string;
  lessons: ILesson[];
  students: mongoose.Types.ObjectId[];
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: [true, 'Please provide lesson title'],
  },
  description: String,
  videoUrl: {
    type: String,
    required: [true, 'Please provide video URL'],
  },
  duration: Number,
  order: Number,
});

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Please provide course title'],
    },
    description: {
      type: String,
      required: [true, 'Please provide course description'],
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: String,
    thumbnail: String,
    lessons: [lessonSchema],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>('Course', courseSchema);
