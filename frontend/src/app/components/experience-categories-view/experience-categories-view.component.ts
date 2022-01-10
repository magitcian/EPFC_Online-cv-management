import { Component, Input } from '@angular/core';
import { ExperienceService } from '../../services/experience.service';
import { Category } from 'src/app/models/category';
import { Experience } from 'src/app/models/experience';

@Component({
    selector: 'app-experience-categories-view', 
    templateUrl: './experience-categories-view.component.html',
    styleUrls: ['./experience-categories-view.component.css']
})

export class ExperienceCategoriesViewComponent {
    @Input() set getExperience(val: Experience) {
        this.experience = val;
        this.refresh();
    }

    experience!: Experience;
    categories!: Category[]; 
    
    constructor(
        private experienceService: ExperienceService) {
       
    }

    refresh() {
        this.experienceService.getCategoriesWithUsings(this.experience.id).subscribe(categories => {
            this.categories = categories;
            console.log(this.categories);
        });
    }

}