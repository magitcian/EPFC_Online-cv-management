import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Title } from '../models/user';
// import { RelationshipsComponent } from '../components/relationships/relationships.component';
import { SignUpComponent } from '../components/signup/signup.component';
//import { ExperiencesViewComponent } from '../components/missions-view/missions-view.component';
//import { MissionsViewComponent } from '../components/old/missions-view/missions-view.component';
//import { CvViewComponent } from '../components/cv-view/cv-view.component';
import { CvConnectedUserComponent } from '../components/cv-connected-user/cv-connected-user.component';
import { CategoryListComponent } from '../components/category-list/category-list.component';
import { MyConsultantsManagementComponent, OtherConsultantsManagementComponent } from '../components/consultants-management/consultants-management.component';
// import { MasteringEditComponent } from '../components/mastering-edit-row/mastering-edit.component';
// import { MasteringEditFormDaddyComponent } from '../components/mastering-edit-form/mastering-edit-form-daddy.component';
import { SkillsManagementComponent } from '../components/skills-management/skills-management.component';
import { EnterprisesManagementComponent } from '../components/enterprises-management/enterprises-management.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  // { path: 'members', component: MemberListComponent },
  // { path: '**', redirectTo: '' }
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Title.AdminSystem] }
  }, 
  {
    path: 'skills',
    component: SkillsManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: [Title.AdminSystem, Title.Manager] }
  },
  {
    path: 'enterprises',
    component: EnterprisesManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: [Title.AdminSystem, Title.Manager] }
  },
  {
    path: 'categories',
    component: CategoryListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Title.AdminSystem] }
  },
  // {
  //   path: 'masterings',
  //   // canActivate: [AuthGuard],
  //   component: MasteringEditComponent
  // },  

  // {
  //   path: 'masteringsDaddy',
  //   // canActivate: [AuthGuard],
  //   component: MasteringEditFormDaddyComponent
  // },
  {
    path: 'my-consultants-cv-management',
    component: MyConsultantsManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: [Title.AdminSystem, Title.Manager] }
  }, 
  {
    path: 'other-consultants-cv-management',
    component: OtherConsultantsManagementComponent,
    canActivate: [AuthGuard],
    data: { roles: [Title.AdminSystem, Title.Manager] }
  }, 
  // {
  //   path: 'friends',
  //   component: RelationshipsComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'signup', component: SignUpComponent },
  //{ path: 'experiences-view', component: ExperiencesViewComponent },
 // { path: 'missions-view', component: MissionsViewComponent },
  //{ path: 'cv-view', component: CvViewComponent },
  { 
    path: 'cv-connected-user', 
    component: CvConnectedUserComponent,
    canActivate: [AuthGuard] 
  },
  { path: 'restricted', component: RestrictedComponent },
  { path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
