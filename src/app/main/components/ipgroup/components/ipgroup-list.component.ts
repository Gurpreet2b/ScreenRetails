import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-ipgroup-list',
  templateUrl: './ipgroup-list.component.html',
  styleUrls: ['./ipgroup-list.component.css'],
})
export class IpgroupListComponent implements OnInit {

  public loading = false;
  IpgroupList: any;
  ipgroupId: string;
  IpgroupTitle: string;


  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`IP groups`);
    this.GetIpgroupList();
  }

  ValueChanged(type: any) {
    if (type === 'Ipgroup') {
      this.GetIpgroupList();
    }
  }

  onAddIpgroup() {
    this.ipgroupId = '';
    this.IpgroupTitle = 'Create';
  }

  onEditIpgroup(id: any) {
    this.ipgroupId = id;
    this.IpgroupTitle = 'Edit';
  }

  GetIpgroupList() {
    this.loading = true;
    this.http.get(`lockscreenalert/`, null).subscribe((res: any) => {
      this.IpgroupList = res.results;
      if (res.status === true) {
        const responseData = res;
        this.authService.setCurrentUser({ token: res.token });
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    }, error => {
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
      } else {
        this.toastr.error(error);
        this.loading = false;
      }
    });

  }


}