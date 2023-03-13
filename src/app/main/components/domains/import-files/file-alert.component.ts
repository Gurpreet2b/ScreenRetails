import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-file-alert',
  templateUrl: './file-alert.component.html',
  styleUrls: ['./file-alert.component.css'],
})
export class FileAlertComponent implements OnInit {

  public loading = false;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
      translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Import from files`);
  }

  onFileAlertChange(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file.size > '2097152') {
      this.toastr.warning("File size cannot be larger than 2MB!");
      return;
    } 
    else{

    }
  }

}