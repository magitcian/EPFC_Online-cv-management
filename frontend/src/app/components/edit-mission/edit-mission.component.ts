// import { Component, OnInit } from '@angular/core';
// import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Inject } from '@angular/core';
// import { UserService } from '../../services/user.service';
// import { FormGroup } from '@angular/forms';
// import { FormControl } from '@angular/forms';
// import { FormBuilder } from '@angular/forms';
// import { Validators } from '@angular/forms';
// import * as _ from 'lodash-es';
// import { User, Title } from 'src/app/models/user';
// import { Moment } from 'moment';
// import * as moment from 'moment';

// @Component({
//     selector: 'app-edit-mission-mat',
//     templateUrl: './edit-mission.component.html',
//     styleUrls: ['./edit-mission.component.css']
// })
// export class EditMissionComponent {
//     public frm!: FormGroup;
//     // public frmPhone!: FormGroup; 
//     private ctlId!: FormControl;
//     public ctlLastName!: FormControl;
//     public ctlFirstName!: FormControl;
//     public ctlEmail!: FormControl;
//     public ctlPassword!: FormControl;
//     public ctlBirthDate!: FormControl;
//     public ctlTitle!: FormControl;
//     public isNew: boolean;
//     public maxDate: Moment = moment().subtract(18, 'years');

//     constructor(public dialogRef: MatDialogRef<EditMissionComponent>,
//         @Inject(MAT_DIALOG_DATA) public data: { user: User; isNew: boolean; },
//         private fb: FormBuilder,
//         private userService: UserService
//     ) {
//         this.ctlEmail = this.fb.control('', [
//             Validators.required,
//             Validators.minLength(3)
//             // ,
//             // this.forbiddenValue('abc')
//         ], [this.emailUsed()]);
//         this.ctlPassword = this.fb.control('', data.isNew ? [Validators.required, Validators.minLength(3)] : []);
//         this.ctlLastName = this.fb.control(null, [Validators.minLength(3)]);
//         this.ctlFirstName = this.fb.control(null, [Validators.minLength(3)]);
//         this.ctlBirthDate = this.fb.control(null, [this.validateBirthDate()]);
//         this.ctlTitle = this.fb.control(Title.JuniorConsultant, []);
//         this.frm = this.fb.group({
//             id: this.ctlId,
//             email: this.ctlEmail,
//             password: this.ctlPassword,
//             lastName: this.ctlLastName,
//             firstName: this.ctlFirstName,
//             birthDate: this.ctlBirthDate,
//             title: this.ctlTitle
//         });

//         this.isNew = data.isNew;
//         this.frm.patchValue(data.user);
//     }

//     validateBirthDate(): any {
//         return (ctl: FormControl) => {
//             const birthDate: Moment = ctl.value;
//             const today: Moment = moment();
//             if (today < birthDate)
//                 return { futureBorn: true }
//             var age = moment().diff(birthDate, 'years');
//             if (age < 18)
//                 return { tooYoung: true };
//             return null;
//         };
//     }


//     emailUsed(): any {
//         let timeout: NodeJS.Timer;
//         return (ctl: FormControl) => {
//             clearTimeout(timeout);
//             const email = ctl.value;
//             return new Promise(resolve => {
//                 timeout = setTimeout(() => {
//                     if (ctl.pristine) {
//                         resolve(null);
//                     } else {
//                         this.userService.getById(email).subscribe(user => { 
//                             resolve(user ? { emailUsed: true } : null);
//                         });
//                     }
//                 }, 300);
//             });
//         };
//     }

//     onNoClick(): void {
//         this.dialogRef.close();
//     }

//     update() {
//         // this.dialogRef.close(this.frm.value);
//         const data = this.frm.value;
//         this.dialogRef.close(data); 
//     }

//     cancel() {
//         this.dialogRef.close();
//     }

// }
