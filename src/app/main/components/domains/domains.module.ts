import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DomainsRoutingModule } from './domains-routing.module';
import { DomainsListComponent } from './components/domains-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {  CreateDomainsComponent } from './create-domains/create-domains.component';
import { FileAlertComponent } from './import-files/file-alert.component';
import { FilterAlertComponent } from './filter/filter-alert.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
//import { CreateScreensaverComponent } from './screensaver-publisher/create-screensaver.component';

@NgModule({
  declarations: [DomainsListComponent, CreateDomainsComponent, FileAlertComponent, FilterAlertComponent],
  imports: [
    CommonModule,
    DomainsRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    AngularEditorModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
})
export class DomainsModule { }
