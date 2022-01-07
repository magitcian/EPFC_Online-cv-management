import { Component, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { SkillService } from '../../services/skill.service';
import { CategoryService } from '../../services/category.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, AbstractControl, AsyncValidatorFn, ValidationErrors  } from '@angular/forms';
import * as _ from 'lodash-es';
import { Skill } from 'src/app/models/skill';
import { plainToClass } from 'class-transformer';
import { Category } from 'src/app/models/category';


@Component({
    selector: 'app-skill-edit-mat',
    templateUrl: './skill-edit.component.html',
    styleUrls: ['./skill-edit.component.css']
})
export class SkillEditComponent {

    public categories: Category[] = [];
    public frm!: FormGroup;
    private ctlId!: FormControl;
    public ctlSkillName!: FormControl;
    public ctlCategoryId!: FormControl;
    public ctlCategory!: FormControl;
    public ctlCategoryName!: FormControl;
    public isNew: boolean;

    constructor(public dialogRef: MatDialogRef<SkillEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { skill: Skill; isNew: boolean; },
        private fb: FormBuilder,
        private skillService: SkillService,
        private categoryService: CategoryService
    ) {
        this.ctlId = this.fb.control('', []);
        this.ctlSkillName = this.fb.control('', [Validators.required, Validators.minLength(2)], [this.nameUsed()]);
        this.ctlCategoryId = this.fb.control('', []);  
        this.ctlCategory = this.fb.control('', []);
        this.ctlCategoryName = this.fb.control('', []);
        this.frm = this.fb.group({ // building the form using FormBuilder
            id: this.ctlId,
            name: this.ctlSkillName,
            categoryId: this.ctlCategoryId,
            category: this.fb.group({
                id: this.ctlCategoryId,
                name: this.ctlCategoryName
            })
        })
        this.isNew = data.isNew;
        this.addCategoriesInDropDown();   
        this.frm.patchValue(data.skill);
    }

    addCategoriesInDropDown() { // to test in constructor to check but also in controlAlim
        this.categoryService.getAll().subscribe(categories => {
            this.categories = categories;
            // console.log(this.categories);
        });
    }

    nameUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: AbstractControl) => {
            clearTimeout(timeout);
            const name = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.skillService.isNameAvailable(this.frm.value.id, name).subscribe(res => {
                        resolve(res ? null : { nameUsed: true });
                    });
                }, 300);
            });
        };
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    update() {
        this.updateCategoryName();
        const data = this.frm.value;    // does not work with objects
        console.log(data); // this.dialogRef.close(this.frm.value);
        this.dialogRef.close(data); 
    }

    updateCategoryName() {
        this.categories.forEach (category => {
            if (category.id == this.ctlCategoryId.value)
                this.ctlCategoryName.patchValue(category.name);       
        })
    }

    cancel() {
        this.dialogRef.close();
    }
    
}
