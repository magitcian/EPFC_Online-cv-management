import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services/user.service';
import { MissionService } from '../../services/mission.service';
import { Mission } from 'src/app/models/mission';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-missions-view',
    templateUrl: './missions-view.component.html',
    styleUrls: ['./missions-view.component.css']
})

export class MissionsViewComponent {
    @Input() set getUserID(val: number) {
        this.userCvId = val;
        this.refresh();
    }
    @Input() isEditable!: boolean;
    public missionToAdd : Mission = new Mission();
    userCvId !: number;
    missions!: Mission[];
    isEditMode: boolean = false;
    isAddMode: boolean = false;
    constructor(
        public snackBar: MatSnackBar,
        private missionService: MissionService,
        private userService: UserService,
        public dialog: MatDialog,
    ) {    }

    refresh() {
        this.userService.getMissions(this.userCvId).subscribe(missions => {
            this.missions = missions;
            this.missionToAdd = new Mission();
            console.log(this.missions);
        });
    }

    delete(mission: Mission) {
        var index = this.missions.indexOf(mission);
        this.missions.splice(index, 1);
        const snackBarRef = this.snackBar.open(`This mission '${mission?.title}' will be removed`, 'Undo', { duration: 3000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction) {
                this.missionService.delete(mission).subscribe();
            } 
        });
        snackBarRef.onAction().subscribe(() => this.missions.splice(index, 0, mission));
    }

    update(mission: Mission) {
        this.missionService.update(mission).subscribe(res => { 
            if (!res) {
                this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 3000 });
            } else {
                this.refresh();
            }            
        }); 
    }

    add(mission: Mission) {
        this.missionService.add(mission).subscribe(res => {  
            if (!res) {
                this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 3000 });
            } else {
                this.refresh();
                this.changeAddMode();
            }            
        }); 
    }

    changeAddMode() {
        if (this.isEditable) {
            this.isAddMode = !this.isAddMode;
        }
    }

}