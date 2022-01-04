import { Component, Input, Output, OnChanges } from '@angular/core';
import { Mission } from 'src/app/models/mission';
import { __exportStar } from 'tslib';
import { MissionService } from '../../../services/mission.service';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash-es';
import { plainToClass } from 'class-transformer';
import { MatDialog } from '@angular/material/dialog';
import { MissionEditComponent } from '../mission-edit/mission-edit.component';


@Component({
    selector: 'app-missions-view',
    templateUrl: './missions-view.component.html',
    styleUrls: ['./missions-view.component.css']
})

export class MissionsViewComponentOld {
    @Input() set getUserID(val: number) {
        this.userCvId = val;
        this.refresh();
    }
    @Input() isEditable!: boolean;

    userCvId !: number;
    missions!: Mission[];
    isEditMode: boolean = false;

    constructor(
        public snackBar: MatSnackBar,
        private missionService: MissionService,
        private userService: UserService,
        public dialog: MatDialog,
    ) {


    }

    refresh() {
        this.userService.getMissions(this.userCvId).subscribe(missions => {
            this.missions = missions;
            //console.log(this.missions);
        });
    }

    edit(mission: Mission) {
        const dlg = this.dialog.open(MissionEditComponent, { data: { mission, isNew: false } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                _.assign(mission, res);
                res = plainToClass(Mission, res);
                this.missionService.update(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                        this.refresh();
                        this.changeEditMode();
                    }else{
                        this.refresh();
                        this.changeEditMode();
                    }
                });
            }
        });
    }

    create() {
        const mission = new Mission();
        const dlg = this.dialog.open(MissionEditComponent, { data: { mission, isNew: true } });
        dlg.beforeClosed().subscribe(res => {
            if (res) {
                res = plainToClass(Mission, res);
                res.id = 0;
                if(res.clientId == null || res.clientId == ''){
                    res.clientId = 0;
                }
                //this.missions = [...this.missions, res];
                this.missionService.add(res).subscribe(res => {
                    if (!res) {
                        this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
                    }else{
                        this.refresh();
                        this.changeEditMode();
                    }
                });
            }
        });
    }

    delete(mission: Mission) {
        var index = this.missions.indexOf(mission);
        this.missions.splice(index, 1);
        const snackBarRef = this.snackBar.open(`Mission '${mission.title}' will be deleted`, 'Undo', { duration: 5000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction) {
                this.missionService.delete(mission).subscribe();
            }else{
                this.refresh();
                this.changeEditMode();
            }
        });
    }

    changeEditMode() {
        if (this.isEditable) {
            this.isEditMode = !this.isEditMode;
        }
    }


}
