import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Console } from 'console';
import { Skill } from '../../models/skill';
import { SkillService } from '../../services/skill.service';
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
    selector: 'app-skills-management',
    templateUrl: './skills-management.component.html',
    styleUrls: ['./skills-management.component.css']
})

export class SkillsManagementComponent { // implements AfterViewInit, OnDestroy {
    displayedColumns: string[] = ['name', 'category', 'actions'];
    dataSource: MatTableDataSource<Skill> = new MatTableDataSource();
    filter: string = '';
    state: MatTableState;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private skillService: SkillService, 
        private stateService: StateService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar) {
            this.state = this.stateService.skillOrEnterpriseListState;
    }

    ngAfterViewInit(): void {
        // lie le datasource au sorter et au paginator
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // définit le predicat qui doit être utilisé pour filtrer les membres
        this.dataSource.filterPredicate = (data: Skill, filter: string) => {
            const str = data.name + ' ' + data.category?.name;
            return str.toLowerCase().includes(filter);
        };
        // établit les liens entre le data source et l'état de telle sorte que chaque fois que 
        // le tri ou la pagination est modifié l'état soit automatiquement mis à jour
        this.state.bind(this.dataSource);
        // récupère les données 
        this.refresh();
    }

    refresh() {
        this.skillService.getAll().subscribe(skills => {
            // assigne les données récupérées au datasource
            this.dataSource.data = skills;
            // restaure l'état du datasource (tri et pagination) à partir du state
            this.state.restoreState(this.dataSource);
            // restaure l'état du filtre à partir du state
            this.filter = this.state.filter;
        });
    }

    // appelée chaque fois que le filtre est modifié par l'utilisateur
    filterChanged(e: KeyboardEvent) {
        const filterValue = (e.target as HTMLInputElement).value;
        // applique le filtre au datasource (et provoque l'utilisation du filterPredicate)
        this.dataSource.filter = filterValue.trim().toLowerCase();
        // sauve le nouveau filtre dans le state
        this.state.filter = this.dataSource.filter;
        // comme le filtre est modifié, les données aussi et on réinitialise la pagination
        // en se mettant sur la première page
        if (this.dataSource.paginator)
            this.dataSource.paginator.firstPage();
    }

    // // appelée quand on clique sur le bouton "edit" d'une skill
    edit(skill: Skill) {
        const dlg = this.dialog.open(SkillEditComponent, { data: { skill, isNew: false } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                _.assign(skill, res);
                res = plainToClass(Skill, res);
                if (res.categoryId == null || res.categoryId == '') {
                    res.categoryId = 0;
                }
                this.skillService.update(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 3000 });
                    }else{
                        this.refresh();
                    }
                });
            }
        });
    }
    
    // appelée quand on clique sur le bouton "delete" d'une skill
    delete(skill: Skill) {
        const backup = this.dataSource.data;
        this.dataSource.data = _.filter(this.dataSource.data, s => s.name !== skill.name); // don't understand this line
        const snackBarRef = this.snackBar.open(`Skill '${skill.name}' will be deleted`, 'Undo', { duration: 3000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.skillService.delete(skill).subscribe();
            else 
                this.dataSource.data = backup;
        });
    }

    // // appelée quand on clique sur le bouton "new skill"
    create() {
        const skill = new Skill();
        const dlg = this.dialog.open(SkillEditComponent, { data: { skill, isNew: true } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                res = plainToClass(Skill, res);
                if (res.categoryId == null || res.categoryId == '') {
                    res.categoryId = 0;
                }
                console.log(res);
                this.dataSource.data = [...this.dataSource.data, res];
                this.skillService.add(res).subscribe(res => {
                    console.log(res);
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The skill has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
                    }else{
                        this.refresh();
                    }
                });
            }
        });
    }

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }

}
