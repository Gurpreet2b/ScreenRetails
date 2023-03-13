import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessageListComponent } from './components/message-list.component';
import { CreateMessageComponent } from './create-message/create-message.component';

const routes: Routes = [
  { path: '', component: MessageListComponent },
//  { path: 'add', component: CreateMessageComponent},
//  { path: ':id', component: CreateMessageComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MessageRoutingModule { }


