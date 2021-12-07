import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Skill } from '../../models/skill';
import { SkillService } from '../../services/skill.service'
import { CategoryService } from '../../services/category.service'
import { Category } from 'src/app/models/category';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-categories-view', 
    templateUrl: './categories-view.component.html',
    // styleUrls: // TODO to add
})

export class CategoriesViewComponent {
    @Input() categories!: Category[]; // on doit l'initialiser dans le constructeur // categories: Category[] = [];
    // @Input() skills!: Skill[];  // skills: Skill[] = [];

    constructor(
        private categoryService: CategoryService, 
        public dialog: MatDialog, 
        public snackBar: MatSnackBar) {
       
    }

    // // appelée quand on clique sur le bouton "edit" d'une skill
    // edit(skill: Skill) {
    // }

    
    // // appelée quand on clique sur le bouton "delete" d'une skill
    // delete(skill: Skill) {
    //     const snackBarRef = this.snackBar.open(`Skill '${skill.name}' will be deleted`, 'Undo', { duration: 10000 });
    //     snackBarRef.afterDismissed().subscribe(res => {
    //         if (!res.dismissedByAction)
    //             this.skillService.delete(skill).subscribe();
    //         // else
    //         //     this.dataSource.data = backup;
    //     });
    // }

    // // appelée quand on clique sur le bouton "new skill"
    // create() {
    // }

}