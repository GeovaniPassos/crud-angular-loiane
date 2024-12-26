import { Component, OnInit } from '@angular/core';
import { NonNullableFormBuilder } from '@angular/forms';
import { CoursesService } from '../services/courses.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-course-form',
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss']
})
export class CourseFormComponent implements OnInit {

  form = this.formBuilder.group({
    name: [''],
    category: ['']
  });

  constructor(private formBuilder: NonNullableFormBuilder,
    private service: CoursesService,
    private snackBar: MatSnackBar,
    private location: Location) {

  }

  ngOnInit(): void {
  }

  onCancel() {
    this.location.back();
  }

  onSubmit() {
    this.service.save(this.form.value)
    .subscribe(result => this.onSucces(), error => this.onError());
  }

  private onSucces() {
    this.snackBar.open('Curso salvo com sucesso!.', '',{ duration: 5000 });
    this.onCancel();
  }

  private onError() {
    this.snackBar.open('Erro ao salvar o curso.', '',{ duration: 5000 });
  }
}
