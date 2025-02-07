import { Course } from './course';

export interface CoursePage {
  courses: Course[];
  totalElements: number;
  totalPages: Number;
}
