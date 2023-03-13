import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RejectedListComponent} from './components/rejected-list.component';

const routes: Routes = [
  { path: '', component: RejectedListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RejectedRoutingModule { }
