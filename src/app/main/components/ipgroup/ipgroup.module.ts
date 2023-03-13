import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IpgroupRoutingModule } from './ipgroup-routing.module';
import { IpgroupListComponent } from './components/ipgroup-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {  CreateIpgroupComponent } from './create-ipgroup/create-ipgroup.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [IpgroupListComponent, CreateIpgroupComponent],
  imports: [
    CommonModule,
    IpgroupRoutingModule,
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
export class IpgroupModule { }
