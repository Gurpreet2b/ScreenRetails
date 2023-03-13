import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OPTListComponent } from './components/opt-list.component';
import { CreateOPTComponent } from './create-opt/create-opt.component';

const routes: Routes = [
  { path: '', component: OPTListComponent },
  { path: 'add', component: CreateOPTComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OPTRoutingModule { }
