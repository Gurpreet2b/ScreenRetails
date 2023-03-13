import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IpgroupListComponent } from './components/ipgroup-list.component';
import { CreateIpgroupComponent} from './create-ipgroup/create-ipgroup.component';
//import { CreateScreensaverComponent } from './create-screensaver/create-screensaver.component';
const routes: Routes = [
  { path: '', component: IpgroupListComponent },
  { path: 'add', component: CreateIpgroupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IpgroupRoutingModule { }
