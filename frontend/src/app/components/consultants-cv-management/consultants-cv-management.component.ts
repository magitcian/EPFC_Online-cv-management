import { Component, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CvViewComponent } from '../cv-view/cv-view.component';
import { User } from '../../models/user';

/**
 * @title Tab group with dynamically changing tabs
 */
@Component({
  selector: 'app-consultants-cv-management',
  templateUrl: 'consultants-cv-management.component.html',
  styleUrls: ['consultants-cv-management.component.css'],
})
export class ConsultantsCvManagementComponent {
  @Input() areMyConsultants!: boolean;
  tabs :any[] = []
  selected = new FormControl(0);
  CvViewComponent = CvViewComponent;

  addTabCVUser(user : User) {
    let findCV : boolean = false;
    for (let i = 0; i < this.tabs.length; i++) {
      if(this.tabs[i].userID == user.id){
        findCV = true;
        this.selected.setValue(i + 1);
      }
    }
    if(!findCV){
      let tab = { tabName: `CV ${user.firstName} ${user.lastName}`, selector: CvViewComponent, userID : user.id}; 
      this.tabs.push(tab);
    }
  }

  removeTabCVUser(user : User) {
    for (let i = this.tabs.length-1; i >= 0 ; i--) {
      if(this.tabs[i].userID == user.id){
        this.tabs.splice(i, 1);
      }
    }
  }

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}

