import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  SynchronizationRoutingModule } from './synchronization-routing.module';
import {  SynchronizationListComponent } from './components/synchronization-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CreateSynchronizationComponent } from './create-synchronization/create-synchronization.component';
import { TreeviewModule } from 'ngx-treeview';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';
import { NgxPaginationModule } from 'ngx-pagination';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [SynchronizationListComponent, CreateSynchronizationComponent],
  imports: [
    CommonModule,
    SynchronizationRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NgxPaginationModule,
    TreeviewModule.forRoot(),
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
export class SynchronizationModule { }
