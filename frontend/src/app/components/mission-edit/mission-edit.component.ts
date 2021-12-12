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
import { Enterprise } from 'src/app/models/enterprise';
import { EnterpriseService } from '../../services/enterprise.service';

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
    public ctlEnterpriseId!: FormControl;
    public ctlEnterpriseName!: FormControl;
    public ctlClientId!: FormControl;
    public ctlClientName!: FormControl;
    //public frmEnterprise!: FormGroup;
    public isNew: boolean;
    public enterprises !: Enterprise[];

    constructor(public dialogRef: MatDialogRef<MissionEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mission: Mission; isNew: boolean; },
        private fb: FormBuilder,
        private missionService: MissionService,
        private enterpriseService: EnterpriseService
    ) {
        this.ctlTitle = this.fb.control(null, null);
        this.ctlStart = this.fb.control('', []);
        this.ctlFinish = this.fb.control(null, [this.validateFinishDate()]);
        this.ctlDescription = this.fb.control('', []);
        this.ctlEnterpriseId = this.fb.control('', []);
        this.ctlEnterpriseName = this.fb.control('', []);
        this.ctlClientId = this.fb.control('', []);
        this.ctlClientName = this.fb.control('', []);

        this.frm = this.fb.group({
            id: this.ctlId,
            start: this.ctlStart,
            finish: this.ctlFinish,
            title: this.ctlTitle,
            description: this.ctlDescription,
            enterprise: this.fb.group({
                id: this.ctlEnterpriseId,
                name: this.ctlEnterpriseName
            }),
            client: this.fb.group({
                id: this.ctlClientId,
                name: this.ctlClientName
            })
        });
        this.addEnterprises();
        this.isNew = data.isNew;
        this.frm.patchValue(data.mission);
    }

    addEnterprises() {
        this.enterpriseService.getAll().subscribe(ent => {
            this.enterprises = ent;
        });
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    update() {
        this.updateDataWithEnterprisesName();
        const data = this.frm.value;
        this.dialogRef.close(data);
    }

    updateDataWithEnterprisesName() {
        let find : boolean = false;
        this.enterprises?.forEach(e => {
            if (e.id == this.ctlEnterpriseId.value) {
                this.ctlEnterpriseName.patchValue(e.name);
            }
            if (e.id == this.ctlClientId.value) {
                this.ctlClientName.patchValue(e.name);
                find = true;
            }
        });
        if(!find){
            this.ctlClientName.patchValue(null);
        }
    }

    validateFinishDate(): any {
        return (ctl: FormControl) => {
            const finishDate: Moment = ctl.value;
            const startDate: Moment = this.ctlStart.value;
            if (finishDate < startDate)
                return { finishBiggerThanStartDate: true }
            return null;
        };
    }

    cancel() {
        this.dialogRef.close();
    }

}
