import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {  SettingsListComponent } from './components/settings-list.component';
import {  CreateSettingsComponent } from './create-settings/create-settings.component';
import { ProfileAlertComponent } from './profile/profile-alert.component';
import { ShealthAlertComponent } from './shealth/shealth-alert.component';
import { ViewListComponent } from './view-list/view-list.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [SettingsListComponent, CreateSettingsComponent, ProfileAlertComponent, ShealthAlertComponent, ViewListComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
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
export class SettingsModule { }
