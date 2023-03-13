import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SendUserAlertComponent } from '../create-alert/send-user-alert/send-user-alert.component';
import { ActiveAlertComponent } from './active/active-alert.component';
import { ArchivedAlertComponent } from './archived/archived-alert.component';
import { CreateSurveyComponent } from './components/create-survey.component';
import { TemplatesAlertComponent } from './survey-templates/templates-alert.component';

const routes: Routes = [
  { path: '', component: CreateSurveyComponent },
  { path: ':id/:type', component: CreateSurveyComponent },
  { path: ':id/:type/Alert/:edit', component: CreateSurveyComponent },
  { path: 'active', component: ActiveAlertComponent },
  { path: 'archived', component: ArchivedAlertComponent },
  { path: 'survey-template', component:  TemplatesAlertComponent},
  { path: 'send-user/:id/:type', component: SendUserAlertComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveyRoutingModule { }
