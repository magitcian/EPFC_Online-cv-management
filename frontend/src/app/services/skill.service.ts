import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Skill } from '../models/skill';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SkillService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Skill[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/skills`)
            .pipe(map(res => plainToClass(Skill, res))
            );
    }

    getById(skillID: number) {
        return this.http.get<Skill>(`${this.baseUrl}api/skills/${skillID}`).pipe(
            map(s => plainToClass(Skill, s)),
            catchError(err => of(null))
        );
    }

    public update(s: Skill): Observable<boolean> {
        return this.http.put<Skill>(`${this.baseUrl}api/skills`, s).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(s: Skill): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/skills/${s.id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(s: Skill): Observable<boolean> {
        return this.http.post<Skill>(`${this.baseUrl}api/skills`, s).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public isNameAvailable(skillId: number, name: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}api/skills/name-available/${name}/${skillId}`);
    }

    // public isNameAvailable(email: string, password: string, firstName: string, lastName: string): Observable<User> {
    //     return this.http.post<User>(`${this.baseUrl}api/users/signup`, { email: email, password: password, firstName: firstName, lastName: lastName }).pipe(
    //         mergeMap(res => this.login(email, password)),
    //     );
    // }

}