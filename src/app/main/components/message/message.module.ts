import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageListComponent } from './components/message-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CreateMessageComponent } from './create-message/create-message.component';
import { MessageRoutingModule } from './message-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import factory from 'highcharts-custom-events';
import { EditorModule } from '@tinymce/tinymce-angular';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [MessageListComponent,CreateMessageComponent ],
  imports: [
    CommonModule,
    MessageRoutingModule,
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
export class MessageModule { }
