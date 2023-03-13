import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SentAlertComponent } from '../create-alert/sent-alert/sent-alert.component';
import { EmergencyListComponent } from './components/emergency-list.component';
import { CreateEmergencyComponent} from './create-emergency/create-emergency.component';
import { SendNowAlertComponent } from './create-send/send-alert.component';
import { ShortcutAlertComponent } from './create-shortcut/shortcut-alert.component';
import { EmergencyAlertComponent } from './emergency-alert/emergency-alert.component';
import { SendUserAlertComponent } from './send-user-alert/send-user-alert.component';

const routes: Routes = [
  { path: '', component: EmergencyListComponent },
  { path: 'add', component: CreateEmergencyComponent },
  { path: 'emergency',component: EmergencyAlertComponent},
  { path: 'emergency/:id/:type/Alert/:edit', component: EmergencyAlertComponent },
  { path: 'shortcut', component: ShortcutAlertComponent},
  { path: 'send-now', component: SendNowAlertComponent},
  { path: 'send-user/:id/:type', component: SendUserAlertComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmergencyRoutingModule { }
