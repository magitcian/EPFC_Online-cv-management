import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MissionService } from '../../services/mission.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { User, Title } from 'src/app/models/user';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Mission } from 'src/app/models/mission';

@Component({
    selector: 'app-mission-edit',
    templateUrl: './mission-edit.component.html',
    styleUrls: ['./mission-edit.component.css']
})
export class MissionEditComponent {

    public frm!: FormGroup;
    private ctlId!: FormControl;
    public ctlStart!: FormControl;
    public ctlFinish!: FormControl;
    public ctlTitle!: FormControl;
    public ctlDescription!: FormControl;
    public ctlEnterpriseName!: FormControl;
    public frmEnterprise!: FormGroup; 
    public isNew: boolean;

    constructor(public dialogRef: MatDialogRef<MissionEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mission: Mission; isNew: boolean; },
        private fb: FormBuilder,
        private missionService: MissionService
    ) {
        this.ctlTitle = this.fb.control(null, null); 
        this.ctlStart = this.fb.control('', []); 
        this.ctlFinish = this.fb.control('', []); 
        this.ctlDescription = this.fb.control('', []); 
        this.ctlEnterpriseName = this.fb.control('', []); 

        this.frm = this.fb.group({
            id: this.ctlId,
            start: this.ctlStart,
            finish: this.ctlFinish,
            title: this.ctlTitle,
            description: this.ctlDescription
        });
        // this.frmEnterprise = this.fb.group({ 
        //     enterpriseName: this.ctlEnterpriseName, 
        // });

        this.isNew = data.isNew;
        this.frm.patchValue(data.mission);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    update() {
        // this.dialogRef.close(this.frm.value);
        const data = this.frm.value;
        this.dialogRef.close(data); 
    }

    cancel() {
        this.dialogRef.close();
    }

}
