import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateAlertRoutingModule } from './create-alert-routing.module';
import { CreateAlertComponent } from './components/create-alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { SentAlertComponent } from './sent-alert/sent-alert.component';
import { DraftAlertComponent } from './draft/draft-alert.component';
import { MultipleAlertComponent } from './multiple alert/multiple-alert.component';
import { SendUserAlertComponent } from './send-user-alert/send-user-alert.component';
import { TreeviewModule } from 'ngx-treeview';
import { NgxPaginationModule } from 'ngx-pagination';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';
import { ScheduleAlertComponent } from './schdule-alert/schedule-alert.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ExpiryAlertComponent } from './expiry-alert/expiry-alert.component';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [CreateAlertComponent, SentAlertComponent, DraftAlertComponent, MultipleAlertComponent,
    SendUserAlertComponent, ScheduleAlertComponent, ExpiryAlertComponent],
  imports: [
    CommonModule,
    CreateAlertRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularEditorModule,
    TreeviewModule.forRoot(),
    HighchartsChartModule,
    NgxChartsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    EditorModule
  ],
})
export class CreateAlertModule { }
