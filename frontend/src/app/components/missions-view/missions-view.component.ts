import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, Input, Output, OnChanges } from '@angular/core';
//import * as _ from 'lodash-es';
import { Mission } from 'src/app/models/mission';
import { __exportStar } from 'tslib';
import { MissionService } from '../../services/mission.service';
import { MatSnackBar } from '@angular/material/snack-bar';
//import { EditMissionComponent } from '../edit-mission/edit-mission.component';
import * as _ from 'lodash-es';
import { User, Title } from 'src/app/models/user';
import { Moment } from 'moment';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';
import { StateService } from 'src/app/services/state.service';
import { MatTableState } from 'src/app/helpers/mattable.state';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { newArray } from '@angular/compiler/src/util';


@Component({
    selector: 'app-missions-view', 
    templateUrl: './missions-view.component.html',
    styleUrls: ['./missions-view.component.css']
})

export class MissionsViewComponent {
    @Input() missions!: Mission[];
    @Input() isEditable!: boolean;
    isEditMode :boolean = false;

    constructor(
        public snackBar: MatSnackBar,
        private missionService: MissionService,
        public dialog: MatDialog,
    ) {

    }

    // edit(mission: Mission) {
    //     const dlg = this.dialog.open(EditMissionComponent, { data: { mission, isNew: false } });
    //     dlg.beforeClosed().subscribe(res => {
    //         if (res) {
    //             _.assign(mission, res);
    //             res = plainToClass(User, res);
    //             // this.missionService.update(res).subscribe(res => {
    //             //     if (!res) {
    //             //         this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
    //             //         this.refresh();
    //             //     }
    //             // });
    //         }
    //     });
    // }

    delete(mission: Mission) {
        var index = this.missions.indexOf(mission);
        this.missions.splice(index,1);
        const snackBarRef = this.snackBar.open(`Mission '${mission.title}' will be deleted`, 'Undo', { duration: 5000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction){
                this.missionService.delete(mission).subscribe(); 
            }
            else{
                let backup!: Mission[];
                this.missions.splice(index,0,mission);
                this.missions.forEach(m => 
                    backup.push(m)
                    );
                this.missions =  backup; //Force une nouvelle référence et met à jour le composant à l'écran
            }
        });
    }

    changeEditMode(){
        if(this.isEditable){
            this.isEditMode = !this.isEditMode;
        }
    }


}
