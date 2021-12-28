import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { Experience } from '../models/experience';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { plainToClass } from 'class-transformer';


@Injectable({ providedIn: 'root' })
export class ExperienceService {
    constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

    getCategoriesWithUsings(experienceID: number): Observable<Category[]> {
        // ça renvoie un observable quand on subscribe à "getById" / renvoie une promesse qu'il exécutera ça
        return this.http.get<any[]>(`${this.baseUrl}api/experiences/experience_categoriesWithUsings/${experienceID}`).pipe(
            map(c => plainToClass(Category, c))
            //,catchError(err => of(null))
        );
    }  
    
}
