import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TrainingService } from '../../services/training.service';
import { EnterpriseService } from '../../services/enterprise.service';
import { Training } from 'src/app/models/training';
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
    selector: 'app-training-data-edit', 
    templateUrl: './training-data-edit.component.html',
    styleUrls: ['./training-data-edit.component.css']
})

export class TrainingDataEditComponent {
    // @Input() set getTrainingID(val: number) {
    //     this.experienceId = val;
    //     this.refresh();
    // }

    @Input() set getTraining(val: Training) {
        this.training = val;
        this.controlInput();
    }

    training!: Training;

    experienceId!: number;
    @Input() isEditable!: boolean;
    isEditMode: boolean = false;
    // training: Training = new Training();

    @Input() isNew!: boolean;

    public trainingToAdd : Training = new Training();

    enterprises!: Enterprise[];
    skills!: Skill[];
    usings!: Using[];

    @Output() updateTrainingInDaddy: EventEmitter<Training> = new EventEmitter<Training>(); 
    @Output() addTrainingInDaddy: EventEmitter<Training> = new EventEmitter<Training>(); 
    
    
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

    constructor(
        private fb: FormBuilder,
        private trainingService: TrainingService,
        private enterpriseService: EnterpriseService,
        public dialog: MatDialog, 
        public snackBar: MatSnackBar) {
       
    }

    // refresh() {
    //     this.trainingService.getById(this.experienceId).subscribe(training => {
    //         if (training != null) {
    //             this.training = training;
    //         }
    //         this.controlInput();
    //     });
    // }

    controlInput() {
        this.ctlStart = this.fb.control('', []);
        this.ctlFinish = this.fb.control('', []);
        this.ctlTitle = this.fb.control('', []);
        this.ctlDescription = this.fb.control('', []); 
        this.ctlGrade = this.fb.control('', []);
        this.ctlEnterprise = this.fb.control('', []);
        this.ctlEnterpriseId = this.fb.control('', []);
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
            // ,usings: this.fb.group({
            //     id: this.ctlUsingId,
            //     skill: this.ctlSkill,
            //     experienceId: this.ctlExperienceId,
            //     skillId: this.ctlSkillId
            // })
            ,usings: this.ctlUsings
        })
        this.addEnterprisesInDropDown();
        this.frm.patchValue(this.training);
    }

    addEnterprisesInDropDown() { 
        this.enterpriseService.getAll().subscribe(enterprises => {
            this.enterprises = enterprises;
            // console.log(this.enterprises);
        });
    }

    update() { // does not update "usings"
        var res = this.frm.value; // récupère le formulaire avec les infos modifiées
        this.updateTrainingInDaddy.emit(res); // res est un EventEmitter et celui-ci va être transformé en Training
    }

    add() { 
        var res = this.frm.value; // récupère le formulaire avec les infos modifiées
        res.id = 0;
        _.assign(this.trainingToAdd, res);    // dit que le res est formaté comme un training (il faut le repréciser)
        res = plainToClass(Training, res); 
        this.addTrainingInDaddy.emit(res); // res est un EventEmitter et celui-ci va être transformé en Training
    }

    changeEditMode() {
        // TODO fix issue with isEditable 
        // if (this.isEditable) {
            this.isEditMode = !this.isEditMode;
        // }
    }

}