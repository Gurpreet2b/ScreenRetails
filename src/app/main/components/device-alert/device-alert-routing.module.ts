import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceAlertComponent } from './device-alert/device-alert.component';

const routes: Routes = [
  { path: '', component: DeviceAlertComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceAlertRoutingModule { }
