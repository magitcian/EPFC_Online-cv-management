import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, Output,EventEmitter, Input } from '@angular/core';
import * as _ from 'lodash-es';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { plainToClass } from 'class-transformer';
import { Consultant } from 'src/app/models/consultant';
import { ConfirmDeleteUserComponent } from 'src/app/components/confirm-delete-user/confirm-delete-user.component';

@Component({
    selector: 'app-consultants-list', // sélecteur utilisé pour un sous-composant
    templateUrl: './consultants-list.component.html',
    styleUrls: ['./consultants-list.component.css']
})

export class ConsultantsListComponent implements AfterViewInit, OnDestroy {
    displayedColumns: string[] = ['lastName', 'firstName', 'email', 'birthDate', 'title', 'actions'];
    dataSource: MatTableDataSource<User> = new MatTableDataSource();
    filter: string = '';
    state: MatTableState;
    @Output() addTabCVUser: EventEmitter<User> = new EventEmitter<User>();
    @Output() removeTabCVUser: EventEmitter<User> = new EventEmitter<User>();
    @Input() areMyConsultants!: boolean;
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

    ngAfterViewInit(): void {
        // lie le datasource au sorter et au paginator
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // définit le predicat qui doit être utilisé pour filtrer les membres
        this.dataSource.filterPredicate = (data: Consultant, filter: string) => {
            const str = data.lastName + ' ' + data.firstName + ' ' + data.email + ' ' + data.birthDate?.format('DD/MM/YYYY') + ' ' + data.titleAsString;
            return str.toLowerCase().includes(filter);
        };
        // établit les liens entre le data source et l'état de telle sorte que chaque fois que 
        // le tri ou la pagination est modifié l'état soit automatiquement mis à jour
        this.state.bind(this.dataSource);
        // récupère les données 
        this.refresh();
    }

    refresh() {
        if(this.areMyConsultants){
            this.userService.getMyConsultants().subscribe(consultants => {
                // assigne les données récupérées au datasource
                this.dataSource.data = consultants;
                // restaure l'état du datasource (tri et pagination) à partir du state
                this.state.restoreState(this.dataSource);
                // restaure l'état du filtre à partir du state
                this.filter = this.state.filter;
                //console.log(consultants);
            });
        }else{
            this.userService.getConsultantsWithoutManager().subscribe(consultants => {
                // assigne les données récupérées au datasource
                this.dataSource.data = consultants;
                // restaure l'état du datasource (tri et pagination) à partir du state
                this.state.restoreState(this.dataSource);
                // restaure l'état du filtre à partir du state
                this.filter = this.state.filter;
                //console.log(consultants);
            });
        }
    }


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



    delete(user: User) {

        const dlg = this.dialog.open(ConfirmDeleteUserComponent);
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                this.userService.delete(user).subscribe(res => {
                    this.removeTabCVUser.emit(user);
                    this.refresh()
                });
            }
        });


    }


    ngOnDestroy(): void {
        this.snackBar.dismiss();
    }

    cv_display(user: User) {
        this.addTabCVUser.emit(user);
    }

    remove_link(user: User){
        this.userService.removeLinkWithConsultant(user.id).subscribe(res => {
            this.removeTabCVUser.emit(user);
            this.refresh()
        });
    }

    add_link(user: User){
        this.userService.addLinkWithConsultant(user.id).subscribe(res => {
            this.removeTabCVUser.emit(user);
            this.refresh()
        });
    }

}
