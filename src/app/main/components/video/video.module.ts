import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoAlertRoutingModule } from './video-routing.module';
import { VideoAlertComponent } from './components/video-alert.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { VideoListComponent } from './video-list/video-list.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { HighchartsChartModule } from 'highcharts-angular';
import { TreeviewModule } from 'ngx-treeview';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [VideoAlertComponent, VideoListComponent],
  imports: [
    CommonModule,
    VideoAlertRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    AngularEditorModule,
    TreeviewModule.forRoot(),
    HighchartsChartModule,
    NgxChartsModule,
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
export class VideoModule { }
