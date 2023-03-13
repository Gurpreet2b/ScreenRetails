import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublisherListComponent } from './components/publisher-list.component';
import { CreatePublishersComponent } from './create-publishers/create-publishers.component';

const routes: Routes = [
  { path: '', component: PublisherListComponent },
  { path: 'add', component: CreatePublishersComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishersRoutingModule { }
