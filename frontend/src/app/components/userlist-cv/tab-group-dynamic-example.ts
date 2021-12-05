import { Component, Input} from '@angular/core';
import { FormControl } from '@angular/forms';
import { CvViewComponent } from '../cv-view/cv-view.component';
import { User } from '../../models/user';

/**
 * @title Tab group with dynamically changing tabs
 */
@Component({
  selector: 'tab-group-dynamic-example2',
  templateUrl: 'tab-group-dynamic-example.html',
  styleUrls: ['tab-group-dynamic-example.css'],
})
export class TabGroupDynamicExample2 {
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

