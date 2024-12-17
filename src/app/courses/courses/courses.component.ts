import { CoursesService } from './../services/courses.service';
import { Component, OnInit } from '@angular/core';
import { Course } from '../model/course';
import { Observable, of } from 'rxjs';
import { tap, take, first, delay, catchError} from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {

  courses$: Observable<Course[]>;
  displayedColumns = ['name', 'category'];

  //coursesService: CoursesService;

  constructor(
    private coursesService: CoursesService,
    public dialog: MatDialog ){
    //this.courses = [];
    /*
    this.coursesService = new CoursesService();
    this.courses = this.coursesService.list();
    */
    this.courses$ = this.coursesService.list()
      .pipe(
        catchError(error => {
          this.onError('Error ao carregar a lista de cursos.');
          return of([])
        }),
        //take(1),
        //delay(500),
        // or first(),
        //tap(courses => console.log(courses))
      );

      //subscribe manual
      //this.coursesService.list().subriscribe(courses => this.courses = courses);
  }

  onError(errorMsg: string) {
    this.dialog.open(ErrorDialogComponent, {
      data: errorMsg
    });
  }

  ngOnInit(): void {
  }
}
