import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CategoryService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Category[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/categories`)
            .pipe(map(res => plainToClass(Category, res))
            );
    }

    public update(c: Category): Observable<boolean> {
        return this.http.put<Category>(`${this.baseUrl}api/categories`, c).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(c: Category): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/categories/${c.id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(c: Category): Observable<boolean> {
        return this.http.post<Category>(`${this.baseUrl}api/categories`, c).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

}
