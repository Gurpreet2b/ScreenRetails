import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as xlsx from 'xlsx';
const Excel_Extension = '.xlsx';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public loading = false;
  public isLastAlerts = false;
  public isEmergencyAlert = false;
  public isCreateAlert = false;
  public isUserDetails = false;
  public isUserStatistics = false;
  public isAlertDetails = false;
  public isSurveyDetails = false;
  public isClientVersion = false;
  public UserList: any;
  public AlertList: any;
  public SurveyList: any;
  public PageJump: any = 10;
  public PageTotalNumber: any = [];
  loading_userDetails: boolean;
  loading_AlertDetails: boolean;
  loading_SurveyDetails: boolean;
  loading_LastAlert: boolean;
  // public currentPage: number = 1;
  // public totalItems: number | undefined;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    // translate.addLangs(['en', 'ar']);
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`DASHBOARD`);
    this.isLastAlerts = JSON.parse(localStorage.getItem('LastAlert'));
    if (this.isLastAlerts === true) {
      this.GetSentList(1);
    }
    this.isEmergencyAlert = JSON.parse(localStorage.getItem('EmergencyAlert'));
    this.isCreateAlert = JSON.parse(localStorage.getItem('CreateAlert'));
    this.isUserDetails = JSON.parse(localStorage.getItem('UserDetails'));
    if (this.isUserDetails === true) {
      this.GetUserList(1);
    }
    this.isUserStatistics = JSON.parse(localStorage.getItem('UserStatistics'));
    if (this.isUserStatistics === true) {
      this.GetUserStats();
    }
    this.isAlertDetails = JSON.parse(localStorage.getItem('AlertDetails'));
    if (this.isAlertDetails === true) {
      this.GetAlertList(1);
    }
    this.isSurveyDetails = JSON.parse(localStorage.getItem('SurveyDetails'));
    if (this.isSurveyDetails === true) {
      this.GetSurveyList(1);
    }
    this.isClientVersion = JSON.parse(localStorage.getItem('ClientVersion'));
    if (this.isClientVersion === true) {
      this.GetClientStats();
    }
  }

  public UserStats: any = [];
  public IsWidget = false
  AddWidget() {
    this.IsWidget = true;
  }

  lastAlert() {
    this.isLastAlerts = true;
    this.IsWidget = false;
    localStorage.setItem("LastAlert", JSON.stringify(this.isLastAlerts));
    this.GetSentList(1);
  }

  emergencyAlert() {
    this.isEmergencyAlert = true;
    this.IsWidget = false;
    localStorage.setItem("EmergencyAlert", JSON.stringify(this.isEmergencyAlert));
  }

  createAlert() {
    this.isCreateAlert = true;
    this.IsWidget = false;
    localStorage.setItem("CreateAlert", JSON.stringify(this.isCreateAlert));
  }

  userDetails() {
    this.isUserDetails = true;
    this.IsWidget = false;
    this.GetUserList(1);
    localStorage.setItem("UserDetails", JSON.stringify(this.isUserDetails));
  }

  userStatistics() {
    this.isUserStatistics = true;
    this.IsWidget = false;
    this.GetUserStats();
    localStorage.setItem("UserStatistics", JSON.stringify(this.isUserStatistics));
  }

  alertDetails() {
    this.isAlertDetails = true;
    this.IsWidget = false;
    this.GetAlertList(1);
    localStorage.setItem("AlertDetails", JSON.stringify(this.isAlertDetails));
  }

  surveyDetails() {
    this.isSurveyDetails = true;
    this.IsWidget = false;
    this.GetSurveyList(1);
    localStorage.setItem("SurveyDetails", JSON.stringify(this.isSurveyDetails));
  }

  clientVersions() {
    this.isClientVersion = true;
    this.IsWidget = false;
    this.GetClientStats();
    localStorage.setItem("ClientVersion", JSON.stringify(this.isClientVersion));
  }

  lastButton() {
    this.isLastAlerts = false;
    localStorage.setItem("LastAlert", JSON.stringify(this.isLastAlerts));
  }

  userButton() {
    this.isUserDetails = false;
    localStorage.setItem("UserDetails", JSON.stringify(this.isUserDetails));
  }

  alertButton() {
    this.isAlertDetails = false;
    localStorage.setItem("AlertDetails", JSON.stringify(this.isAlertDetails));
  }

  surveyButton() {
    this.isSurveyDetails = false;
    localStorage.setItem("SurveyDetails", JSON.stringify(this.isSurveyDetails));
  }

  emergencyButton() {
    this.isEmergencyAlert = false;
    localStorage.setItem("EmergencyAlert", JSON.stringify(this.isEmergencyAlert));
  }

  createButton() {
    this.isCreateAlert = false;
    localStorage.setItem("CreateAlert", JSON.stringify(this.isCreateAlert));
  }

  statisticsButton() {
    this.isUserStatistics = false;
    localStorage.setItem("UserStatistics", JSON.stringify(this.isUserStatistics));
  }

  clientButton() {
    this.isClientVersion = false;
    localStorage.setItem("ClientVersion", JSON.stringify(this.isClientVersion));

  }

  //Aelrt Details Api

  formAlert = new FormGroup({
    search: new FormControl(''),
  });
  onSearchAlertDetail(formValue: any) {
    this.GetAlertList(1);
    this.currentPage = 1;
  }

  GetAlertList(page: number) {
    this.loading_AlertDetails = true;
    const formData = new FormData();
    const formValue = this.formAlert.value;
    const search = formValue.search || '';
    this.http.get(`alerts_database/alerts_dashboard_widget_list/?page=${page}&search=${search}`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.AlertList = res.data;
        this.totalItems = responseData.count;
        this.loading_AlertDetails = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading_AlertDetails = false;
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

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  onPageChange(event: any, data: any) {
    if (data === '1') {
      this.currentPage = event;
      this.GetAlertList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetAlertList(this.currentPage)
    }
  }

  // Survey Details api

  public PageTotalNumberSurveyDetail: any = [];
  public currentPageSurveyDetail: number = 1;
  public totalItemsSurveyDetail: number | undefined;

  formSurveyDetail = new FormGroup({
    search: new FormControl(''),
  });
  onSearchSurveyDetail(formValue: any) {
    this.GetSurveyList(1)
    this.currentPageSurveyDetail = 1;
  }

  GetSurveyList(page: number) {
    this.loading_SurveyDetails = true;
    const formData = new FormData();
    const formValue = this.formSurveyDetail.value;
    const search = formValue.search || '';
    this.http.get(`alerts_database/survey_dashboard_widget_list/?page=${page}&search=${search}`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.SurveyList = res.data;
        this.totalItemsSurveyDetail = responseData.count;
        this.loading_SurveyDetails = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading_SurveyDetails = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberSurveyDetail = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJump) {
        this.PageTotalNumberSurveyDetail.push(i);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }


  currentPage: number = 1;
  totalItems: number | undefined;
  onPageChangeSurveyDetail(event: any, data: any) {
    if (data === '1') {
      this.currentPageSurveyDetail = event;
      this.GetSurveyList(event)
    } else {
      this.currentPageSurveyDetail = Number(event.target.value);
      this.GetSurveyList(this.currentPageSurveyDetail)
    }
  }

  // UserStats Chart Functionality
  GetUserStats() {
    this.loading = true;
    this.UserStats = [];
    this.http.get(`alerts_database/user_stats/`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        let UserStats = res.data;
        this.UserStats = [
          { name: "Online", value: UserStats.online_users },
          { name: "Offline", value: UserStats.offline_users },
          { name: "Never Connected", value: UserStats.never_connected },
          { name: "Unknown Users", value: UserStats.unknown_users },
        ];
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

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  // ClientStats Chart Functionality
  clientStats: any = [];
  clientStatss: any = [];
  NotInstalled: any = [];

  GetClientStats() {
    this.loading = true;
    // this.isClientVersion = false;
    this.clientStats = [];
    this.clientStatss = [];
    this.http.get(`users/client_version_list/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.NotInstalled = res.data;
        for (let i = 0; i < this.NotInstalled.length; i++) {
          const element = this.NotInstalled[i];
          this.clientStatss.push({ name: String(element.name), value: Number(element.count) });
        }
        this.clientStats = this.clientStatss;
        // this.clientStats = [
        //   { name: this.NotInstalled[0].name, value: this.NotInstalled[0].count },
        // ];

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

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }


  // Last Alert Stats All function Start Like: List, Perview and reports etc

  @ViewChild('PopupAlertepltable', { static: false })
  PopupAlertepltable!: ElementRef;
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

  public AddNewRow: any = [];
  public IsQuiz: any;
  public show: any = 0;
  public showChart: any = 0;
  // public LastIndex: any = false;
  public AlertTypeLast: any;

  form = new FormGroup({
    search: new FormControl(''),
  });
  formRSVP = new FormGroup({
    search: new FormControl(''),
  });

  onSearch(formValue: any) {
    this.GetSentList(1);
    this.currentPageLastAlert = 1;
  }

  onSearchRSVP(formValue: any) {
    this.GetChartList(1);
  }

  OnLastAlertChange(event: any) {
    this.AlertTypeLast = event.target.value;
    this.GetSentList(1);
    this.currentPageLastAlert = 1;
  }

  PageTotalNumberLastAlert: any = [];
  GetSentList(page: number) {
    this.loading_LastAlert = true;
    const formData = new FormData();
    const formValue = this.form.value;
    const search = formValue.search || '';
    // formData.append('search', search);
    // formData.append('alert_type', this.AlertTypeLast);

    this.http.get(`alerts_database/dashboard_list/?page=${page}&search=${search}&alert_type=${this.AlertTypeLast}`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.SentList = res.data;
        this.totalItemsLastAlert = responseData.count;
        this.loading_LastAlert = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading_LastAlert = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberLastAlert = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJump) {
        this.PageTotalNumberLastAlert.push(i);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  currentPageLastAlert: number = 1;
  totalItemsLastAlert: number | undefined;
  onPageChangeLastAlert(event: any, data: any) {
    if (data === '1') {
      this.currentPageLastAlert = event;
      this.GetSentList(event)
    } else {
      this.currentPageLastAlert = Number(event.target.value);
      this.GetSentList(this.currentPageLastAlert)
    }
  }

  // Skin List By Id Data
  GetSkinListById(item: any) {
    if (item.alert_type === 'PopupAlert') {
      this.AlertType = item.alert_type;
      this.TextTitle = item.popup_alert.name;
      this.TextBody = item.popup_alert.body_text
      this.Think = item.popup_alert.skin.border_thickness;
      this.HeaderBorder = item.popup_alert.skin.border_color;
      this.HeaderLogo = item.popup_alert.skin.team_image_align;
      this.HeaderTextImg = item.popup_alert.skin.team_image;
      this.FooterLogo = item.popup_alert.skin.footer_align;
      this.FooterBgColor = item.popup_alert.skin.footer_background_color;
      this.footerColor = item.popup_alert.skin.footer_text_color;
      this.FooterFontSize = item.popup_alert.skin.footer_font_size;
      this.FooterText = item.popup_alert.skin.footer_text;
      this.acknowledgementRequired = item.popup_alert.acknowledgement_required;
      this.AddPrint = item.popup_alert.add_print_button;
      this.AllowFeedback = item.popup_alert.allow_feedback;
    } else if (item.alert_type === 'TickerAlert') {
      this.AlertType = item.alert_type;
      this.TextTitle = item.ticker_alert.name;
      this.TextBody = item.ticker_alert.body_text
      this.Think = item.ticker_alert.skin.border_thickness;
      this.HeaderBorder = item.ticker_alert.skin.border_color;
      this.HeaderTextImg = item.ticker_alert.skin.team_image;
    } else if (item.alert_type === 'SurveyAlert') {
      this.TextTitle = item.name;
      this.Think = item.survey_alert.skin.border_thickness;
      this.HeaderBorder = item.survey_alert.skin.border_color;
      this.HeaderLogo = item.survey_alert.skin.team_image_align;
      this.HeaderTextImg = item.survey_alert.skin.team_image;
      this.FooterLogo = item.survey_alert.skin.footer_align;
      this.FooterBgColor = item.survey_alert.skin.footer_background_color;
      this.footerColor = item.survey_alert.skin.footer_text_color;
      this.FooterFontSize = item.survey_alert.skin.footer_font_size;
      this.FooterText = item.survey_alert.skin.footer_text;
      this.AddNewRow = JSON.parse(item.survey_alert.questions);
      this.AddNewRow.splice(this.AddNewRow.length - 1, 1);
      this.show = 0;
    }
  }

  //ngx-chart bar vertical and Chart list with api's

  IsChartAndList: any = false;
  AlertID: any;
  AlertName: any = ''
  GetGraphStats(data: any, item: any) {
    this.AlertID = data.id;
    this.AlertName = data.name;
    // this.IsQuiz = item.type;
    this.loading = true;
    this.IsChartAndList = false;
    this.saleData = [];
    this.PieChartData = [];
    this.RSVPChartData = [];
    this.showChart = 0;
    // this.LastIndex = false;
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

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
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

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
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

  // ExportToExcel() {
  //   const ws: xlsx.WorkSheet =
  //     xlsx.utils.table_to_sheet(this.PopupAlertepltable.nativeElement);
  //   const wb: xlsx.WorkBook = xlsx.utils.book_new();
  //   xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
  //   xlsx.writeFile(wb, 'AlertDetail.xlsx' + new Date().getTime() + Excel_Extension);
  // }

  // status: any[];
  // downloadCSV() {
  //   this.status = ["approved", "rejected", "pending"];
  //   var data = [
  //     {
  //       name: "Test 1",
  //       age: 13,
  //       average: 8.2,
  //       status: this.status[0],
  //       description: "Kuala Lmpuer, Malaysia"
  //     },
  //     {
  //       name: 'Test 2',
  //       age: 11,
  //       average: 8.2,
  //       status: this.status[1],
  //       description: "Jakarta, Indonesia"
  //     },
  //     {
  //       name: 'Test 3',
  //       age: 10,
  //       average: 8.2,
  //       status: this.status[2],
  //       description: "Bangkok, Thailand"
  //     },
  //   ];

  //   var options = {
  //     title: 'User Details',
  //     fieldSeparator: ',',
  //     quoteStrings: '"',
  //     decimalseparator: '.',
  //     showLabels: true,
  //     showTitle: true,
  //     useBom: true,
  //     headers: ['Name', 'Age', 'Average', 'Status', 'Address']
  //   };

  //   new AngularCsv(data, 'AlertDetail', options);
  // }

  // Last Alert Survey reports Functionality Start 

  OnNextSubmit(index: any, lastIndex: any) {
    this.show = index + 1;
    if (lastIndex === true) {
      this.AddNewRow.push({
        'rowAns': [{ answer1: '', Url: '', selectedVal: false }], 'question': '', 'choice': 'Submitted', 'answer': '', 'intermAnswer': '',
        minNumber: '', minLabel: '', maxNumber: '', maxLabel: '', intermUrl: '', UrlQuestion: ''
      });
    }
  }

  formSurveyChart = new FormGroup({
    search: new FormControl(''),
  });

  IsChartAndListSurvey: any = false;
  AlertIDSurvey: any;
  public TotalQuestionList: any = 0;
  GetGraphStatsSurvey(id: any, item: any) {
    this.AlertIDSurvey = id;
    this.IsQuiz = item.type;
    this.AlertName = item.name;
    this.loading = true;
    this.IsChartAndListSurvey = false;
    this.saleData = [];
    this.PieChartData = [];
    this.RSVPChartData = [];
    this.showChart = 0;
    // this.LastIndex = false;
    this.formSurveyChart.value.search = '';
    this.formSurveyChart.setValue({
      search: '',
    })
    this.http.get(`alerts_database/${id}/alert_stats/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.TotalRecipients = res.data.total_recipients;
        this.Sent = res.data.sent;
        this.Displayed = res.data.displayed;
        this.Recieved = res.data.recieved;
        this.NotRecieved = res.data.not_recieved;
        this.Voted = res.data.voted;
        this.RecievedNotVoted = res.data.displayed_but_not_voted;
        this.TotalQuestionList = res.data.question_list;
        this.TotalQuestion = res.data.total_question

        let TotalAnswerList = res.data.question_list[0].options
        for (let i = 0; i < TotalAnswerList.length; i++) {
          const element = TotalAnswerList[i];
          this.PieChartData.push({ name: element.option_text, value: element.count, optionId: element.option_id, option_image: element.option_image });
        }

        this.RSVPChartData = [
          { name: "Sent", value: this.Sent },
          { name: "Recieved", value: this.Recieved },
          { name: "Displayed", value: this.Displayed },
          { name: "NotRecieved", value: this.NotRecieved },
          { name: "Voted", value: this.Voted },
          { name: "Received, but not voted", value: this.RecievedNotVoted },
        ];
        this.authService.setCurrentUser({ token: res.token });
        // this.PieChartData = [
        //   { name: "Yes", value: 5 },
        //   { name: "No", value: 10 },
        // ];
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

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  OnNextChartSubmit(index: any, item: any, firstIndex: any) {
    if (item === 'Next') {
      this.showChart = index + 1;
    } else {
      if (firstIndex) {
        return
      } else {
        this.showChart = index - 1;
        index = this.showChart
      }
    }
    if (index + 1 === this.TotalQuestionList.length) {
      this.showChart = index;
      return
    } else {
      let TotalAnswerList = this.TotalQuestionList[this.showChart].options
      this.PieChartData = [];
      for (let i = 0; i < TotalAnswerList.length; i++) {
        const element = TotalAnswerList[i];
        this.PieChartData.push({ name: element.option_text, value: element.count, optionId: element.option_id, option_image: element.option_image });
      }
    }
  }

  OnChangeChartAndListSurvey(item: any, variable: any) {
    if (item === 'chart') {
      this.IsChartAndListSurvey = false;
    } else if (item === 'list') {
      this.VariableDataSurvey = variable;
      this.IsChartAndListSurvey = true;
      this.currentPageChart = 1;
      this.GetChartListSurvey(1);
    }
  }

  SurveyPieChartAns(question: any, answer: any, variable: any) {
    this.QuestionData = question;
    this.AnswerData = answer.optionId;
    this.VariableDataSurvey = variable;
    this.IsChartAndListSurvey = true;
    this.currentPageChart = 1;
    this.GetChartListSurvey(1);
  }

  onSearchSurveyChart(formValue: any) {
    this.GetChartListSurvey(1);
  }

  QuestionData: any = '';
  AnswerData: any = '';
  PageJumpChartSurvey: any = 10;
  PageTotalNumberChartSurvey: any = [];
  AlertDetailListSurvey: any = []
  VariableDataSurvey: any = 'total_recipients_list';
  GetChartListSurvey(page: number) {
    this.loading = true;
    const formData = new FormData();
    formData.append('question_text', this.QuestionData);
    formData.append('option_id', this.AnswerData);
    const formValue = this.formSurveyChart.value;
    const search = formValue.search || '';
    formData.append('search', search);

    this.http.post(`alerts_database/${this.AlertIDSurvey}/${this.VariableDataSurvey}/?page=${page}`, formData).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.AlertDetailListSurvey = res.data;
        this.totalItemsChartSurvey = res.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberChartSurvey = [];
      let Count = res.count / 10;
      for (let i = 0; i < Count; i += this.PageJumpChartSurvey) {
        this.PageTotalNumberChartSurvey.push(i);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  currentPageChartSurvey: number = 1;
  totalItemsChartSurvey: number | undefined;
  onPageChartChangeSurvey(event: any, data: any) {
    if (data === '1') {
      this.currentPageChartSurvey = event;
      this.GetChartListSurvey(event)
    } else {
      this.currentPageChartSurvey = Number(event.target.value);
      this.GetChartListSurvey(this.currentPageChartSurvey)
    }
  }

  QuizList: any = [];
  IsQuizList(item: any) {
    this.QuizList = item.selected_answers
  }
  // Last Alert Survey reports Functionality End

  // Last Alert Stats All function End Like: List, Perview and reports etc 

  // User Details Alert All function Start
  public PageJumpUser: any = 10;
  public PageTotalNumberUserDetail: any = [];
  public currentPageUserDetail: number = 1;
  public totalItemsUserDetail: number | undefined;
  public IsUserDetailChartAndList = false;
  public saleUserDetailData: any = [];
  public PageJumpUserChart: any = 10;
  public PageTotalNumberUserChart: any = [];
  public UserChartListDetailList: any = []
  public VariableUserData: any = 'total_recipients_list';
  public UserID: any;

  formUser = new FormGroup({
    search: new FormControl(''),
  });
  onSearchUser(formValue: any) {
    this.GetUserList(1)
    this.currentPageUserDetail = 1;
  }

  GetUserList(page: number) {
    this.loading_userDetails = true;
    const formData = new FormData();
    const formValue = this.formUser.value;
    const search = formValue.search || '';
    formData.append('search', search);
    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`users/dashboard_list/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.UserList = res.data;
        this.totalItemsUserDetail = responseData.count;
        this.loading_userDetails = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading_userDetails = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberUserDetail = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJumpUser) {
        this.PageTotalNumberUserDetail.push(i);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  onPageChangeUserDetails(event: any, data: any) {
    if (data === '1') {
      this.currentPageUserDetail = event;
      this.GetUserList(event)
    } else {
      this.currentPageUserDetail = Number(event.target.value);
      this.GetUserList(this.currentPageUserDetail)
    }
  }

  UserName: any = '';
  IsUserDetailById(data: any) {
    this.UserID = data.id;
    this.UserName = data.username;
    this.loading = true;
    this.IsUserDetailChartAndList = false;
    this.saleUserDetailData = [];
    this.http.post(`users/${data.id}/user_details_dashboard/`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.Recieved = res.data.recieved_alerts;
        this.NotRecieved = res.data.not_recieved_alerts;
        this.Acknowledged = res.data.acknowledged_alerts;
        this.TotalRecipients = res.data.total_alerts;
        this.saleUserDetailData = [
          { name: "Recieved", value: this.Recieved },
          { name: "NotRecieved", value: this.NotRecieved },
          { name: "Acknowledged", value: this.Acknowledged },

        ];
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

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  OnChangeUserDetailChartAndList(item: any, variable: any) {
    if (item === 'chart') {
      this.IsUserDetailChartAndList = false;
    } else if (item === 'list') {
      this.VariableUserData = variable;
      this.IsUserDetailChartAndList = true;
      this.currentPageUserChart = 1;
      this.GetUserDetailChartList(1);
    }
  }

  formUserDetail = new FormGroup({
    search: new FormControl(''),
  });
  onSearchUserDetail(formValue: any) {
    this.currentPageUserChart = 1;
    this.GetUserDetailChartList(1)
  }

  GetUserDetailChartList(page: number) {
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formUserDetail.value;
    const search = formValue.search || '';
    // formData.append('search', search);
    this.http.post(`users/${this.UserID}/${this.VariableUserData}/?page=${page}&search=${search}`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.UserChartListDetailList = res.data;
        this.totalItemsUserChart = res.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberUserChart = [];
      let Count = res.count / 10;
      for (let i = 0; i < Count; i += this.PageJumpUserChart) {
        this.PageTotalNumberUserChart.push(i);
      }
    }, error => {
      this.loading = false;
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;

      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  currentPageUserChart: number = 1;
  totalItemsUserChart: number | undefined;
  onPageUserChartChange(event: any, data: any) {
    if (data === '1') {
      this.currentPageUserChart = event;
      this.GetUserDetailChartList(event)
    } else {
      this.currentPageUserChart = Number(event.target.value);
      this.GetUserDetailChartList(this.currentPageUserChart)
    }
  }

}