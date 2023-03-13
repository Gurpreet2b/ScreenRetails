import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {  SynchronizationListComponent } from './components/synchronization-list.component';
import {  CreateSynchronizationComponent } from './create-synchronization/create-synchronization.component';

const routes: Routes = [
  { path: '', component: SynchronizationListComponent },
  { path: 'add', component: CreateSynchronizationComponent },
  { path: 'edit/:id', component: CreateSynchronizationComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SynchronizationRoutingModule { }
