import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Console } from 'console';
import { Enterprise } from '../../models/enterprise';
import { EnterpriseService } from '../../services/enterprise.service';
import * as _ from 'lodash-es';
import { EnterpriseEditComponent } from '../enterprise-edit/enterprise-edit.component';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { plainToClass } from 'class-transformer';

@Component({
    selector: 'app-enterprises-management',
    templateUrl: './enterprises-management.component.html',
    styleUrls: ['./enterprises-management.component.css']
})

export class EnterprisesManagementComponent { // implements AfterViewInit, OnDestroy {
    displayedColumns: string[] = ['name', 'actions'];
    dataSource: MatTableDataSource<Enterprise> = new MatTableDataSource();
    filter: string = '';
    state: MatTableState;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private enterpriseService: EnterpriseService, 
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
        this.dataSource.filterPredicate = (data: Enterprise, filter: string) => {
            const str = data.name + '';
            return str.toLowerCase().includes(filter);
        };
        // établit les liens entre le data source et l'état de telle sorte que chaque fois que 
        // le tri ou la pagination est modifié l'état soit automatiquement mis à jour
        this.state.bind(this.dataSource);
        // récupère les données 
        this.refresh();
    }

    refresh() {
        this.enterpriseService.getAll().subscribe(enterprises => {
            // assigne les données récupérées au datasource
            this.dataSource.data = enterprises;
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

    edit(enterprise: Enterprise) {
        const dlg = this.dialog.open(EnterpriseEditComponent, { data: { enterprise, isNew: false } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                _.assign(enterprise, res);
                res = plainToClass(Enterprise, res);
                this.enterpriseService.update(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 3000 });
                        this.refresh();
                    }
                });
            }
        });
    }
    
    delete(enterprise: Enterprise) {
        const backup = this.dataSource.data;
        this.dataSource.data = _.filter(this.dataSource.data, e => e.name !== enterprise.name); // don't understand this line
        const snackBarRef = this.snackBar.open(`Enterprise '${enterprise.name}' will be deleted`, 'Undo', { duration: 3000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction)
                this.enterpriseService.delete(enterprise).subscribe();
            else 
                this.dataSource.data = backup;
        });
    }

    create() {
        const enterprise = new Enterprise();
        const dlg = this.dialog.open(EnterpriseEditComponent, { data: { enterprise, isNew: true } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                res = plainToClass(Enterprise, res);
                this.dataSource.data = [...this.dataSource.data, res];
                this.enterpriseService.add(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The enterprise has not been created! Please try again.`, 'Dismiss', { duration: 10000 });
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
