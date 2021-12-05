import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { CounterComponent } from '../components/counter/counter.component';
import { FetchDataComponent } from '../components/fetch-data/fetch-data.component';
import { UserListComponent } from '../components/userlist/userlist.component';
import { RestrictedComponent } from '../components/restricted/restricted.component';
import { LoginComponent } from '../components/login/login.component';
import { UnknownComponent } from '../components/unknown/unknown.component';
import { AuthGuard } from '../services/auth.guard';
import { Title } from '../models/user';
import { CounterParentComponent } from '../components/counter-stateless/counter-parent.component';
// import { RelationshipsComponent } from '../components/relationships/relationships.component';
import { SignUpComponent } from '../components/signup/signup.component';
//import { ExperiencesViewComponent } from '../components/missions-view/missions-view.component';
import { MissionsViewComponent } from '../components/missions-view/missions-view.component';
import { CvViewComponent } from '../components/cv-view/cv-view.component';
import { CategoryListComponent } from '../components/categorylist/categorylist.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  { path: 'counter-stateless', component: CounterParentComponent },
  { path: 'fetch-data', component: FetchDataComponent },
  // { path: 'members', component: MemberListComponent },
  // { path: '**', redirectTo: '' }
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Title.AdminSystem] }
  }, 
  {
    path: 'categories',
    component: CategoryListComponent,
    canActivate: [AuthGuard],
    data: { roles: [Title.AdminSystem] }
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
  { path: 'cv-view', component: CvViewComponent },
  { path: 'restricted', component: RestrictedComponent },
  { path: '**', component: UnknownComponent }
];

export const AppRoutes = RouterModule.forRoot(appRoutes);
