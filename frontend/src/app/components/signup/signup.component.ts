import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, AsyncValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignUpComponent {
    public frm!: FormGroup;
    public ctlLastName!: FormControl;
    public ctlFirstName!: FormControl;
    public ctlEmail!: FormControl;
    public ctlProfile!: FormControl;
    public ctlPassword!: FormControl;
    public ctlPasswordConfirm!: FormControl;

    constructor(
        public authService: AuthenticationService,  // pour pouvoir faire le login
        public router: Router,                      // pour rediriger vers la page d'accueil en cas de login
        private fb: FormBuilder                     // pour construire le formulaire, du côté TypeScript
    ) {
        this.ctlLastName = this.fb.control('', [Validators.minLength(3)]);
        this.ctlFirstName = this.fb.control('', [Validators.minLength(3)]);
        this.ctlEmail = this.fb.control('', [Validators.required, Validators.minLength(3), this.validateEmail()], [this.emailUsed()]);
        this.ctlPassword = this.fb.control('', [Validators.required, Validators.minLength(3)]);
        this.ctlPasswordConfirm = this.fb.control('', [Validators.required, Validators.minLength(3)]);
        this.frm = this.fb.group({
            lastName: this.ctlLastName,
            firstName: this.ctlFirstName,
            email: this.ctlEmail,
            password: this.ctlPassword,
            passwordConfirm: this.ctlPasswordConfirm,
        }, { validator: this.crossValidations });
    }

    // Validateur asynchrone qui vérifie si le pseudo n'est pas déjà utilisé par un autre membre.
    // Grâce au setTimeout et clearTimeout, on ne déclenche le service que s'il n'y a pas eu de frappe depuis 300 ms.
    emailUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: AbstractControl) => {
            clearTimeout(timeout);
            const email = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.authService.isEmailAvailable(email).subscribe(res => {
                        resolve(res ? null : { pseudoUsed: true });
                    });
                }, 300);
            });
        };
    }

    crossValidations(group: FormGroup): ValidationErrors | null {
        if (!group.value) { return null; }
        return group.value.password === group.value.passwordConfirm ? null : { passwordNotConfirmed: true };
    }

    signup() {
        this.authService.signup(this.ctlEmail.value, this.ctlPassword.value, this.ctlFirstName.value, this.ctlLastName.value).subscribe(() => {
            if (this.authService.currentUser) {
                // Redirect the user
                this.router.navigate(['/']);
            }
        });
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
}
