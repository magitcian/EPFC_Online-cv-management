import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { Category } from '../models/category';
import { Training } from '../models/training';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';


@Injectable({ providedIn: 'root' })
export class TrainingService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getById(trainingID: number) { 
        return this.http.get<Training>(`${this.baseUrl}api/trainings/${trainingID}`).pipe(
            map(t => plainToClass(Training, t)),
            catchError(err => of(null))
        );
    }

    public delete(t: Training): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/trainings/${t.id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public update(t: Training): Observable<boolean> {
        return this.http.put<Training>(`${this.baseUrl}api/trainings`, t).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(t: Training): Observable<boolean> {
        return this.http.post<Training>(`${this.baseUrl}api/trainings`, t).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    
}
