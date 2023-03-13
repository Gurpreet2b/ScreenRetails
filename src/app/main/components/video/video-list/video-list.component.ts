import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as xlsx from 'xlsx';
const Excel_Extension = '.xlsx';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-video-list',
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.css'],
})
export class VideoListComponent implements OnInit {
  @ViewChild('PopupAlertepltable', { static: false })
  PopupAlertepltable!: ElementRef;

  public loading = false;
  public VideoList: any;
  public AlertType: any;
  public HeaderBorder: any = '#00838f';
  public TextTitle: any = '';
  public TextBody: any = '';
  public Think: any = 5;
  public HeaderTextImg: any = '/assets/img/logo.png';
  public HeaderLogo: any = 'left';
  public FooterLogo: any = 'left';
  public FooterBgColor: any;
  public footerColor: any;
  public FooterFontSize: any;
  public FooterText: any = '';
  public Permission: any = [];
  public RoleAssign: any = [];
  public RoleName: any;
  public DateTimePopup = new Date();
  public VideoUrl: any = '';
  public IframeUrl: any;

  public acknowledgementRequired: any;
  public Sent: any = 0;
  public Recieved: any = 0;
  public Displayed: any = 0;
  public Liked: any = 0;
  public TotalRecipients: any = 0;
  public Acknowledged: any = 0;
  public NotRecieved: any = 0;
  public saleData: any = [];
  public PieChartData: any = [];
  public RSVPChartData: any = [];

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Video List`);
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.RoleName = this.Permission.role;
    this.GetVideoList(1);
  }

  dateformat(datas: string) {
    return this.authService.Dateformat(datas);
  }

  Timeformat(time: string) {
    return this.authService.Timeformat(time);
  }

  form = new FormGroup({
    search: new FormControl(''),
  });

  onSearch(formValue: any) {
    this.GetVideoList(1);
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetVideoList(page: number) {
    this.loading = true;
    const formData = new FormData();
    const formValue = this.form.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`alerts_database/video_alert_list/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.VideoList = res.data;
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
      this.GetVideoList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetVideoList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteAlert(id);
    }
  }
  onDeleteAlert(id: number) {
    this.loading = true;
    this.http.delete(`alerts_database/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Alerts Deleted Successfully");
        this.GetVideoList(this.currentPage);
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

    this.http.post(`alerts_database/${id}/resume_alert/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('Started Alert Successfully !!');
        this.GetVideoList(1);
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

    this.http.post(`alerts_database/${id}/stop_alert/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('Stopped Alert Successfully !!');
        this.GetVideoList(1);
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

  // Skin List By Id Data
  GetSkinListById(item: any) {
    if (item.alert_type === 'VideoAlert') {
      this.AlertType = item.alert_type;
      this.TextTitle = item.video_alert.name;
      this.VideoUrl = item.video_alert.video_url;
      this.IframeUrl = item.video_alert.i_frame;
      //   document.getElementById("body-video").innerHTML = `<video width="440" height="240" controls="hidden" autoplay loop muted>
      //   <source src="${this.VideoUrl}" type="video/mp4">
      // </video>`;
      if (this.IframeUrl === '' || this.IframeUrl === null) {
        document.getElementById("body-video").innerHTML = `<video width="440" height="240" controls="hidden" autoplay loop muted>
      <source src="${this.VideoUrl}" type="video/mp4"></video>`;
      } else {
        document.getElementById("body-video").innerHTML = `<iframe src="${this.IframeUrl}" width="440" height="240" title="Iframe"></iframe>`;
      }
      this.TextBody = item.video_alert.body_text;
      this.Think = item.video_alert.skin.border_thickness;
      this.HeaderBorder = item.video_alert.skin.border_color;
      this.HeaderLogo = item.video_alert.skin.team_image_align;
      this.HeaderTextImg = item.video_alert.skin.team_image;
      this.FooterLogo = item.video_alert.skin.footer_align;
      this.FooterBgColor = item.video_alert.skin.footer_background_color;
      this.footerColor = item.video_alert.skin.footer_text_color;
      this.FooterFontSize = item.video_alert.skin.footer_font_size;
      this.FooterText = item.video_alert.skin.footer_text;
      this.acknowledgementRequired = item.video_alert.acknowledgement_required;
    }
  }

  //ngx-chart bar vertical and Chart list with api's
  IsChartAndList: any = false;
  AlertID: any;
  GetGraphStats(id: any, item: any) {
    this.AlertID = id;
    this.loading = true;
    this.IsChartAndList = false;
    this.saleData = [];
    this.PieChartData = [];

    this.http.get(`alerts_database/${id}/alert_stats/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.TotalRecipients = res.data.total_recipients;
        this.authService.setCurrentUser({ token: res.token });
        if (item === 'alert') {
          this.Sent = res.data.sent;
          this.Recieved = res.data.recieved;
          this.Displayed = res.data.displayed;
          this.Acknowledged = res.data.acknowledged;
          this.NotRecieved = res.data.not_recieved;
          this.Liked = res.data.liked;
          this.saleData = [
            { name: `Sent`, value: this.Sent },
            { name: "Recieved", value: this.Recieved },
            { name: "Displayed", value: this.Displayed },
            { name: "NotRecieved", value: this.NotRecieved },
            { name: "Acknowledged", value: this.Acknowledged },
            { name: "Liked", value: this.Liked },

          ];
        }
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

  OnChangeChartAndList(item: any, variable: any) {
    if (item === 'chart') {
      this.IsChartAndList = false;
    } else if (item === 'list') {
      this.VariableData = variable;
      this.IsChartAndList = true;
      this.currentPageChart = 1;
      this.GetChartList(1);
    }
  }

  formRSVP = new FormGroup({
    search: new FormControl(''),
  });

  onSearchRSVP(formValue: any) {
    this.GetChartList(1);
  }

  PageJumpChart: any = 10;
  PageTotalNumberChart: any = [];
  AlertDetailList: any = []
  VariableData: any = 'total_recipients_list';
  GetChartList(page: number) {
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formRSVP.value;
    const search = formValue.search || '';
    formData.append('search', search);
    this.http.post(`alerts_database/${this.AlertID}/${this.VariableData}/?page=${page}`, formData).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.AlertDetailList = res.data;
        this.totalItemsChart = res.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberChart = [];
      let Count = res.count / 10;
      for (let i = 0; i < Count; i += this.PageJumpChart) {
        this.PageTotalNumberChart.push(i);
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

  currentPageChart: number = 1;
  totalItemsChart: number | undefined;
  onPageChartChange(event: any, data: any) {
    if (data === '1') {
      this.currentPageChart = event;
      this.GetChartList(event)
    } else {
      this.currentPageChart = Number(event.target.value);
      this.GetChartList(this.currentPageChart)
    }
  }

  ExportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.PopupAlertepltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'AlertDetail.xlsx' + new Date().getTime() + Excel_Extension);
  }

  status: any[];
  downloadCSV() {
    this.status = ["approved", "rejected", "pending"];
    var data = [
      {
        name: "Test 1",
        age: 13,
        average: 8.2,
        status: this.status[0],
        description: "Kuala Lmpuer, Malaysia"
      },
      {
        name: 'Test 2',
        age: 11,
        average: 8.2,
        status: this.status[1],
        description: "Jakarta, Indonesia"
      },
      {
        name: 'Test 3',
        age: 10,
        average: 8.2,
        status: this.status[2],
        description: "Bangkok, Thailand"
      },
    ];

    var options = {
      title: 'User Details',
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: ['Name', 'Age', 'Average', 'Status', 'Address']
    };

    new AngularCsv(data, 'AlertDetail', options);
  }

}