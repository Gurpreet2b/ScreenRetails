import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkinListComponent } from './components/skin-list.component';
import { CreateSkinComponent } from './create-skin/create-skin.component';

const routes: Routes = [
  { path: '', component: SkinListComponent },
  { path: 'add', component: CreateSkinComponent},
  { path: ':id', component: CreateSkinComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkinRoutingModule { }
