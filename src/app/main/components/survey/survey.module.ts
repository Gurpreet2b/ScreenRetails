import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SurveyRoutingModule } from './survey-routing.module';
import { CreateSurveyComponent } from './components/create-survey.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ActiveAlertComponent } from './active/active-alert.component';
import { ArchivedAlertComponent } from './archived/archived-alert.component';
import { TemplatesAlertComponent } from './survey-templates/templates-alert.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxPaginationModule } from 'ngx-pagination';
// import { Angular2CsvModule } from 'angular2-csv';
import { TreeviewModule } from 'ngx-treeview';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [CreateSurveyComponent, ActiveAlertComponent, ArchivedAlertComponent, TemplatesAlertComponent],
  imports: [
    CommonModule,
    SurveyRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NgxPaginationModule,
    HighchartsChartModule,
    // Angular2CsvModule,
    TreeviewModule.forRoot(),
    NgxChartsModule,
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
export class SurveyModule { }
