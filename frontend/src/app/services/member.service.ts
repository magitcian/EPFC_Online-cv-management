import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Member } from '../models/member';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { Friend } from '../models/friend';

@Injectable({ providedIn: 'root' })
export class MemberService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<Member[]> {
        // new
        return this.http.get<any[]>(`${this.baseUrl}api/members`)
            .pipe(map(res => plainToClass(Member, res))
            );

        // old
        // return this.http.get<Member[]>(`${this.baseUrl}api/members`)
        //     .pipe(map(res => res.map(m => new Member(m))));
    }
    
    getById(pseudo: string) {
        return this.http.get<Member>(`${this.baseUrl}api/members/${pseudo}`).pipe(
            map(m => plainToClass(Member, m)),
            catchError(err => of(null))
        );
    }

    public update(m: Member): Observable<boolean> {
        return this.http.put<Member>(`${this.baseUrl}api/members`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(m: Member): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/members/${m.pseudo}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(m: Member): Observable<boolean> {
        return this.http.post<Member>(`${this.baseUrl}api/members`, m).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public getMembersWithRelationship(pseudo: string): Observable<Friend[]> {
        return this.http.get<any[]>(`${this.baseUrl}api/members/rels/${pseudo}`).pipe(
            map(res => plainToClass(Friend, res)),
            catchError(err => {
                console.error(err);
                return of([]);
            })
        );
    }
    
    public follow(follower: string, followee: string): Observable<boolean> {
        return this.http.post(`${this.baseUrl}api/members/follow`, { follower, followee }).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    
    public unfollow(follower: string, followee: string) {
        return this.http.post(`${this.baseUrl}api/members/unfollow`, { follower, followee }).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }
    
}
