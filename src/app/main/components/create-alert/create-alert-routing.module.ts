import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAlertComponent } from './components/create-alert.component';
import { DraftAlertComponent } from './draft/draft-alert.component';
import { ExpiryAlertComponent } from './expiry-alert/expiry-alert.component';
import { MultipleAlertComponent } from './multiple alert/multiple-alert.component';
import { ScheduleAlertComponent } from './schdule-alert/schedule-alert.component';
import { SendUserAlertComponent } from './send-user-alert/send-user-alert.component';
import { SentAlertComponent } from './sent-alert/sent-alert.component';

const routes: Routes = [
  { path: '', component: CreateAlertComponent },
  { path: 'sent', component: SentAlertComponent },
  { path: 'expiry', component: ExpiryAlertComponent },
  { path: 'schedule-list/:id', component: ScheduleAlertComponent },
  { path: ':id/:type', component: CreateAlertComponent },
  { path: ':id/:type/Alert/:edit', component: CreateAlertComponent },
  { path: 'draft', component: DraftAlertComponent },
  { path: 'multiple', component: MultipleAlertComponent },
  { path: 'send-user', component: SendUserAlertComponent },
  { path: 'send-user/:id/:type', component: SendUserAlertComponent },
  { path: 'send-user/:id/:type/:parentId/editUsers', component: SendUserAlertComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateAlertRoutingModule { }
