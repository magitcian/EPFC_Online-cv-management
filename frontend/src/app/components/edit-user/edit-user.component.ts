import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import * as _ from 'lodash-es';
import { User, Title } from 'src/app/models/user';
import { Moment } from 'moment';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';

@Component({
    selector: 'app-edit-user-mat',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent {
    public frm!: FormGroup;
    // public frmPhone!: FormGroup; 
    private ctlId!: FormControl;
    public ctlLastName!: FormControl;
    public ctlFirstName!: FormControl;
    public ctlEmail!: FormControl;
    public ctlPassword!: FormControl;
    public ctlBirthDate!: FormControl;
    public ctlTitle!: FormControl;
    public isNew: boolean;
    public maxDate: Moment = moment().subtract(18, 'years');

    constructor(public dialogRef: MatDialogRef<EditUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { user: User; isNew: boolean; },
        private fb: FormBuilder,
        private userService: UserService
    ) {
        this.ctlEmail = this.fb.control('', [
            Validators.required,
            Validators.minLength(3)
            // ,
            // this.forbiddenValue('abc')
        ], [this.emailUsed()]);
        this.ctlPassword = this.fb.control('', data.isNew ? [Validators.required, Validators.minLength(3)] : []);
        this.ctlLastName = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlFirstName = this.fb.control(null, [Validators.minLength(3)]);
        this.ctlBirthDate = this.fb.control(null, [this.validateBirthDate()]);
        this.ctlTitle = this.fb.control(Title.Consultant, []);
        this.frm = this.fb.group({
            id: this.ctlId,
            email: this.ctlEmail,
            password: this.ctlPassword,
            lastName: this.ctlLastName,
            firstName: this.ctlFirstName,
            birthDate: this.ctlBirthDate,
            title: this.ctlTitle
        });

        this.isNew = data.isNew;
        this.frm.patchValue(data.user);
    }

    // // Validateur bidon qui vérifie que la valeur est différente
    // forbiddenValue(val: string): any {
    //     return (ctl: FormControl) => {
    //         if (ctl.value === val) {
    //             return { forbiddenValue: { currentValue: ctl.value, forbiddenValue: val } };
    //         }
    //         return null;
    //     };
    // }

    validateBirthDate(): any {
        return (ctl: FormControl) => {
            const birthDate: Moment = ctl.value;
            const today: Moment = moment();
            if (today < birthDate)
                return { futureBorn: true }
            var age = moment().diff(birthDate, 'years');
            if (age < 18)
                return { tooYoung: true };
            return null;
        };
    }

    // Validateur asynchrone qui vérifie si l'email n'est pas déjà utilisé par un autre user
    emailUsed(): any {
        let timeout: NodeJS.Timer;
        return (ctl: FormControl) => {
            clearTimeout(timeout);
            const email = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    if (ctl.pristine) {
                        resolve(null);
                    } else {
                        this.userService.getById(email).subscribe(user => { 
                            resolve(user ? { emailUsed: true } : null);
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

    // phoneAdd() { 
    //     if (!this.phones) { 
    //         this.phones = []; 
    //     } 
    //     this.phones.push(this.frmPhone.value); 
    //     this.frmPhone.reset(); 
    //     this.frm.markAsDirty(); 
    // } 

    // phoneDelete(phone: Phone) { 
    //     _.remove(this.phones, phone); 
    //     this.frm.markAsDirty(); 
    // } 
}
