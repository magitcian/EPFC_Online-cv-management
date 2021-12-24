import { Component, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { __exportStar } from 'tslib';
import { UserService } from '../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as _ from 'lodash-es';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
    selector: 'app-personal-data-view',
    templateUrl: './personal-data-view.component.html',
    styleUrls: ['./personal-data-view.component.css']
})

export class PersonalDataViewComponent {
    @Input() set getUserID(val: number) {
        this.userCvId = val;
        this.refresh();
    }
    @Input() userCvId !: number;
    @Input() isEditable!: boolean;
    user: User = new User();
    isEditMode: boolean = false;

    public frm!: FormGroup;
    private ctlId!: FormControl;
    public ctlFirstName!: FormControl;
    public ctlLastName!: FormControl;
    public ctlBirthDate!: FormControl;
    public ctlEmail!: FormControl;
    public maxDate: Moment = moment().subtract(18, 'years');
    public ctlPassword!: FormControl;
    public ctlPasswordConfirm!: FormControl;

    constructor(
        private fb: FormBuilder,
        public snackBar: MatSnackBar,
        private userService: UserService,
        public dialog: MatDialog,
    ) {

        this.ctlFirstName = this.fb.control('', [Validators.required]);
        this.ctlLastName = this.fb.control('', [Validators.required]);
        this.ctlBirthDate = this.fb.control(null, [this.validateBirthDate()]);
        this.ctlEmail = this.fb.control('', [Validators.required, this.validateEmail()], [this.emailUsed()]); //this.validateEmail(), this.emailUsed()
        this.ctlPassword = this.fb.control('', [ this.validatePassword()]);
        this.ctlPasswordConfirm = this.fb.control('', [this.validatePassword()]);
    }

    refresh() {
        this.userService.getById(this.userCvId).subscribe(user => {
            if (user != null) {
                this.user = user;
            }
            //console.log(this.user);
            this.controlForm();
        });
    }

    controlForm() {
        this.frm = this.fb.group({
            id: this.ctlId,
            firstName: this.ctlFirstName,
            lastName: this.ctlLastName,
            birthDate: this.ctlBirthDate,
            email: this.ctlEmail,
            password : this.ctlPassword,
            passwordConfirm: this.ctlPasswordConfirm }, { validator: this.crossValidations });
        this.frm.patchValue(this.user);
    }

    update() {
        let res = this.frm.value;
        //console.log(res);
        this.userService.update(res).subscribe(res => {
            if (!res) {
                this.snackBar.open(`There was an error at the server. The update has not been done! Please try again.`, 'Dismiss', { duration: 10000 });
            }else{
                this.refresh();
                this.changeEditMode();
            }
        });
    }

    changeEditMode() {
        if (this.isEditable) {
            this.isEditMode = !this.isEditMode;
        }
    }

    crossValidations(group: FormGroup): ValidationErrors | null {
        if (!group.value) { return null; }
        return group.value.password === group.value.passwordConfirm ? null : { passwordNotConfirmed: true };
    }

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

    validateEmail(): any {
        return (ctl: FormControl) => {
            const email = ctl.value;
            const regex = new RegExp("^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$"); //regex email
            if(!regex.test(email)){
                return { badEmailFormat: true };
            }
            return null;
        };
    }

    emailUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: AbstractControl) => {
            clearTimeout(timeout);
            const email = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.userService.isAnOtherEmailAvailable(email).subscribe(res => {
                        resolve(res ? null : { emailUsed: true });
                    });
                }, 300);
            });
        };
    }

    validatePassword(): any {
        return (ctl: FormControl) => {
            const pswd = ctl.value;
            if(pswd != ''){
                if(pswd.length < 10){
                    return { lengthProb: true };
                }
                return null;
            }
            return null;
        };
    }

}
