import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-agroup-alert',
  templateUrl: './agroup-alert.component.html',
  styleUrls: ['./agroup-alert.component.css'],
})
export class AgroupAlertComponent implements OnInit {

  public loading = false;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
      translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`View AD filter based groups `);
  }

  
  formAlertGroup = new FormGroup({
    search: new FormControl(''),
  });

  onSearchGroup(formValue: any) {
    this.GetAgroupList()
  }

  GetAgroupList (){

  }

}