import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsListComponent } from './components/settings-list.component';
import { CreateSettingsComponent } from './create-settings/create-settings.component';
import { ProfileAlertComponent } from './profile/profile-alert.component';
import { ShealthAlertComponent } from './shealth/shealth-alert.component';
import { ViewListComponent } from './view-list/view-list.component';

const routes: Routes = [
  { path: '', component: ViewListComponent },
  { path: 'common', component: SettingsListComponent },
  { path: 'add', component: CreateSettingsComponent },
  { path: 'profile', component: ProfileAlertComponent},
  { path: 'shealth', component: ShealthAlertComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
