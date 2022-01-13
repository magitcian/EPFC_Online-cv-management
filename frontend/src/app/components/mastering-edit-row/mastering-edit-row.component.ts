import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { User, Title } from 'src/app/models/user';
import { Mastering, Level } from 'src/app/models/mastering';
import { Skill } from 'src/app/models/skill';
import { Category } from 'src/app/models/category';
import { UserService } from '../../services/user.service';
import { MasteringService } from '../../services/mastering.service';
import { SkillService } from 'src/app/services/skill.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { plainToClass } from 'class-transformer';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { I } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-mastering-edit-row',
    templateUrl: './mastering-edit-row.component.html',
    styleUrls: ['./mastering-edit-row.component.css']
})

export class MasteringEditRowComponent {

    @Input() set getMastering(val: Mastering) {
        // console.log(val);
        this.mastering = val;
        this.controlInput();
    }
    @Input() set getMasterings(values: Mastering[]) {
        this.masterings = values;
    }
    @Input() isNew!: boolean;

    mastering!: Mastering;
    masterings!: Mastering[];
    isEnoughExperience: boolean = true;
    isVisible: boolean = false;
    public skills!: Skill[];

    @Output() deleteMasteringInDaddy: EventEmitter<void> = new EventEmitter<void>(); // () car daddy connait déjà le mastering
    @Output() updateMasteringInDaddy: EventEmitter<Mastering> = new EventEmitter<Mastering>();
    @Output() refreshInDaddy: EventEmitter<void> = new EventEmitter<void>();
    @Output() addMasteringInDaddy: EventEmitter<Mastering> = new EventEmitter<Mastering>();

    public frm!: FormGroup;
    private ctlId!: FormControl;
    public ctlSkillId!: FormControl;
    public ctlSkillName!: FormControl;
    public ctlCategoryId!: FormControl;
    public ctlCategoryName!: FormControl;
    public ctlLevel!: FormControl;   

    constructor( // nthg in constructor bc input content overrides so content in controlInput() in @Input getMastering
        private fb: FormBuilder,
        private skillService: SkillService,
        private masteringService: MasteringService,
        public snackBar: MatSnackBar) { }

    controlInput() {
        this.ctlId = this.fb.control('', []);
        //this.ctlSkillId = this.fb.control('', [this.isSkillAlreadyUsed()]);
        this.ctlSkillId = this.fb.control('', [Validators.required, this.isSkillAlreadyUsed()]);
        this.ctlSkillName = this.fb.control('', []);     // this.fb.control('', []); // form element potentially "controlled"
        this.ctlCategoryName = this.fb.control('', []);
        this.ctlCategoryId = this.fb.control('', []);
        //this.ctlLevel = this.fb.control('', []);
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
        this.checkEnoughExperience();
    }

    skillChange() {
        // this.ctlCategoryName.patchValue("test"); 
        var correspondingCategoryName: string = this.getCategoryName();
        this.ctlCategoryName.patchValue(correspondingCategoryName);
    }

    addSkillsInDropDown() { // to test in constructor to check but also in controlAlim
        this.skillService.getAll().subscribe(skills => {
            this.skills = skills;
            // console.log(this.skills);
        });
    }

    getCategoryName() {
        var selectedSkillId: number = this.ctlSkillId.value;
        var correspondingCategoryName: string = "";
        this.skills.forEach(skill => {
            if (skill.id == selectedSkillId) {
                correspondingCategoryName = (skill.category != null && skill.category.name != null ? skill.category.name : "");
                //    correspondingCategoryName = skill!.category!.name!; // never null in this case
            }
        });
        return correspondingCategoryName;
    }

    add() {
        var res = this.frm.value; // cherche les valeurs de la row du form
        res.id = 0;
        _.assign(this.mastering, res);    // dit que le res est formaté comme un mastering (il faut le repréciser)
        res = plainToClass(Mastering, res);
        this.addMasteringInDaddy.emit(res);
        //Pour remettre les control à blanc
        this.frm.reset();

        // this.mastering = new Mastering();
        // this.controlInput();
        
        // this.frm.markAsPristine();
        // this.frm.markAsUntouched();
    }

    delete() {
        this.deleteMasteringInDaddy.emit(); // ask daddy to execute the delete mastering
    }

    update() {
        var res = this.frm.value; // récupère la ligne (row) qui a été modifiée
        this.updateMasteringInDaddy.emit(res); // res est un EventEmitter et celui-ci va être transformé en Mastering
    }

    addBtn() {
        this.isVisible = true;
    }

    cancel() {
        this.ctlLevel.patchValue(this.mastering.level);
        this.isVisible = false;
    }

    checkEnoughExperience() {
        if (this.mastering.id != null) {
            this.masteringService.getIsEnoughExperience(this.mastering.id).subscribe(res => {
                this.isEnoughExperience = res;
                // if (!res) {
                //     this.isEnoughExperience = false;
                // } else {
                //     this.isEnoughExperience = true;
                // }            
            });
        }
    }

    isSkillAlreadyUsed(): any {
        return (ctl: FormControl) => {
            if (this.isNew) {
                const id = this.ctlSkillId.value;
                let nameAlreadyUsed: boolean = false;
                this.masterings.forEach(m => {
                    if (m.skill != null && m.skill.id != null && m.skill.id == id) {
                        nameAlreadyUsed = true;
                    }
                });
                if (nameAlreadyUsed) {
                    return { skillAlreadyUsed: true }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        };
    }

}