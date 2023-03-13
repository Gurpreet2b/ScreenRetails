import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LockscreenRoutingModule } from './lockscreen-routing.module';
import { LockscreenListComponent } from './components/lockscreen-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {  CreateLockscreenComponent } from './create-lockscreen/create-lockscreen.component';
import { TreeviewModule } from 'ngx-treeview';
import { NgxPaginationModule } from 'ngx-pagination';
import { DraftWallpaperComponent } from './draft-lockscreen/draft-alert.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [LockscreenListComponent, CreateLockscreenComponent, DraftWallpaperComponent],
  imports: [
    CommonModule,
    LockscreenRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    AngularEditorModule,
    TreeviewModule.forRoot(),
    NgxPaginationModule,
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
export class LockscreenModule { }
