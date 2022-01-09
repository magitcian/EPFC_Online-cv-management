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
import { SkillService } from '../../services/skill.service';
import { Moment } from 'moment';

import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
    selector: 'app-mission-data-edit',
    templateUrl: './mission-data-edit.component.html',
    styleUrls: ['./mission-data-edit.component.css']
})

export class MissionDataEditComponent {

    @Input() set getMission(val: Mission) {
        this.mission = val;
        this.controlInput();
    }
    @Input() isEditable!: boolean;
    @Input() isNew!: boolean;

    mission!: Mission;
    experienceId!: number;
    isEditMode: boolean = false;
    enterprises!: Enterprise[];
    missionUsings: Using[] = [];
    otherSkills: Skill[] = [];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    filteredSkills: Observable<string[]> = new Observable();

    // @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
    @ViewChild('skillInput', { static: false }) skillInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @Output() updateMissionInDaddy: EventEmitter<Mission> = new EventEmitter<Mission>();
    @Output() addMissionInDaddy: EventEmitter<Mission> = new EventEmitter<Mission>();
    @Output() changeAddModeInDaddy: EventEmitter<void> = new EventEmitter<void>();
    @Output() changeUpdateModeInDaddy: EventEmitter<void> = new EventEmitter<void>();

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
    public skillCtrl = new FormControl();

    constructor(
        private fb: FormBuilder,
        private missionService: MissionService,
        private enterpriseService: EnterpriseService,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private skillService: SkillService) {


    }

    controlInput() {
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

        this.addEnterprises();
        this.refreshSkills();
        this.frm.patchValue(this.mission);
    }

    addEnterprises() {
        this.enterpriseService.getAll().subscribe(ent => {
            this.enterprises = ent;
        });
    }

    refreshSkills() {
        this.skillService.getAll().subscribe(skills => {
            this.otherSkills = skills;
            //this.missionSkills = this.mission.usings!;
            this.missionUsings = [];
            this.mission.usings?.forEach(u =>
                this.missionUsings.push(u)
            );
            for (let u = 0; u < this.missionUsings.length; u++) {
                for (let s = this.otherSkills.length-1; s >= 0 ; s--) {
                    if (this.otherSkills[s].id == this.missionUsings[u].skill?.id) {
                        this.otherSkills.splice(s, 1) //supprime 1 élément à l'index s
                    }
                }
            }
            this.updateFilter();
        });
    }

    updateFilter() {
        this.filteredSkills = this.skillCtrl.valueChanges.pipe(
            startWith(null),
            map((skill: string | null) => (skill ? this._filter(skill) : this.otherSkills.map(s => s.name!))),
        );
    }

    cancel() {
        if (this.isNew) {
            this.changeAddModeInDaddy.emit();
        } else {
            this.changeUpdateModeInDaddy.emit();
        }
    }

    edit() {
        this.updateDataWithEnterprisesName();
        var res = this.frm.value;
        if (res.clientId == null || res.clientId == '') {
            res.clientId = 0;
        }
        _.assign(this.mission, res);
        res = plainToClass(Mission, res);
        res.usings = this.missionUsings;
        //console.log(res);
        if (this.isNew) {
            res.id = 0;
            this.addMissionInDaddy.emit(res);
        } else {
            this.updateMissionInDaddy.emit(res);
        }
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
                return { finishDateEarlierThanStartDate: true }
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

    addSkill(event: MatChipInputEvent): void {

    }


    removeSkill(using: Using): void {
        const index = this.missionUsings.indexOf(using);
        if (index >= 0) {
            let u = this.missionUsings.splice(index, 1);
            this.otherSkills.splice(0, 0, u[0].skill!);
            this.updateFilter();
            this.frm.markAsDirty();
        }
    }

    selectedSkill(event: MatAutocompleteSelectedEvent): void {
        var skill = this.otherSkills.find(s => s.name == event.option.viewValue);
        if (skill) {
            const index = this.otherSkills.indexOf(skill);
            if (index >= 0) {
                let s = this.otherSkills.splice(index, 1);
                let u = new Using();
                u.addSkill(s[0], this.mission);
                this.missionUsings.splice(0, 0, u);
                this.frm.markAsDirty();
            }
            this.skillInput.nativeElement.value = '';
            this.skillCtrl.setValue(null);
        }
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.otherSkills.map(s => s.name!).filter(skill => skill.toLowerCase().includes(filterValue));
    }

}
