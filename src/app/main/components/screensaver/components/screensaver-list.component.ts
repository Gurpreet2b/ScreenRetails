import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';

import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-screensaver-list',
  templateUrl: './screensaver-list.component.html',
  styleUrls: ['./screensaver-list.component.css'],
})
export class ScreensaverListComponent implements OnInit {

  public loading = false;
  public ScreenSaverList: any = [];
  ScreensaverTitle: any;
  screensaverId: any;
  // ScreensaverList: any;
  Think: any;
  HeaderBorder: any;
  HeaderLogo: any;
  HeaderTextImg: any;
  //totalItems: any;
  //GetScreensaverList: any;
  public Permission: any = [];
  public RoleName: any;
  public RoleAssign: any = [];

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Screensavers List`);
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.RoleName = this.Permission.role;
    this.GetScreensaverList(1);
  }

  dateformat(datas: string) {
    return this.authService.Dateformat(datas);
  }

  Timeformat(time: string) {
    return this.authService.Timeformat(time);
  }

  formScreenSaver = new FormGroup({
    search: new FormControl(''),
  });

  onSearchScreenSaver(formValue: any) {
    this.GetScreensaverList(1)
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetScreensaverList(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formScreenSaver.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`screensaveralert/dashboard_list/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.ScreenSaverList = res.data;
        this.totalItems = responseData.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumber = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJump) {
        this.PageTotalNumber.push(i);
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


  currentPage: number = 1;
  totalItems: number | undefined;
  onPageChange(event: any, data: any) {
    if (data === '1') {
      this.currentPage = event;
      this.GetScreensaverList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetScreensaverList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteScreenSaver(id);
    }
  }
  onDeleteScreenSaver(id: number) {
    this.loading = true;
    this.http.delete(`screensaveralert/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Screensaver Deleted Successfully");
        this.GetScreensaverList(this.currentPage);
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.toastr.error(res.error);
        this.loading = false;
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

  IsResumeAlert(id: any) {
    this.loading = true;
    this.http.post(`screensaveralert/${id}/resume_screensaver_alert/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('Screensaver Started Successfully !!');
        this.GetScreensaverList(1);
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
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


  IsStoppedAlert(id: any) {
    this.loading = true;
    this.http.post(`screensaveralert/${id}/pause_screensaver_alert/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('Screensaver Stopped Successfully !!');
        this.GetScreensaverList(1);
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
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

  GetScreensaverListById(item: any) {
    if (item.alert_type === 'PopupAlert') {
      this.Think = item.skin_id.border_thickness;
      this.HeaderBorder = item.skin_id.border_color;
      this.HeaderLogo = item.skin_id.team_image_align;
      this.HeaderTextImg = item.skin_id.team_image;
    }
    // else if (item.alert_type === 'TickerAlert') {
    // }
  }


}