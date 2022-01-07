import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mastering } from '../models/mastering';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class MasteringService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    public delete(m: Mastering): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/masterings/${m.id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public update(m: Mastering): Observable<boolean> {
        return this.http.put<Mastering>(`${this.baseUrl}api/masterings`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(m: Mastering): Observable<boolean> {
        return this.http.post<Mastering>(`${this.baseUrl}api/masterings`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public getIsEnoughExperience(masteringID: number): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}api/masterings/is-enough-experiences/${masteringID}`).pipe(
            map(res => res)
            //,catchError(err => of(null))
        );
    }
    
}
