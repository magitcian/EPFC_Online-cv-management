import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';
// import { Friend } from '../models/friend';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getAll(): Observable<User[]> {
        // new
        return this.http.get<any[]>(`${this.baseUrl}api/users`)
            .pipe(map(res => plainToClass(User, res))
            );

        // old
        // return this.http.get<Member[]>(`${this.baseUrl}api/members`)
        //     .pipe(map(res => res.map(m => new Member(m))));
    }
    
    getById(email: string) { //: Observable<Member> or undefined
        // ça renvoie un observable quand on subscribe à "getById" / renvoie une promesse qu'il exécutera ça
        return this.http.get<User>(`${this.baseUrl}api/users/${email}`).pipe(
            map(u => plainToClass(User, u)),
            catchError(err => of(null))
        );
    }

    public update(u: User): Observable<boolean> {
        return this.http.put<User>(`${this.baseUrl}api/users`, u).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public delete(u: User): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/users/${u.email}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    public add(u: User): Observable<boolean> {
        return this.http.post<User>(`${this.baseUrl}api/users`, u).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }

    // public getMembersWithRelationship(pseudo: string): Observable<Friend[]> {
    //     return this.http.get<any[]>(`${this.baseUrl}api/members/rels/${pseudo}`).pipe(
    //         map(res => plainToClass(Friend, res)),
    //         catchError(err => {
    //             console.error(err);
    //             return of([]);
    //         })
    //     );
    // }
    
    // public follow(follower: string, followee: string): Observable<boolean> {
    //     return this.http.post(`${this.baseUrl}api/members/follow`, { follower, followee }).pipe(
    //         map(res => true),
    //         catchError(err => {
    //             console.error(err);
    //             return of(false);
    //         })
    //     );
    // }
    
    // public unfollow(follower: string, followee: string) {
    //     return this.http.post(`${this.baseUrl}api/members/unfollow`, { follower, followee }).pipe(
    //         map(res => true),
    //         catchError(err => {
    //             console.error(err);
    //             return of(false);
    //         })
    //     );
    // }
    
}
