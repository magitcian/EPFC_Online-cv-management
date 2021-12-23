import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Console } from 'console';
import { Skill } from '../../models/skill';
import { SkillService } from '../../services/skill.service';
import * as _ from 'lodash-es';
import { EditSkillComponent } from '../edit-skill/edit-skill.component';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { plainToClass } from 'class-transformer';

@Component({
    selector: 'app-skills-management',
    templateUrl: './skills-management.component.html',
    styleUrls: ['./skills-management.component.css']
})

export class SkillsManagementComponent { // implements AfterViewInit, OnDestroy {
    skills: Skill[] = [];

    constructor(
        private skillService: SkillService, 
        public dialog: MatDialog,
        public snackBar: MatSnackBar) {
        this.refresh();
    }

    refresh() {
        this.skillService.getAll().subscribe(skills => {
            this.skills = skills;
        });
    }

    // ngAfterViewInit(): void {
    //     this.refresh();
    // }

    // // appelée quand on clique sur le bouton "edit" d'une skill
    edit(skill: Skill) {
        const dlg = this.dialog.open(EditSkillComponent, { data: { skill, isNew: false } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                _.assign(skill, res);
                res = plainToClass(Skill, res);
                this.skillService.update(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                    }
                });
            }
        });
    }

    
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
    create() {
        const skill = new Skill();
        const dlg = this.dialog.open(EditSkillComponent, { data: { skill, isNew: true } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                res = plainToClass(Skill, res);
                // this.dataSource.data = [...this.dataSource.data, res];
                this.skillService.add(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The user has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                    }
                });
            }
        });
    }

    // ngOnDestroy(): void {
    //     this.snackBar.dismiss();
    // }

}
