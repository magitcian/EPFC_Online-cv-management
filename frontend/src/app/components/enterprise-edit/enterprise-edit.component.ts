import { Component, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { EnterpriseService } from '../../services/enterprise.service';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import * as _ from 'lodash-es';
import { Enterprise } from 'src/app/models/enterprise';


@Component({
    selector: 'app-enterprise-edit-mat',
    templateUrl: './enterprise-edit.component.html',
    styleUrls: ['./enterprise-edit.component.css']
})
export class EnterpriseEditComponent {

    public frm!: FormGroup;
    private ctlId!: FormControl;
    public ctlEnterpriseName!: FormControl;
    public isNew: boolean;

    constructor(public dialogRef: MatDialogRef<EnterpriseEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { enterprise: Enterprise; isNew: boolean; },
        private fb: FormBuilder,
        private enterpriseService: EnterpriseService
    ) {
        this.ctlId = this.fb.control('', []);
        this.ctlEnterpriseName = this.fb.control('', [Validators.required], [this.nameUsed()]);
            // this.ctlEnterpriseName = this.fb.control('', [Validators.required, Validators.minLength(2)], [this.nameUsed()]);
        this.frm = this.fb.group({ // building the form using FormBuilder
            id: this.ctlId,
            name: this.ctlEnterpriseName
        })
        this.isNew = data.isNew;
        this.frm.patchValue(data.enterprise);
    }

    nameUsed(): AsyncValidatorFn {
        let timeout: NodeJS.Timeout;
        return (ctl: AbstractControl) => {
            clearTimeout(timeout);
            const name = ctl.value;
            return new Promise(resolve => {
                timeout = setTimeout(() => {
                    this.enterpriseService.isNameAvailable(name).subscribe(res => {
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
        const data = this.frm.value;    // does not work with objects
        console.log(data); // this.dialogRef.close(this.frm.value);
        this.dialogRef.close(data); 
    }

    cancel() {
        this.dialogRef.close();
    }
    
}
