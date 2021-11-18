import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, mergeMap } from 'rxjs/operators';
import { Member } from '../models/member';
import { plainToClass } from 'class-transformer';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    // l'utilisateur couramment connecté (undefined sinon)
    public currentUser?: Member;

    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
        // au départ on récupère un éventuel utilisateur stocké dans le sessionStorage
        let data = sessionStorage.getItem('currentUser');
        if (data)
            data = JSON.parse(data);
        this.currentUser = plainToClass(Member, data);
    }

    login(pseudo: string, password: string) {
        return this.http.post<any>(`${this.baseUrl}api/members/authenticate`, { pseudo, password })
            .pipe(map(user => {
                user = plainToClass(Member, user);
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUser = user;
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        sessionStorage.removeItem('currentUser');
        this.currentUser = undefined;
    }

    public isPseudoAvailable(pseudo: string): Observable<boolean> {
        return this.http.get<boolean>(`${this.baseUrl}api/members/available/${pseudo}`);
    }

    public signup(pseudo: string, password: string): Observable<Member> {
        return this.http.post<Member>(`${this.baseUrl}api/members/signup`, { pseudo: pseudo, password: password }).pipe(
            mergeMap(res => this.login(pseudo, password)),
        );
    }
}
