import { Lesson } from './../../model/lesson';
import { Component, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, UntypedFormArray, Validators } from '@angular/forms';
import { CoursesService } from '../../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Course } from '../../model/course';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
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
    private route: ActivatedRoute
  ) {}

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
      alert("Formulário está inválido!")
    }

  }

  private onSucces() {
    this.snackBar.open('Curso salvo com sucesso!.', '',{ duration: 5000 });
    this.onCancel();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar o curso.', '',{ duration: 5000 });
  }

  getErrorMessage(fieldName: string) {
    const field = this.form.get(fieldName)

    if (field?.hasError('required')) {
      return 'Campo obrigatório!';
    }

    if (field?.hasError('minlength')) {
      const requiredLength: number = field.errors ? field.errors
      ['minlength']['requiredLength'] : 5;
      return `O tamanho mínimo precisa ser de ${requiredLength} caracteres!`;
    }

    if (field?.hasError('maxlength')) {
      const requiredLength: number = field.errors ? field.errors
      ['maxlength']['requiredLength'] : 100;
      return `Tamanho máximo excedito de ${requiredLength} caracteres!`;
    }

    return 'Campo inválido!'
  }

  isFormArrayRequired() {
    const lessons = this.form.get('lessons') as UntypedFormArray;
    return !lessons.valid && lessons.hasError('required') && lessons.touched;
  }
}
