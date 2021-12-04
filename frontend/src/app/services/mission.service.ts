import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Mission } from '../models/mission';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';


@Injectable({ providedIn: 'root' })
export class MissionService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    public delete(m: Mission): Observable<boolean> {
        return this.http.delete<boolean>(`${this.baseUrl}api/missions/${m.id}`).pipe(
            map(res => true),
            catchError(err => {
                console.error(err);
                return of(false);
            })
        );
    }


    
}
