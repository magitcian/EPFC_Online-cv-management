import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExperienceService } from '../../services/experience.service';
import { Category } from 'src/app/models/category';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-training-categories-view', 
    templateUrl: './training-categories-view.component.html',
    styleUrls: ['./training-categories-view.component.css']
})

export class TrainingCategoriesViewComponent {
    @Input() set getTrainingID(val: number) {
        this.experienceId = val;
        this.refresh();
    }
    experienceId!: number;

    @Input() isEditable!: boolean;

    isEditMode: boolean = false;

    categories!: Category[]; 
    
    constructor(
        private experienceService: ExperienceService,
        public dialog: MatDialog, 
        public snackBar: MatSnackBar) {
       
    }

    refresh() {
        this.experienceService.getCategoriesWithUsings(this.experienceId).subscribe(categories => {
            this.categories = categories;
            console.log(this.categories);
        });
    }

    changeEditMode() {
        if (this.isEditable) {
            this.isEditMode = !this.isEditMode;
        }
    }

}