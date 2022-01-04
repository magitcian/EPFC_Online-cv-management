import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MissionService } from '../../../services/mission.service';
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
import { Skill } from 'src/app/models/skill';
import { Using } from 'src/app/models/using';
import { EnterpriseService } from '../../../services/enterprise.service';
import { SkillService } from '../../../services/skill.service';
import { Observable, of as observableOf } from 'rxjs';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { ElementRef, ViewChild } from '@angular/core';

import { MatChipInputEvent } from '@angular/material/chips';

import { map, startWith } from 'rxjs/operators';
import { BooleanInput } from '@angular/cdk/coercion';

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
    public ctlUsings !: FormControl;
    // public ctlSkillId !: FormControl;
    // public ctlSkillName !: FormControl;
    public isNew: boolean;
    public enterprises !: Enterprise[];
    public usingsOfMission: Using[] = [];
    public skillsTotal: Skill[] = [];
    public mission !: Mission;

    constructor(public dialogRef: MatDialogRef<MissionEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { mission: Mission; isNew: boolean; },
        private fb: FormBuilder,
        private missionService: MissionService,
        private enterpriseService: EnterpriseService,
        private skillService: SkillService
    ) {
        this.ctlTitle = this.fb.control('', [Validators.required]);
        //this.ctlFinish = this.fb.control(null, null);
        this.ctlStart = this.fb.control('', [Validators.required]); //, this.validateStartDate()]);
        this.ctlFinish = this.fb.control('', [Validators.required, this.validateFinishDate()]);
        this.ctlDescription = this.fb.control('', []);
        this.ctlEnterpriseId = this.fb.control('', []);
        this.ctlEnterpriseName = this.fb.control('', []);
        this.ctlClientId = this.fb.control('', []);
        this.ctlClientName = this.fb.control('', []);
        this.ctlUsings = this.fb.control(false, []);

        this.frm = this.fb.group({
            id: this.ctlId,
            start: this.ctlStart,
            finish: this.ctlFinish,
            title: this.ctlTitle,
            description: this.ctlDescription,
            enterpriseId: this.ctlEnterpriseId,
            clientId: this.ctlClientId
            , enterprise: this.fb.group({
                id: this.ctlEnterpriseId,
                name: this.ctlEnterpriseName
            })
            , client: this.fb.group({
                id: this.ctlClientId,
                name: this.ctlClientName
            })
            , usings: this.ctlUsings

        });
        this.mission = data.mission;
        //this.usingsOfMission = data.mission.usings!;
        data.mission.usings?.forEach(u =>
            this.usingsOfMission.push(u)
        );
        this.isNew = data.isNew;

        this.addEnterprises();
        this.refreshSkills();
        this.frm.patchValue(data.mission);
    }

    addEnterprises() {
        this.enterpriseService.getAll().subscribe(ent => {
            this.enterprises = ent;
        });
    }

    refreshSkills() {
        this.skillService.getAll().subscribe(skills => {
            this.skillsTotal = skills;
            //this.usingsOfMission = this.mission.usings!;
            this.usingsOfMission = [];
            this.mission.usings?.forEach(u =>
                this.usingsOfMission.push(u)
            );
            for (let s = 0; s < this.skillsTotal.length; s++) {
                for (let u = 0; u < this.usingsOfMission.length; u++) {
                    if (this.skillsTotal[s].id == this.usingsOfMission[u].skill?.id) {
                        this.skillsTotal.splice(s, 1) //supprime 1 élément à l'index s
                    }
                }
            }
        });
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    update() {
        this.updateDataWithEnterprisesName();
        const data = this.frm.value;
        data.usings = this.usingsOfMission;
        //console.log(data);
        this.dialogRef.close(data);
    }

    updateDataWithEnterprisesName() {
        let find: boolean = false;
        this.enterprises?.forEach(e => {
            if (e.id == this.ctlEnterpriseId.value) {
                this.ctlEnterpriseName.patchValue(e.name);
            }
            if (e.id == this.ctlClientId.value) {
                this.ctlClientName.patchValue(e.name);
                find = true;
            }
        });
        if (!find) {
            this.ctlClientName.patchValue(null);
        }
    }

    validateFinishDate(): any {
        return (ctl: FormControl) => {
            const finishDate: Moment = ctl.value;
            const startDate: Moment = this.ctlStart.value;
            if (finishDate < startDate)
                return { startBiggerThanFinishDate: true }
            return null;
        };
    }


    // validateStartDate(): any {
    //     return (ctl: FormControl) => {
    //         const startDate : Moment = ctl.value;
    //         const finishDate: Moment = this.ctlFinish.value;
    //         if (finishDate < startDate)
    //             return { finishLowerThanStartDate: true }
    //         return null;
    //     };
    // }

    cancel() {
        this.refreshSkills();
        this.dialogRef.close();
    }

    removeSkill(using: Using): void {
        const index = this.usingsOfMission.indexOf(using);
        if (index >= 0) {
            let u = this.usingsOfMission.splice(index, 1);
            this.skillsTotal.splice(index, 0, u[0].skill!);

            this.frm.markAsDirty();
        }
    }

    addSkill(skill: Skill): void {
        const index = this.skillsTotal.indexOf(skill);
        if (index >= 0) {
            let s = this.skillsTotal.splice(index, 1);
            let u = new Using();
            u.addSkill(s[0], this.mission);
            this.usingsOfMission.splice(index, 0, u);

            this.frm.markAsDirty(); 
        }
    }


}


