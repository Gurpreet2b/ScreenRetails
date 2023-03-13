import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceRoutingModule } from './device-routing.module';
import { DeviceListComponent} from './components/device-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CreateDeviceComponent } from './create-device/create-device.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SendContentComponent } from './send-content/send-content.component';
import { SendUserAlertComponent } from './send-user-alert/send-user-alert.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';
import { EditorModule } from '@tinymce/tinymce-angular';
import { SentListComponent } from './sent/sent-list.component';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [DeviceListComponent, CreateDeviceComponent, SendContentComponent, SendUserAlertComponent, SentListComponent ],
  imports: [
    CommonModule,
    DeviceRoutingModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    AngularEditorModule,
    NgxPaginationModule,
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
export class DeviceModule { }
