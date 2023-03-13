import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmergencyRoutingModule} from './emergency-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { EmergencyListComponent} from './components/emergency-list.component';
import { CreateEmergencyComponent} from './create-emergency/create-emergency.component';
import { EmergencyAlertComponent } from './emergency-alert/emergency-alert.component';
import { ShortcutAlertComponent } from './create-shortcut/shortcut-alert.component';
import { SendNowAlertComponent } from './create-send/send-alert.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { SendUserAlertComponent } from './send-user-alert/send-user-alert.component';
import { TreeviewModule } from 'ngx-treeview';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';
import { EditorModule } from '@tinymce/tinymce-angular';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [EmergencyListComponent, CreateEmergencyComponent, SendUserAlertComponent,
     EmergencyAlertComponent, ShortcutAlertComponent, SendNowAlertComponent],
  imports: [
    CommonModule,
    EmergencyRoutingModule,
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
    }),
    EditorModule
  ],
})
export class EmergencyModule { }
