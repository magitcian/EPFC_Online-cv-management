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
    selector: 'app-mastering-edit-row',
    templateUrl: './mastering-edit-row.component.html',
    styleUrls: ['./mastering-edit-row.component.css']
})

export class MasteringEditRowComponent {

    // @Input() userCvId!: number;
    @Input() set getMastering(val: Mastering | undefined) {
        // console.log(val);
        if (val == undefined) {
            this.mastering = new Mastering();
        } else {
            this.mastering = val;
        }
        this.controlInput();
    }
    mastering!: Mastering;
    @Input() isNew!: boolean;
    
    @Output() deleteMasteringInDaddy: EventEmitter<void> = new EventEmitter<void>(); // () car daddy connait déjà le mastering
    @Output() updateMasteringInDaddy: EventEmitter<void> = new EventEmitter<void>(); 
    @Output() addMasteringInDaddy: EventEmitter<void> = new EventEmitter<void>(); 

    delete() {
        this.deleteMasteringInDaddy.emit(); // ask daddy to execute the delete mastering
    }
    update() {
        this.updateMasteringInDaddy.emit();
    }
    add() {
        this.addMasteringInDaddy.emit(); 
    }

    public frm!: FormGroup;
    private ctlId!: FormControl;
    public ctlSkillId!: FormControl;
    public ctlSkillName!: FormControl;
    public ctlCategoryId!: FormControl;
    public ctlCategoryName!: FormControl;
    public ctlLevel!: FormControl;

    // public skill!: Skill; 
    // public category!: Category; 
    public skills!: Skill[];

    constructor( // nthg in constructor bc input content overrides so content in controlInput() in @Input getMastering
        private fb: FormBuilder,
        private skillService: SkillService)  { }   

    controlInput() {
        this.ctlId = this.fb.control('', []);
        this.ctlSkillId = this.fb.control('', []);
        this.ctlSkillName = this.fb.control('', []);     // this.fb.control('', []); // form element potentially "controlled"
        this.ctlCategoryName = this.fb.control('', []);
        this.ctlCategoryId = this.fb.control('', []);
        this.ctlLevel = this.fb.control('', [Validators.required]);
        // fb.group content needs to respect the JSON we get from backend !
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
            level: this.ctlLevel
        })
        this.addSkillsInDropDown();
        this.frm.patchValue(this.mastering);
        // console.log(this.mastering);
        // console.log(this.masteringId);
    }

    skillChange() {
        // var addedSkillId = this.ctlSkillId;
        console.log(this.ctlSkillId);
        // var correspondingCategory = findCategoryBySkill(addedSkillId);
        // this.ctlCategoryName.patchValue(correspondingCategory.name);
        this.ctlCategoryName.patchValue("test"); // TODO: avec id du skill, aller chercher la catégorie correspondante
    }

    // ! chercher skill avec catégorie associée => SkillWithCategoryDTO in backend 

    addSkillsInDropDown() { // to test in constructor to check but also in controlAlim
        this.skillService.getAll().subscribe(skills => {
            this.skills = skills;
            // console.log(this.skills);
        });
    }

    // findCategoryBySkill(skillID: number) { // to test in constructor to check but also in controlAlim
    //     this.skill = new Skill();
    //     this.skillService.getById(skillID).subscribe(skill => {
    //         this.skill = skill;
    //     });
    //     return this.skill.category;
    // }

    // addMastering() {
    //     const masteringForm = this.fb.group({
    //         skillName: ['', Validators.required],
    //         categoryName: ['', ''],
    //         level: ['', Validators.required]
    //     });
    //     this.masterings.push(masteringForm);
    // }


}