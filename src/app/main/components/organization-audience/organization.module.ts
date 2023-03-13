import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationRoutingModule } from './organization-routing.module';
import { OrganizationListComponent } from './components/organization-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import {  CreateOrganizationComponent } from './create-organization/create-organization.component';
import { AgroupAlertComponent } from './AD-filter/agroup-alert.component';
import { AudienceAlertComponent } from './add-group/audience-alert.component';
import { UserAlertComponent } from './add-user/user-alert.component';
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
  declarations: [OrganizationListComponent, CreateOrganizationComponent,  AgroupAlertComponent, AudienceAlertComponent, UserAlertComponent],
  imports: [
    CommonModule,
    OrganizationRoutingModule,
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
export class OrganizationModule { }
