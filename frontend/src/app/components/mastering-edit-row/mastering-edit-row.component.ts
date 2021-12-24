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

    // public skill!: Skill; 
    // public category!: Category; 
    public skills!: Skill[];

    constructor( // nthg in constructor bc input content overrides so content in controlInput() in @Input getMastering
        private fb: FormBuilder,
        private skillService: SkillService,
        private masteringService: MasteringService,
        public snackBar: MatSnackBar)  { }   

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

    // add() {
    //     var res = this.frm.value; // cherche les valeurs de la row du form
    //     res.id = 0;
    //     this.masteringService.add(res).subscribe(res => { // res: ce que me renvoie le backend 
    //         if (!res) {
    //             this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
    //             // console.log(res.valueOf());
    //         } else {
    //             this.refreshInDaddy.emit();
    //         }            
    //     }); // add snackBar
    //     console.log(res);
        
    // }

    add() {
        var res = this.frm.value; // cherche les valeurs de la row du form
        res.id = 0;
        _.assign(this.mastering, res);    // dit que le res est formaté comme un mastering (il faut le repréciser)
        res = plainToClass(Mastering, res); 
        this.addMasteringInDaddy.emit(res);   
    }

    delete() {
        this.deleteMasteringInDaddy.emit(); // ask daddy to execute the delete mastering
    }

    update() {
        var res = this.frm.value; // récupère la ligne (row) qui a été modifiée
        this.updateMasteringInDaddy.emit(res); // res est un EventEmitter et celui-ci va être transformé en Mastering
    }
    
    // addOption2() {
    //     var res = this.frm.value; 
    //     this.addMasteringInDaddy.emit(res); 
    // }

    cancel() {
        this.ctlLevel.patchValue(this.mastering.level);
        // this.refreshInDaddy.emit();
    }

}