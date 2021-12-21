import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { User, Title } from 'src/app/models/user';
import { Moment } from 'moment';
import * as moment from 'moment';
import { Mastering, Level } from 'src/app/models/mastering';
import { Skill } from 'src/app/models/skill';
import { Category } from 'src/app/models/category';
import { UserService } from '../../services/user.service';
// import { MasteringService } from '../../services/mastering.service';
import { SkillService } from 'src/app/services/skill.service';

@Component({
    selector: 'app-mastering-edit',
    templateUrl: './mastering-edit.component.html',
    styleUrls: ['./mastering-edit.component.css']
})

export class MasteringEditComponent  {

    @Input() userCvId!: number;
    @Input() set getMastering(val: Mastering | undefined) {
        console.log(val);
        if (val == undefined) {
            this.mastering = new Mastering();
        }
        else {
            this.mastering = val;
        }
        this.controlAlim();
    }
    mastering!: Mastering;
    @Input() isNew!: boolean;
    @Output() deleteMasteringInDaddy: EventEmitter<void> = new EventEmitter<void>(); // () car daddy connait déjà le mastering

    delete() {
        this.deleteMasteringInDaddy.emit(); // ask daddy to execute the delete mastering
    }

    public frm!: FormGroup;
    private ctlId!: FormControl;
    public ctlSkillId!: FormControl;
    public ctlSkillName!: FormControl;
    public ctlCategoryId!: FormControl;
    public ctlCategoryName!: FormControl;
    public ctlLevel!: FormControl;
    // // public isNew: boolean;

    // public mastering!: Mastering;

    public skill!: Skill; 
    public category!: Category; 

    constructor(
        private fb: FormBuilder)  { }
        // {
        // this.ctlId = this.fb.control('', []);
        // this.ctlSkillId = this.fb.control('', []);
        // this.ctlSkillName = this.fb.control('', [Validators.required]);     // this.fb.control('', []); // form element potentially "controlled"
        // this.ctlCategoryName = this.fb.control('', []);
        // this.ctlCategoryId = this.fb.control('', []);
        // this.ctlLevel = this.fb.control('', [Validators.required]);

        // this.frm = this.fb.group({ // building the form using FormBuilder
        //     id: this.ctlId,
        //     skillId: this.ctlSkillId,
        //     skillName: this.ctlSkillName,
        //     categoryId: this.ctlCategoryId,
        //     categoryName: this.ctlCategoryName,
        //     level: this.ctlLevel
        //     // masteringItems: this.fb.array([])
        // });

        // this.frm.patchValue(this.mastering);

        // console.log(this.mastering);
        // console.log(this.masteringId);

        // }

    controlAlim() {
        this.ctlId = this.fb.control('', []);
        this.ctlSkillId = this.fb.control('', []);
        this.ctlSkillName = this.fb.control('', []);     // this.fb.control('', []); // form element potentially "controlled"
        this.ctlCategoryName = this.fb.control('', []);
        this.ctlCategoryId = this.fb.control('', []);
        this.ctlLevel = this.fb.control('', [Validators.required]);

        // this.ctlSkillName.disable();

        this.frm = this.fb.group({ // building the form using FormBuilder
            id: this.ctlId,
            skillId: this.ctlSkillId,
            skill: this.fb.group({
                id: this.ctlSkillId,
                name: this.ctlSkillName,
                categoryId: this.ctlCategoryId,
                category: this.fb.group({
                    id: this.ctlCategoryId,
                    name: this.ctlCategoryName
                })
            }),
            // skillName: this.ctlSkillName,
            // categoryId: this.ctlCategoryId,
            // categoryName: this.ctlCategoryName,
            level: this.ctlLevel
        })
        
        this.frm.patchValue(this.mastering);
        console.log(this.mastering);
        // console.log(this.masteringId);
    }

    skillChange() {
        this.ctlCategoryName.patchValue("test"); // TODO: avec id du skill, aller chercher la catégorie correspondante
    }

    // ! chercher skill avec catégorie associée => SkillWithCategoryDTO in backend 

    methodToAddSkills() {
        // to test in constructor to check but also in controlAlim
    }

    // get masteringItems() {
    //     return this.frm.controls["masteringItems"] as FormArray;
    // }

    // addMastering() {
    //     const masteringForm = this.fb.group({
    //         skillName: ['', Validators.required],
    //         categoryName: ['', ''],
    //         level: ['', Validators.required]
    //     });
    //     this.masteringItems.push(masteringForm);
    // }

    // deleteMastering(masteringIndex: number) {
    //     this.masteringItems.removeAt(masteringIndex);
    // }

    // listCategories() {
    //     this.categoryService.getAll.subscribe(categories => {
    //         this.categories = categories;
    //     });
    // }



}