import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PoliciesListComponent } from './components/policies-list.component';
import { CreatePoliciesComponent } from './create-policies/create-policies.component';
//import { CreateScreensaverComponent } from './create-screensaver/create-screensaver.component';
const routes: Routes = [
  { path: '', component: PoliciesListComponent },
  { path: 'add', component: CreatePoliciesComponent },
  { path: 'add/:id', component: CreatePoliciesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PoliciesRoutingModule { }
