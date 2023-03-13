import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsListComponent } from './components/reports-list.component';
import { CreateReportsComponent } from './create-reports/create-reports.component';

//import { CreateScreensaverComponent } from './create-screensaver/create-screensaver.component';
const routes: Routes = [
  { path: '', component: ReportsListComponent },
  // { path: 'add', component: CreateReportsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
