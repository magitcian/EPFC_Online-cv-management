import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Console } from 'console';
import { Skill } from '../../models/skill';
import { SkillService } from '../../services/skill.service';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { SkillEditComponent } from '../skill-edit/skill-edit.component';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { plainToClass } from 'class-transformer';

@Component({
    selector: 'app-skills-management-form',
    templateUrl: './skills-management-form.component.html',
    styleUrls: ['./skills-management-form.component.css']
})

export class SkillsManagementFormComponent { // implements AfterViewInit, OnDestroy {
    public skills!: Skill[];
    categories: Category[] = [];
    skill!: Skill;
    
    public frm!: FormGroup;
    public ctlId!: FormControl;
    public ctlSkillName!: FormControl;
    public ctlCategoryId!: FormControl;
    public ctlCategory!: FormControl;
    public ctlCategoryName!: FormControl;

    constructor(
        private fb: FormBuilder,
        private skillService: SkillService, 
        private categoryService: CategoryService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar) {
        // this.refresh();
        this.ctlId = this.fb.control('', []);
        this.ctlSkillName = this.fb.control('', []);
        this.ctlCategoryId = this.fb.control('', []);  
        this.ctlCategory = this.fb.control('', []);
        this.ctlCategoryName = this.fb.control('', []);
        // fb.group content needs to respect the JSON we get from backend !
        // this.refresh();
        this.frm = this.fb.group({ // building the form using FormBuilder
            id: this.ctlId,
            skillName: this.ctlSkillName,
            categoryId: this.ctlCategoryId,
            category: this.fb.group({
                id: this.ctlCategoryId,
                name: this.ctlCategoryName
            })
        })
        // this.refresh();
        // console.log(this.skills);
        this.addCategoriesInDropDown();    
        // this.refresh();
        // this.controlInput();
        this.frm.patchValue(this.skill);
        // this.loopOnSkills();
        // console.log(this.skills);
        this.findSkills();
        
    }

    refresh() {
        this.skillService.getAll().subscribe(skills => {
            this.skills = skills;
            // console.log(this.skills);
            // this.loopOnSkills();
        });
        console.log(this.skills);
        // this.loopOnSkills();
    }

    // controlInput() {
    //     this.skills.forEach(skill => 
    //         this.frm.patchValue(skill));
    //         // console.log("test");
    // }

    findSkills() {
        this.skillService.getAll().subscribe(skills => {
            this.skills = skills;
            // console.log(this.skills);
            // this.loopOnSkills();
        });
        console.log(this.skills);
        // this.loopOnSkills();
    }


    loopOnSkills() {
        // console.log(this.skills);
        this.skills.forEach(skill => {
            this.frm.patchValue(skill);
            console.log(skill);
        });
    }
    
    addCategoriesInDropDown() { // to test in constructor to check but also in controlAlim
        this.categoryService.getAll().subscribe(categories => {
            this.categories = categories;
            // console.log(this.categories);
        });
    }

    // ngAfterViewInit(): void {
    //     this.refresh();
    //     console.log(this.skills);
    // }

    // // appelée quand on clique sur le bouton "edit" d'une skill
    // edit(skill: Skill) {
    //     const dlg = this.dialog.open(EditSkillComponent, { data: { skill, isNew: false } });
    //     dlg.beforeClosed().subscribe(res => {
    //         if (res) {
    //             _.assign(skill, res);
    //             res = plainToClass(Skill, res);
    //             this.skillService.update(res).subscribe(res => {
    //                 if (!res) {
    //                     this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
    //                     this.refresh();
    //                 }
    //             });
    //         }
    //     });
    // }

    
    // appelée quand on clique sur le bouton "delete" d'une skill
    delete(skill: Skill) {
        var index = this.skills.indexOf(skill);
        this.skills.splice(index, 1);
        const snackBarRef = this.snackBar.open(`Skill '${skill.name}' will be deleted`, 'Undo', { duration: 3000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.skillService.delete(skill).subscribe();
            else 
                this.refresh();
        });
    }

    // // appelée quand on clique sur le bouton "new skill"
    // create() {
    //     const skill = new Skill();
    //     const dlg = this.dialog.open(EditSkillComponent, { data: { skill, isNew: true } });
    //     dlg.beforeClosed().subscribe(res => {
    //         if (res) {
    //             res = plainToClass(Skill, res);
    //             // this.dataSource.data = [...this.dataSource.data, res];
    //             this.skillService.add(res).subscribe(res => {
    //                 if (!res) {
    //                     this.snackBar.open(`There was an error at the server. The user has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
    //                     this.refresh();
    //                 }
    //             });
    //         }
    //     });
    // }

    // ngOnDestroy(): void {
    //     this.snackBar.dismiss();
    // }

}
