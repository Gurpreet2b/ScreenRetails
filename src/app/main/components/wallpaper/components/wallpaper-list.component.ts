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
  selector: 'app-wallpaper-list',
  templateUrl: './wallpaper-list.component.html',
  styleUrls: ['./wallpaper-list.component.css'],
})
export class WallpaperListComponent implements OnInit {
  public loading = false;
  public wallpaperId: any;
  public WallpaperTitle: any;
  public WallpaperList: any = [];
  public Think: any;
  public HeaderBorder: any;
  public HeaderLogo: any;
  public HeaderTextImg: any;
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
    this.authService.SetRestaurantName(`Wallpapers List`);
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.RoleName = this.Permission.role;
    this.GetWallpaperList(1);
  }

  dateformat(datas: string) {
    return this.authService.Dateformat(datas);
  }

  Timeformat(time: string) {
    return this.authService.Timeformat(time);
  }

  formWallpaper = new FormGroup({
    search: new FormControl(''),
  });

  onSearchWallpaper(formValue: any) {
    this.GetWallpaperList(1)
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetWallpaperList(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formWallpaper.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`wallpaperalert/dashboard_list/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.WallpaperList = res.data;
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
      this.GetWallpaperList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetWallpaperList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteWallpaper(id);
    }
  }
  onDeleteWallpaper(id: number) {
    this.loading = true;
    this.http.delete(`wallpaperalert/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Wallpaper Alert Deleted Successfully");
        this.GetWallpaperList(this.currentPage);
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
    this.http.post(`wallpaperalert/${id}/resume_wallpaper_alert/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('wallpaper Started Successfully !!');
        this.GetWallpaperList(1);
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
    this.http.post(`wallpaperalert/${id}/pause_wallpaper_alert/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('wallpaper Stopped Successfully !!');
        this.GetWallpaperList(1);
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


  GetWallpaperListById(item: any) {
    // if (item.alert_type === 'PopupAlert') {
    //   this.Think = item.skin_id.border_thickness;
    //   this.HeaderBorder = item.skin_id.border_color;
    //   this.HeaderLogo = item.skin_id.team_image_align;
    //   this.HeaderTextImg = item.skin_id.team_image;
    // } 
    // else if (item.alert_type === 'TickerAlert') {
    // }
  }

}