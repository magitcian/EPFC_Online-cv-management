import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainingService } from '../../services/training.service';
import { EnterpriseService } from '../../services/enterprise.service';
import { SkillService } from '../../services/skill.service';
import { Training } from 'src/app/models/training';
import { Enterprise } from 'src/app/models/enterprise';
import { Skill } from 'src/app/models/skill';
import { Using } from 'src/app/models/using';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as _ from 'lodash-es';
import { plainToClass } from 'class-transformer';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Moment } from 'moment';

@Component({
    selector: 'app-training-data-edit', 
    templateUrl: './training-data-edit.component.html',
    styleUrls: ['./training-data-edit.component.css']
})

export class TrainingDataEditComponent {

    @Input() set getTraining(val: Training) {
        this.training = val;
        this.controlInput();
    }
    @Input() isEditable!: boolean;
    @Input() isNew!: boolean;

    training!: Training;
    experienceId!: number;
    isEditMode: boolean = false;

    enterprises!: Enterprise[];
    otherSkills: Skill[] = [];
    trainingUsings: Using[] = [];
    separatorKeysCodes: number[] = [ENTER, COMMA];
    filteredSkills: Observable<string[]> = new Observable();

    @ViewChild('skillInput', { static: false }) skillInput: ElementRef<HTMLInputElement> = {} as ElementRef;

    @Output() updateTrainingInDaddy: EventEmitter<Training> = new EventEmitter<Training>(); 
    @Output() addTrainingInDaddy: EventEmitter<Training> = new EventEmitter<Training>(); 
    @Output() changeAddModeInDaddy: EventEmitter<void> = new EventEmitter<void>(); 
    @Output() changeUpdateModeInDaddy: EventEmitter<void> = new EventEmitter<void>(); 
    
    public frm!: FormGroup;
    private ctlId!: FormControl;
    public ctlStart!: FormControl;
    public ctlFinish!: FormControl;
    public ctlTitle!: FormControl;
    public ctlDescription!: FormControl;
    public ctlGrade!: FormControl;
    public ctlEnterprise!: FormControl;
    public ctlEnterpriseId!: FormControl;
    public ctlEnterpriseName!: FormControl;
    public ctlUsings!: FormControl;
    public skillCtrl = new FormControl();

    constructor(
        private fb: FormBuilder,
        private trainingService: TrainingService,
        private enterpriseService: EnterpriseService,
        private skillService: SkillService,
        public dialog: MatDialog, 
        public snackBar: MatSnackBar) {
       
    }

    controlInput() {
        this.ctlStart = this.fb.control('', [Validators.required]);
        this.ctlFinish = this.fb.control('', [Validators.required, this.validateFinishDate()]);
        this.ctlTitle = this.fb.control('', [Validators.required]);
        this.ctlDescription = this.fb.control('', []); 
        this.ctlGrade = this.fb.control('', []);
        this.ctlEnterprise = this.fb.control('', []);
        this.ctlEnterpriseId = this.fb.control('', [Validators.required]);
        this.ctlEnterpriseName = this.fb.control('', []);
        this.ctlUsings = this.fb.control('', []);
        // fb.group content needs to respect the JSON we get from backend !
        this.frm = this.fb.group({ // building the form using FormBuilder
            id: this.ctlId,
            start: this.ctlStart,
            finish: this.ctlFinish,
            title: this.ctlTitle,
            description: this.ctlDescription,
            grade: this.ctlGrade,
            enterpriseId: this.ctlEnterpriseId,
            enterprise: this.fb.group({
                id: this.ctlEnterpriseId,
                name: this.ctlEnterpriseName
            })
            ,usings: this.ctlUsings
        })
        this.addEnterprisesInDropDown();
        this.refreshSkills();
        this.frm.patchValue(this.training);
    }

    addEnterprisesInDropDown() { 
        this.enterpriseService.getAll().subscribe(enterprises => {
            this.enterprises = enterprises;
            // console.log(this.enterprises);
        });
    }

    refreshSkills() { // we take all skills and remove the ones in usings so that we only keep the ones that the user does not have
        this.skillService.getAll().subscribe(skills => {
            this.otherSkills = skills;
            this.trainingUsings = [];
            this.training.usings?.forEach(u =>
                this.trainingUsings.push(u)
            );
            for (let s = 0; s < this.otherSkills.length; s++) {
                for (let u = 0; u < this.trainingUsings.length; u++) {
                    if (this.otherSkills[s]?.id == this.trainingUsings[u].skill?.id) {
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

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.otherSkills.map(s => s.name!).filter(skill => skill.toLowerCase().includes(filterValue));
    }

    addSkill(event: MatChipInputEvent): void {

    }

    removeSkill(using: Using): void {
        const index = this.trainingUsings.indexOf(using);
        if (index >= 0) {
            let u = this.trainingUsings.splice(index, 1);
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
                u.addSkill(s[0], this.training);
                this.trainingUsings.splice(0, 0, u);
                this.frm.markAsDirty();
            }
            this.skillInput.nativeElement.value = '';
            this.skillCtrl.setValue(null);
        }
    }

    edit() {
        this.addEnterprisesInDropDown();
        var res = this.frm.value;
        _.assign(this.training, res);
        res = plainToClass(Training, res);
        res.usings = this.trainingUsings;
        //console.log(res);
        if (this.isNew) {
            res.id = 0;
            this.addTrainingInDaddy.emit(res);
        } else {
            this.updateTrainingInDaddy.emit(res);
        }
    }

    cancel() {
        if (this.isNew) {
            this.changeAddModeInDaddy.emit();
        } else {
            this.changeUpdateModeInDaddy.emit();
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

    // update() { // does not update "usings"
    //     var res = this.frm.value; // récupère le formulaire avec les infos modifiées
    //     this.updateTrainingInDaddy.emit(res); // res est un EventEmitter et celui-ci va être transformé en Training
    // }

    // add() { 
    //     var res = this.frm.value; // récupère le formulaire avec les infos modifiées
    //     res.id = 0;
    //     _.assign(this.training, res);    // dit que le res est formaté comme un training (il faut le repréciser)
    //     res = plainToClass(Training, res); 
    //     this.addTrainingInDaddy.emit(res); // res est un EventEmitter et celui-ci va être transformé en Training
    // }

    // changeEditMode() {
    //     if (this.isNew) {
    //         this.changeAddModeInDaddy.emit();
    //     } else {
    //         this.changeUpdateModeInDaddy.emit();
    //     }
    // }

    // edit() {
    //     if (this.isNew) {
    //         this.add();
    //     } else {
    //         this.update();
    //     }
    // }

}