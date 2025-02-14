import { Lesson } from './../../model/lesson';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location, NgIf, NgFor } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';
import { FormUtilsService } from 'src/app/shared/form/form-utils.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatHint, MatError, MatLabel, MatPrefix } from '@angular/material/form-field';
import { MatToolbar } from '@angular/material/toolbar';
import { MatCard, MatCardContent, MatCardActions } from '@angular/material/card';

@Component({
    selector: 'app-course-form',
    templateUrl: './course-form.component.html',
    styleUrls: ['./course-form.component.scss'],
    standalone: true,
    imports: [MatCard, MatToolbar, MatCardContent, ReactiveFormsModule, MatFormField, MatInput, MatHint, NgIf, MatError, MatLabel, MatSelect, MatOption, MatIconButton, MatIcon, NgFor, MatPrefix, MatCardActions, MatButton]
})
export class CourseFormComponent implements OnInit {

  form!: FormGroup;

  /*
  form = this.formBuilder.group({
    _id: [''],
    name: ['',[Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100)]],
    category: ['',[Validators.required]],
  });*/

  constructor(private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location,
    private route: ActivatedRoute,
    public formUtils: FormUtilsService) {}

  ngOnInit(): void {
    const course: Course = this.route.snapshot.data['course'];
    // this.form.setValue({
    //   _id: course._id,
    //   name: course.name,
    //   category: course.category
    //});
    //console.log(course);
    this.form = this.formBuilder.group({
      _id: [course._id],
      name: [course.name,[Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100)]],
      category: [course.category,[Validators.required]],
      lessons: this.formBuilder.array(this.retrieveLessons(course), Validators.required)
    });
  }

  private retrieveLessons(course: Course) {
    const lessons = [];
    if (course?.lessons) {
      course.lessons.forEach(lesson => lessons.push(this.createLesson(lesson)));
    } else {
      lessons.push(this.createLesson());
    }
    return lessons;
  }

  private createLesson(lesson: Lesson = {_id: '', name: '', youtubeUrl: ''}) {
    return this.formBuilder.group({
      _id: [lesson._id],
      name: [lesson.name, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
      ],
      youtubeUrl: [lesson.youtubeUrl,   [Validators.required, Validators.minLength(10), Validators.maxLength(20)]
      ]
    });
  }

  getLessonFormArray() {
    return (<UntypedFormArray>this.form.get('lessons')).controls;
  }

  addNewLesson() {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.push(this.createLesson());
  }

  removeLesson(index: number) {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    lessons.removeAt(index);
  }

  onCancel() {
    this.location.back();
  }

  onSubmit() {
    if (this.form.valid) {
      this.service.save(this.form.value)
        .subscribe(result => this.onSucces(), error => this.onError());
    } else {
      this.formUtils.validatedAllFormFilds(this.form);
    }
  }

  private onSucces() {
    this.snackBar.open('Curso salvo com sucesso!.', '',{ duration: 5000 });
    this.onCancel();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar o curso.', '',{ duration: 5000 });
  }
}
