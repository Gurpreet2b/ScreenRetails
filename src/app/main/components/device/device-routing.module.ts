import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeviceListComponent } from './components/device-list.component';
import { CreateDeviceComponent } from './create-device/create-device.component';
import { SendContentComponent } from './send-content/send-content.component';
import { SendUserAlertComponent } from './send-user-alert/send-user-alert.component';
import { SentListComponent } from './sent/sent-list.component';

const routes: Routes = [
  { path:'',component: DeviceListComponent},
  { path: 'add', component: CreateDeviceComponent},
  { path: 'send-content', component: SendContentComponent},
  { path: 'send-user', component: SendUserAlertComponent},
  { path: 'sent-list', component: SentListComponent},
  { path: 'send-content/:id', component: SendContentComponent},
  { path: 'send-user/:id/:type', component: SendUserAlertComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeviceRoutingModule { }
