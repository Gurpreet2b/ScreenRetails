import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as xlsx from 'xlsx';
const Excel_Extension = '.xlsx';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-schedule-alert',
  templateUrl: './schedule-alert.component.html',
  styleUrls: ['./schedule-alert.component.css'],
})
export class ScheduleAlertComponent implements OnInit {
  @ViewChild('PopupAlertepltable', { static: false })
  PopupAlertepltable!: ElementRef;

  @ViewChild('RSVPAlertepltable', { static: false })
  RSVPAlertepltable!: ElementRef;

  public loading = false;
  public SentList: any = [];
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
  public acknowledgementRequired: any;
  public AddPrint: any;
  public AllowFeedback: any;
  public Sent: any = 0;
  public Recieved: any = 0;
  public Displayed: any = 0;
  public Liked: any = 0;
  public TotalRecipients: any = 0;
  public Acknowledged: any = 0;
  public NotRecieved: any = 0;
  public DateTimePopup = new Date();

  public Voted: any = 0;
  public RecievedNotVoted: any = 0;

  public Option1Count: any = 0;
  public Option1Name: any = 0;
  public Option2Count: any = 0;
  public Option2Name: any = 0;
  public QuestionText: any = '';
  public TotalQuestion: any = 0;

  public saleData: any = [];
  public PieChartData: any = [];
  public RSVPChartData: any = [];

  public Permission: any = [];
  public RoleAssign: any = [];
  public RoleName: any;
  public filterType: any = 'all';
  public AlertId: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Schedule Alerts`);
    this.AlertId = this.activeRoute.snapshot.params['id'] || 0;
    this.GetScheduleAlertList(1);
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.RoleName = this.Permission.role;
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
  formRSVP = new FormGroup({
    search: new FormControl(''),
  });

  onSearch(formValue: any) {
    this.GetScheduleAlertList(1);
    this.currentPage = 1;
  }

  onSearchRSVP(formValue: any) {
    this.GetChartList(1);
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetScheduleAlertList(page: number) {
    this.loading = true;
    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`alerts_database/scheduled_alerts/?parent=${this.AlertId}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.SentList = res.data;
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
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
        
      } else if(error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if(error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if(error.status === 404) {
        this.toastr.error("Server not Found");
      } else if(error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  currentPage: number = 1;
  totalItems: number | undefined;
  onPageChange(event: any, data: any) {
    if (data === '1') {
      this.currentPage = event;
      this.GetScheduleAlertList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetScheduleAlertList(this.currentPage)
    }
  }

  IsResumeAlert(id: any) {
    this.loading = true;

    this.http.post(`alerts_database/${id}/resume_alert/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('Started Alert Successfully !!');
        this.GetScheduleAlertList(1);
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
        
      } else if(error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if(error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if(error.status === 404) {
        this.toastr.error("Server not Found");
      } else if(error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  IsStoppedAlert(id: any) {
    this.loading = true;

    this.http.post(`alerts_database/${id}/stop_alert/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('Stopped Alert Successfully !!');
        this.GetScheduleAlertList(1);
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
        
      } else if(error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if(error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if(error.status === 404) {
        this.toastr.error("Server not Found");
      } else if(error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  public HeaderTitle: any = '';
  public HeaderFontSize: any = '';
  public HeaderBgColor: any = '';
  public AlertBgColor: any = '';

  public FooterImageUrl: any = '/assets/img/dewa-lines.png';

  // Skin List By Id Data
  GetSkinListById(item: any) {
    if (item.alert_type === 'PopupAlert') {
      this.AlertType = item.alert_type;
      this.TextTitle = item.popup_alert.name;
      this.TextBody = item.popup_alert.body_text
      this.Think = item.skin_id.border_thickness;
      this.HeaderBorder = item.skin_id.border_color;
      this.HeaderLogo = item.skin_id.team_image_align;
      this.HeaderTextImg = item.skin_id.team_image;
      this.FooterLogo = item.skin_id.footer_align;
      this.FooterBgColor = item.skin_id.footer_background_color;
      this.footerColor = item.skin_id.footer_text_color;
      this.FooterFontSize = item.skin_id.footer_font_size;
      this.FooterText = item.skin_id.footer_text;
      this.acknowledgementRequired = item.popup_alert.acknowledgement_required;
      this.AddPrint = item.popup_alert.add_print_button;
      this.AllowFeedback = item.popup_alert.allow_feedback;

      this.AlertBgColor = item.skin_id.alert_background_color;
      this.HeaderBgColor = item.skin_id.header_background_color;
      this.HeaderTitle = item.skin_id.header_custom_message;
      this.HeaderFontSize = item.skin_id.header_custom_message_font_color;
      this.FooterImageUrl = item.skin_id.footer_background_image;


    } else if (item.alert_type === 'TickerAlert') {
      this.AlertType = item.alert_type;
      this.TextTitle = item.ticker_alert.name;
      this.TextBody = item.ticker_alert.body_text
      this.Think = item.skin_id.border_thickness;
      this.HeaderBorder = item.skin_id.border_color;
      this.HeaderTextImg = item.skin_id.team_image;
      this.AlertBgColor = item.skin_id.alert_background_color;
      this.HeaderBgColor = item.skin_id.header_background_color;
      this.HeaderTitle = item.skin_id.header_custom_message;
      this.HeaderFontSize = item.skin_id.header_custom_message_font_color;
      this.FooterImageUrl = item.skin_id.footer_background_image;
    }
  }

  //ngx-chart bar vertical and Chart list with api's

  IsChartAndList: any = false;
  AlertID: any;
  AlertName: any = '';
  GetGraphStats(data: any, item: any) {
    this.AlertID = data.id;
    this.AlertName = data.name;
    this.GetExportExcelAndCsv(data);
    this.loading = true;
    this.IsChartAndList = false;
    this.saleData = [];
    this.PieChartData = [];
    this.RSVPChartData = [];
    this.formRSVP.value.search = '';
    this.formRSVP.setValue({
      search: '',
    })
    this.http.get(`alerts_database/${data.id}/alert_stats/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.TotalRecipients = res.data.total_recipients;
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
        else if (item === 'RSVP') {
          this.GetRSVPQuesExportExcelAndCsv(data);
          this.Sent = res.data.sent;
          this.Displayed = res.data.displayed;
          this.Recieved = res.data.recieved;
          this.NotRecieved = res.data.not_recieved;
          this.Voted = res.data.voted;
          this.RecievedNotVoted = res.data.displayed_but_not_voted;
          this.Option1Count = res.data.option_1_count;
          this.Option1Name = res.data.option_1;
          this.Option2Count = res.data.option_2_count;
          this.Option2Name = res.data.option_2;
          this.QuestionText = res.data.question_1_text;
          this.TotalQuestion = res.data.total_question;
          this.RSVPChartData = [
            { name: "Sent", value: this.Sent },
            { name: "Recieved", value: this.Recieved },
            { name: "Displayed", value: this.Displayed },
            { name: "NotRecieved", value: this.NotRecieved },
            { name: "Voted", value: this.Voted },
            { name: "Received, but not voted", value: this.RecievedNotVoted },
          ];
          this.PieChartData = [
            { name: "Yes", value: this.Option1Count },
            { name: "No", value: this.Option2Count },
          ];
        }
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
        
      } else if(error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if(error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if(error.status === 404) {
        this.toastr.error("Server not Found");
      } else if(error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
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
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
        
      } else if(error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if(error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if(error.status === 404) {
        this.toastr.error("Server not Found");
      } else if(error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
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

  ExportExcelAndCsvList: any = [];
  ExportType: any;
  GetExportExcelAndCsv(item: any) {
    this.ExportType = item.alert_type;
    this.loading = true;
    this.http.get(`alerts_database/${item.id}/alerts_csv_excel/?alert_type=${item.alert_type}`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
        if (item.alert_type === 'RsvpAlert') {
          this.ExportExcelAndCsvList = [];
          this.ExportExcelAndCsvList.push(res.data)
        } else {
          this.ExportExcelAndCsvList = res.data;
        }
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
        
      } else if(error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if(error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if(error.status === 404) {
        this.toastr.error("Server not Found");
      } else if(error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  ExportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.PopupAlertepltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'AlertDetail.xlsx' + new Date().getTime() + Excel_Extension);
  }

  downloadCSV() {
    if (this.ExportType === 'RsvpAlert') {
      var options = {
        title: 'User Details',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Alert Title', 'Sent Date', 'Total', 'Recieved', 'NotRecieved', 'Voted', 'NotVoted', 'Sent', 'Displayed']
      };
    } else {
      var options = {
        title: 'User Details',
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        useBom: true,
        headers: ['Alert Title', 'Sent Date', 'UserName', 'Status']
      };
    }

    new AngularCsv(this.ExportExcelAndCsvList, 'AlertDetail', options);
  }

  RSVPQuesExportExcelAndCsvList: any = [];
  GetRSVPQuesExportExcelAndCsv(item: any) {
    this.loading = true;
    this.http.get(`alerts_database/${item.id}/rsvp_question_excel_csv/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.RSVPQuesExportExcelAndCsvList = res.data;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
        
      } else if(error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if(error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if(error.status === 404) {
        this.toastr.error("Server not Found");
      } else if(error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  RSVPExportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.RSVPAlertepltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'RSVPAlertDetail.xlsx' + new Date().getTime() + Excel_Extension);
  }

  RSVPdownloadCSV() {
    var options = {
      title: 'RSVP Alert Question Details',
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: ['Logon Name', 'Machine Name', 'Question 1', 'Answer', 'Question 2', 'Reason']
    };

    new AngularCsv(this.RSVPQuesExportExcelAndCsvList, 'RSVPAlertDetail', options);
  }

}