import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, Input, Output } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService } from '../../services/user.service';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { plainToClass } from 'class-transformer';
import { Experience } from 'src/app/models/experience';
import { User } from 'src/app/models/user';

@Component({
    selector: 'app-experiences-view', 
    templateUrl: './experiences-view.component.html',
    styleUrls: ['./experiences-view.component.css']
})

export class ExperiencesViewComponent implements AfterViewInit, OnDestroy {
    @Input() experiences!: Experience[];
    displayedColumns: string[] = ['title', 'description', 'enterprise'];
    dataSource: MatTableDataSource<Experience> = new MatTableDataSource();
    filter: string = '';
    state: MatTableState;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    constructor(
        private userService: UserService,
        private stateService: StateService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar
    ) {
        this.state = this.stateService.userListState;

    }

    
    test() {
       console.log("test");
       this.refresh();
    }

    ngAfterViewInit(): void {
        // lie le datasource au sorter et au paginator
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // définit le predicat qui doit être utilisé pour filtrer les membres
        this.dataSource.filterPredicate = (data: Experience, filter: string) => {
            const str = data?.title + ' ' + data?.description + ' ' + data?.enterprise;
            return str.toLowerCase().includes(filter);
        };
        // établit les liens entre le data source et l'état de telle sorte que chaque fois que 
        // le tri ou la pagination est modifié l'état soit automatiquement mis à jour
        this.state.bind(this.dataSource);
        // récupère les données 
        this.refresh();
    }

    refresh() {
        this.dataSource.data = this.experiences;
        this.state.restoreState(this.dataSource);
        this.filter = this.state.filter;
        // this.userService.getCV(4).subscribe(user => {
        //     // assigne les données récupérées au datasource
        //     this.dataSource.data = user?.experiences;
        //     // restaure l'état du datasource (tri et pagination) à partir du state
        //     this.state.restoreState(this.dataSource);
        //     // restaure l'état du filtre à partir du state
        //     this.filter = this.state.filter;
        // });
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

    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }

}
