import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './components/layout.component';
import { HeaderComponent } from './header/header.component';
import { WarningMessageComponent } from './warningMessage/warningMessage.component';
import { SidebarComponent } from './sidebar/sidebar.component';
// import { AuthGuard } from '@core/guards/auth.guard';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from '../../guards/auth.guard';
import { HelpComponent } from './help/help.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { UserLimitMessageComponent } from './userLimitMessage/userLimitMessage.component';

export function translateHttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    LayoutComponent, 
    HeaderComponent, 
    WarningMessageComponent,
    UserLimitMessageComponent,
    SidebarComponent,
    HelpComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    RouterModule,
    ToastrModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: translateHttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    AuthGuard
  ]
})
export class LayoutModule { }
