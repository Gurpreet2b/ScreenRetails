import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgroupAlertComponent } from './AD-filter/agroup-alert.component';
import { AudienceAlertComponent } from './add-group/audience-alert.component';
import { UserAlertComponent } from './add-user/user-alert.component';
import {  OrganizationListComponent } from './components/organization-list.component';
import { CreateOrganizationComponent} from './create-organization/create-organization.component';
const routes: Routes = [
  { path: '', component: OrganizationListComponent },
  { path: 'add', component: CreateOrganizationComponent },
  { path: 'agroup', component:AgroupAlertComponent},
  { path: 'audience', component:AudienceAlertComponent},
  { path: 'user', component:UserAlertComponent}
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganizationRoutingModule { }
