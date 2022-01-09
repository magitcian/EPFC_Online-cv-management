import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Moment } from 'moment';
import * as moment from 'moment';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
    public frm!: FormGroup;
    public ctlLastName!: FormControl;
    public ctlFirstName!: FormControl;
    public ctlBirthDate!: FormControl;
    public maxDate: Moment = moment().subtract(18, 'years');
    public ctlEmail!: FormControl;
    public ctlProfile!: FormControl;
    public ctlPassword!: FormControl;
    public ctlPasswordConfirm!: FormControl;

    constructor(
        public authService: AuthenticationService,  // pour pouvoir faire le login
        public router: Router,                      // pour rediriger vers la page d'accueil en cas de login
        private fb: FormBuilder                     // pour construire le formulaire, du côté TypeScript
    ) {
        this.ctlLastName = this.fb.control('', [Validators.minLength(3), Validators.maxLength(50)]);
        // this.ctlLastName = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
        this.ctlFirstName = this.fb.control('', [Validators.minLength(3), Validators.maxLength(50)]);
        // this.ctlFirstName = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]);
        this.ctlBirthDate = this.fb.control('', [Validators.required, this.validateBirthDate()]);
        this.ctlEmail = this.fb.control('', [Validators.required, this.validateEmail()], [this.emailUsed()]);
        this.ctlPassword = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
        this.ctlPasswordConfirm = this.fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]);
        this.frm = this.fb.group({
            lastName: this.ctlLastName,
            firstName: this.ctlFirstName,
            birthDate: this.ctlBirthDate,
            email: this.ctlEmail,
            password: this.ctlPassword,
            passwordConfirm: this.ctlPasswordConfirm,
        }, { validator: this.crossValidations });
    }

    // Validateur asynchrone qui vérifie si l'email n'est pas déjà utilisé par un autre user.
    // Grâce au setTimeout et clearTimeout, on ne déclenche le service que s'il n'y a pas eu de frappe depuis 300 ms.
    emailUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: AbstractControl) => {
            clearTimeout(timeout);
            const email = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.authService.isEmailAvailable(email).subscribe(res => {
                        resolve(res ? null : { emailUsed: true });
                    });
                }, 300);
            });
        };
    }

    // validateFirstName(): any {
    //     return (ctl: FormControl) => {
    //         const firstName: string = ctl.value; // this.ctlFirstName.value;
    //         const lastName: string = this.ctlLastName.value;
    //         if (firstName == null && lastName != null)
    //             return { firstNameToComplete: true }
    //         return null;
    //     };
    // }

    crossValidations(group: FormGroup): ValidationErrors | null {
        if (!group.value) { return null; }
        return group.value.password === group.value.passwordConfirm ? null : { passwordNotConfirmed: true };
    }

    signup() {
        this.authService.signup(this.ctlEmail.value, this.ctlPassword.value, this.ctlFirstName.value, this.ctlLastName.value, this.ctlBirthDate.value).subscribe(() => {
            if (this.authService.currentUser) {
                // Redirect the user
                this.router.navigate(['/']);
            }
        });
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
            if(email != "" && !regex.test(email)){
                return { badEmailFormat: true };
            }
            return null;
        };
    }
}
