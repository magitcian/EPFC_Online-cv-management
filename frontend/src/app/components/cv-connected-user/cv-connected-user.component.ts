
import { Component, AfterViewInit, Input } from '@angular/core';
import * as _ from 'lodash-es';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user';
import { Mission } from 'src/app/models/mission';
import { AuthenticationService } from '../../services/authentication.service';
import { Skill } from 'src/app/models/skill';
import { Category } from 'src/app/models/category';
import { Mastering } from 'src/app/models/mastering';

@Component({
    selector: 'app-cv-connected-user',
    templateUrl: './cv-connected-user.component.html',
    styleUrls: ['./cv-connected-user.component.css']
})
export class CvConnectedUserComponent {
    userCvId !: number;
    //isEditable: boolean = false;

    constructor(public authenticationService: AuthenticationService) {
        this.userCvId = this.authenticationService.currentUser?.id!;
    }

}
