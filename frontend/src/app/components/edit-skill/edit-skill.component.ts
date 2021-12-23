import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { SkillService } from '../../services/skill.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { Skill } from 'src/app/models/skill';
import { plainToClass } from 'class-transformer';


@Component({
    selector: 'app-edit-skill-mat',
    templateUrl: './edit-skill.component.html',
    styleUrls: ['./edit-skill.component.css']
})
export class EditSkillComponent {
    public frm!: FormGroup;
    // public frmPhone!: FormGroup; 
    private ctlId!: FormControl;
    public ctlName!: FormControl;
    public ctlCategoryId!: FormControl;
    public ctlCategoryName!: FormControl;
    public isNew: boolean;

    constructor(public dialogRef: MatDialogRef<EditSkillComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { skill: Skill; isNew: boolean; },
        private fb: FormBuilder,
        private skillService: SkillService
    ) {
        this.ctlName = this.fb.control('', [
            Validators.required,
            Validators.minLength(3)
        ], [this.nameUsed()]);
        this.ctlCategoryId = this.fb.control('', []);
        this.ctlCategoryName = this.fb.control('', []);
        // this.ctlPassword = this.fb.control('', data.isNew ? [Validators.required, Validators.minLength(3)] : []);
        // this.ctlLastName = this.fb.control(null, [Validators.minLength(3)]);
        // this.ctlFirstName = this.fb.control(null, [Validators.minLength(3)]);
        // this.ctlBirthDate = this.fb.control(null, [this.validateBirthDate()]);
        // this.ctlTitle = this.fb.control(Title.Consultant, []);
        this.frm = this.fb.group({
            id: this.ctlId,
            name: this.ctlName,
            ctlCategoryId: this.ctlCategoryId,
            ctlCategoryName: this.ctlCategoryName,
        });

        this.isNew = data.isNew;
        this.frm.patchValue(data.skill);
    }

    // Validateur asynchrone qui vérifie si l'email n'est pas déjà utilisé par un autre user
    nameUsed(): any {
        let timeout: NodeJS.Timer;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const name = ctl.value; // issue
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine) {
                        resolve(null);
                    } else {
                        this.skillService.getById(name).subscribe(skill => { // TODO: should I add 
                            resolve(skill ? { nameUsed: true } : null);
                        });
                    }
                }, 300);
            });
        };
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    update() {
        // this.dialogRef.close(this.frm.value);
        const data = this.frm.value;
        this.dialogRef.close(data); 
    }

    cancel() {
        this.dialogRef.close();
    }

}
