import { Component, OnInit, ViewChild, AfterViewInit, ElementRef, OnDestroy, Input, Output, OnChanges } from '@angular/core';
import * as _ from 'lodash-es';
import { Mission } from 'src/app/models/mission';
import { __exportStar } from 'tslib';
import { MissionService } from '../../services/mission.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-missions-view', 
    templateUrl: './missions-view.component.html',
    styleUrls: ['./missions-view.component.css']
})

export class MissionsViewComponent {
    @Input() missions!: Mission[];
   
    constructor(
        public snackBar: MatSnackBar,
        private missionService: MissionService,
    ) {

    }
    edit(mission: Mission) {

    }

    delete(mission: Mission) {
        var index = this.missions.indexOf(mission);
        this.missions.splice(index,1);
        const snackBarRef = this.snackBar.open(`Mission '${mission.title}' will be deleted`, 'Undo', { duration: 10000 });
        snackBarRef.afterDismissed().subscribe(res => {
            if (!res.dismissedByAction){
                this.missionService.delete(mission); //TODO ne fonctionne pas!
            }
            else{
                this.missions.splice(index,0,mission); //ne refresh pas automatiquement (faut cliquer sur edit)
            }
        });
    }

}

//TODO : Arriver à ajouter un onglet cv quand manager consulte le cv d'un consultant (donc autre qu'utilisateur courant). Comment ajouter dynamiquement un onglet (tab)?
//TODO : Commencer CRUDL Mission