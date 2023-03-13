import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-shealth-alert',
  templateUrl: './shealth-alert.component.html',
  styleUrls: ['./shealth-alert.component.css'],
})
export class ShealthAlertComponent implements OnInit {

  public loading = false;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
    private dtPipe: DatePipe,public translate: TranslateService,
    private authService: AuthService) {
      translate.setDefaultLang(authService.currentLanguage);
  }
  ngOnInit(): void {
    this.authService.SetRestaurantName(`System Health `);
  }
  
}