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
    
}
