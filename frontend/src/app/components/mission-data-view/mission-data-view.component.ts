import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MissionService } from '../../services/mission.service';
import { EnterpriseService } from '../../services/enterprise.service';
import { Mission } from 'src/app/models/mission';
import { Enterprise } from 'src/app/models/enterprise';
import { Skill } from 'src/app/models/skill';
import { Using } from 'src/app/models/using';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { plainToClass } from 'class-transformer';
// import {MatChipInputEvent} from '@angular/material/chips';
// import {COMMA, ENTER} from '@angular/cdk/keycodes';
// import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
    selector: 'app-mission-data-view', 
    templateUrl: './mission-data-view.component.html',
    styleUrls: ['./mission-data-view.component.css']
})

export class MissionDataViewComponent {

    @Input() set getMission(val: Mission) {
        this.mission = val;
    }
    @Input() isEditable!: boolean;
    @Input() isNew!: boolean;

    mission!: Mission;
    experienceId!: number;
    isUpdateMode: boolean = false;
    enterprises!: Enterprise[];
    skills!: Skill[];
    usings!: Using[];

    @Output() deleteMissionInDaddy: EventEmitter<void> = new EventEmitter<void>(); 
    @Output() updateMissionInDaddy: EventEmitter<Mission> = new EventEmitter<Mission>(); 

    constructor(
        public dialog: MatDialog, 
        public snackBar: MatSnackBar) {
    }

    update(mission: Mission) { 
        this.updateMissionInDaddy.emit(mission); 
    }

    delete() {
        this.deleteMissionInDaddy.emit();
    }

    changeUpdateMode() {
        if (this.isEditable) {
            this.isUpdateMode = !this.isUpdateMode;
        }
    }

}