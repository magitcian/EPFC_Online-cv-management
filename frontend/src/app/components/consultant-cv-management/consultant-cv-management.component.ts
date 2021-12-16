import { Component, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CvViewComponent } from '../cv-view/cv-view.component';
import { User } from '../../models/user';

/**
 * @title Tab group with dynamically changing tabs
 */
@Component({
  selector: 'app-consultant-cv-management',
  templateUrl: 'consultant-cv-management.component.html',
  styleUrls: ['consultant-cv-management.component.css'],
})
export class ConsultantCvManagementComponent {
  tabs :any[] = []
  selected = new FormControl(0);
  CvViewComponent = CvViewComponent;

  addTabCVUser(user : User) {
    let tab = { tabName: `CV ${user.firstName} ${user.lastName}`, selector: CvViewComponent, userID : user.id}; 
    this.tabs.push(tab);
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}

