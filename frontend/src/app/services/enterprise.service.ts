import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Enterprise } from '../models/enterprise';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';


@Injectable({ providedIn: 'root' })
export class EnterpriseService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Enterprise[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/enterprises`)
            .pipe(map(res => plainToClass(Enterprise, res))
            );
    }

    public update(e: Enterprise): Observable<boolean> {
        return this.http.put<Enterprise>(`${this.baseUrl}api/enterprises`, e).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(e: Enterprise): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/enterprises/${e.id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(e: Enterprise): Observable<boolean> {
        return this.http.post<Enterprise>(`${this.baseUrl}api/enterprises`, e).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public isNameAvailable(name: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}api/enterprises/name-available/${name}`);
    }
    
}
