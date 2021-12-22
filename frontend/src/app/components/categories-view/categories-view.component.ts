import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service'
import { CategoryService } from '../../services/category.service'
import { Category } from 'src/app/models/category';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-categories-view', 
    templateUrl: './categories-view.component.html',
    styleUrls: ['./categories-view.component.css']
})

export class CategoriesViewComponent {
    @Input() set getUserID(val: number) {
        this.userCvId = val;
        this.refresh();
    }
    @Input() categories!: Category[]; // on doit l'initialiser dans le constructeur // categories: Category[] = [];
    @Input() isEditable!: boolean;

    userCvId!: number;
    isEditMode: boolean = false;
    
    constructor(
        private userService: UserService,
        private categoryService: CategoryService, 
        public dialog: MatDialog, 
        public snackBar: MatSnackBar) {
       
    }

    refresh() {
        this.userService.getCategoriesWithDetails(this.userCvId).subscribe(categories => {
            this.categories = categories;
        });
    }

    // // appelée quand on clique sur le bouton "edit" d'une skill
    // edit(skill: Skill) {
    // }

    changeEditMode() {
        if (this.isEditable) {
            this.isEditMode = !this.isEditMode;
        }
    }

}