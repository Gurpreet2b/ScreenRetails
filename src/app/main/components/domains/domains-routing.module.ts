import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DomainsListComponent} from './components/domains-list.component';
import { CreateDomainsComponent } from './create-domains/create-domains.component';
import { FilterAlertComponent } from './filter/filter-alert.component';
import { FileAlertComponent } from './import-files/file-alert.component';

const routes: Routes = [
  { path: '', component: DomainsListComponent },
  // { path: 'add', component: CreateDomainsComponent },
  { path: 'filter',component: FilterAlertComponent},
  { path: 'file', component: FileAlertComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomainsRoutingModule { }
