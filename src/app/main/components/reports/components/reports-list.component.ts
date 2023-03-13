import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import * as xlsx from 'xlsx';
const Excel_Extension = '.xlsx';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.css'],
})
export class ReportsListComponent implements OnInit {
  public loading = false;
  AlertList: any;
  submitted: true;
  ReportsId: any;
  userForm: any;
  UsersId: any;
  UsersList: any;
  SurveyId: any;
  SurveyList: any;
  ScreensaverId: any;
  ScreensaverList: any;
  locksceeenList: any;
  LockscreenId: any;
  public IsWidget = false;
  public isCreateAlert = false;
  public isUserDetails = false;
  public isUserStatistics = false;
  public isAlertDetails = false;
  public isSurveyDetails = false;
  public isClientVersion = false;
  public PageJump: any = 10;
  public PageTotalNumber: any = [];
  public currentPage: number = 1;
  public totalItems: number | undefined;
  public ScreenSaverAndOtherType: any = '';
  UserList: any;
  totalItemsUserDetail: any;
  PageTotalNumberUserDetail: any[];
  PageJumpUser: number;
  currentPageUserDetail: any;
  UserID: any;
  IsUserDetailChartAndList: boolean;
  saleUserDetailData: any[];
  Recieved: any;
  NotRecieved: any;
  Acknowledged: any;
  TotalRecipients: any;
  VariableUserData: any;
  // currentPageUserChart: number;
  UserChartListDetailList: any;
  // totalItemsUserChart: any;
  PageTotalNumberUserChart: any[];
  PageJumpUserChart: number;
  public UserStats: any = [];
  public UserLinks: any;
  AlertID: any;
  IsChartAndList: boolean;
  form: any;
  AlertReportList: any;
  currentPageChartUser: number;
  SurveysList: any = [];
  LockscreenList: any;
  UsersReportList: any;
  IsAlertDetailChartAndList: boolean;
  saleDataAlert: any[];
  saleAlertsData: any[];
  wallpaperId: any;
  like_count: any;
  Report: any;
  Add: any;
  NotAdd: any;
  NotLike: any;
  recieved: any;
  not_recieved: any;
  acknowledged: any;
  public currentURL: any;

  lockscreenId: any;
  LockscreenTitle: any;
  WallpaperList: any;
  loading_UserDetails: boolean;
  loading_AlertDetails: boolean;
  loading_SurveyDetails: boolean;
  // PopupAlertepltable: any;

  constructor(private http: HttpService,
    private toastr: ToastrService, private router: Router,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }


  ngOnInit(): void {
    this.authService.SetRestaurantName(`Reports`);
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

  dateformat(datas: string) {
    return this.authService.Dateformat(datas);
  }

  Timeformat(time: string) {
    return this.authService.Timeformat(time);
  }

  formRSVP = new FormGroup({
    search: new FormControl(''),
  });

  AddWidget() {
    this.IsWidget = true;
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

  clientVersions() {
    this.isClientVersion = true;
    this.IsWidget = false;
    this.GetClientStats();
    localStorage.setItem("ClientVersion", JSON.stringify(this.isClientVersion));
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


  userButton() {
    this.isUserDetails = false;
    localStorage.setItem(("UserDetails"), (JSON.stringify(this.isUserDetails)));
  }
  statisticsButton() {
    this.isUserStatistics = false;
    localStorage.setItem("UserStatistics", JSON.stringify(this.isUserStatistics));
  }

  clientButton() {
    this.isClientVersion = false;
    localStorage.setItem("ClientVersion", JSON.stringify(this.isClientVersion));

  }
  alertButton() {
    this.isAlertDetails = false;
    localStorage.setItem("AlertDetails", JSON.stringify(this.isAlertDetails));
  }
  surveyButton() {
    this.isSurveyDetails = false;
    localStorage.setItem("SurveyDetails", JSON.stringify(this.isSurveyDetails));
  }

  formUser = new FormGroup({
    search: new FormControl(''),
  });
  onSearchUser(formValue: any) {
    this.GetUserList(1);
    this.currentPageUserDetail = 1;
  }

  GetUserList(page: number) {
    this.loading_UserDetails = true;
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
        this.loading_UserDetails = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading_UserDetails = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberUserDetail = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJumpUser) {
        this.PageTotalNumberUserDetail.push(i);
      }
    }, error => {
      this.loading = false;
      this.loading_UserDetails = false;
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
  onPageChangeUserDetails(event: any, data: any) {
    if (data === '1') {
      this.currentPageUserDetail = event;
      this.GetUserList(event)
    } else {
      this.currentPageUserDetail = Number(event.target.value);
      this.GetUserList(this.currentPageUserDetail)
    }
  }

  UserAlertName: any = ''
  IsUserDetailById(data: any) {
    this.UserID = data.id;
    this.UserAlertName = data.username
    this.loading = true;
    this.IsUserDetailChartAndList = false;
    this.saleUserDetailData = [];
    this.wallpaperId = data.id;
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

  onSearchRSVPAlert(formValue: any) {
    this.GetChartList(1);
    this.currentPageChartAlerts = 1;
  }

  currentPageChartAlerts: number = 1;
  totalItemsChartAlerts: number | undefined;
  onPageChartChangeAlert(event: any, data: any) {
    if (data === '1') {
      this.currentPageChartAlerts = event;
      this.GetChartList(event)
    } else {
      this.currentPageChartAlerts = Number(event.target.value);
      this.GetChartList(this.currentPageChartAlerts)
    }
  }

  QuestionDatas: any = '';
  AnswerDatas: any = '';
  PageJumpChartAlert: any = 10;
  PageTotalNumberChartAlert: any = [];
  AlertDetailsList: any = []
  VariableDataAlert: any = 'total_recipients_list';

  IsAlertDetailByIds(id: any, page: number) {
    this.UserID = id;
    this.loading = true;
    this.IsAlertDetailChartAndList = false;
    this.saleAlertsData = [];
    this.wallpaperId = id;
    const formData = new FormData();
    formData.append('question_text', this.QuestionData);
    formData.append('option_id', this.AnswerData);
    this.http.post(`alerts_database/${this.AlertID}/${this.VariableDataAlert}/?page=${page}`, formData).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.AlertDetailsList = res.data;
        this.Recieved = res.data.recieved_alerts;
        this.NotRecieved = res.data.not_recieved_alerts;
        this.Acknowledged = res.data.acknowledged_alerts;
        this.TotalRecipients = res.data.total_alerts;
        this.saleAlertsData = [
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
  OnChangeAlertDetailChartAndList(item: any, variable: any) {
    if (item === 'chart') {
      this.IsUserDetailChartAndList = false;
    } else if (item === 'list') {
      this.VariableUserData = variable;
      this.IsUserDetailChartAndList = true;
      this.currentPageUserChart = 1;
      this.GetChartList(1);
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


  //Sent

  onSearch(formValue: any) {
    this.GetSentList(1);
    this.currentPageLastAlert = 1;
  }

  PageTotalNumberLastAlert: any = [];
  GetSentList(page: number) {
    this.loading = true;
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
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
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

  ///
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


  //UserStatistics

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


  //ClientVersion

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
        this.authService.setCurrentUser({ token: res.token });
        this.NotInstalled = res.data
        for (let i = 0; i <  this.NotInstalled.length; i++) {
          const element =  this.NotInstalled[i];
          this.clientStatss.push({name: String(element.name), value: Number(element.count)});
        }
        this.clientStats = this.clientStatss;

        // this.clientStats = [
        //   { name: this.NotInstalled[0].name, value: this.NotInstalled[0].count },
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
  // public Recieved: any = 0;
  public Displayed: any = 0;
  public Liked: any = 0;
  // public TotalRecipients: any = 0;
  // public Acknowledged: any = 0;
  // public NotRecieved: any = 0;
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
  public saleScreenSaverData: any = [];

  public AddNewRow: any = [];
  public IsQuiz: any;
  public show: any = 0;
  public showChart: any = 0;
  public LastIndex: any = false;
  public AlertTypeLast: any;

  //AlertDetails


  formAlert = new FormGroup({
    search: new FormControl(''),
  });
  onSearchAlertDetail(formValue: any) {
    this.currentPage = 1;
    this.GetAlertList(1)
  }

  onSearchRSVP(formValue: any) {
    this.GetChartList(1);
    this.currentPageChart = 1;
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
      this.loading_AlertDetails = false;
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


  onPageChange(event: any, data: any) {
    if (data === '1') {
      this.currentPage = event;
      this.GetAlertList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetAlertList(this.currentPage)
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
    formData.append('alert_type', this.ScreenSaverAndOtherType);
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

  GetLockscreenReport(id: any) {
    this.lockscreenId = id;
    this.LockscreenTitle = 'Lockscreen';
  }

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
    this.LastIndex = false;
    this.formRSVP.value.search = '';
    this.formRSVP.setValue({
      search: '',
    })
    this.http.get(`alerts_database/${data.id}/alert_stats/`, null).subscribe((res: any) => {
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

  OnChangeAlertReport(item: any, variable: any, data: any) {
    this.AlertID = data.id;
    this.AlertName = data.name;
    if (item === 'chart') {
      this.IsChartAndList = false;
    } else if (item === 'list') {
      this.VariableData = variable;
      this.IsChartAndList = true;
      this.currentPageChart = 1;
      this.GetChartList(1);
    }
  }

  // Screensaver api list Reports 

  GraphStatName: any = 'Sent Alert Details';
  GetGraphStatsScreensaver(id: any, item: any) {
    if (item === 'lockscreenalert') {
      this.GraphStatName = 'LockScreen Alert'
    } else if (item === 'screensaveralert') {
      this.GraphStatName = 'Screensaver Alert'
    } else if (item === 'wallpaperalert') {
      this.GraphStatName = 'Wallpaper Alert'
    } 
    this.AlertID = id;
    this.loading = true;
    this.IsChartAndList = false;
    this.saleScreenSaverData = [];
    this.showChart = 0;
    this.LastIndex = false;
    this.formRSVP.value.search = '';
    this.formRSVP.setValue({
      search: '',
    })
    this.http.get(`${item}/${id}/reports_stats_list/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
        this.TotalRecipients = res.data.total_recipients;
        this.Recieved = res.data.recieved;
        this.UserLinks = res.data.users_clicked_links;
        this.Acknowledged = res.data.acknowledged;
        this.NotRecieved = res.data.not_recieved;
        this.Liked = res.data.like_count;
        this.saleScreenSaverData = [
          { name: "Recieved", value: this.Recieved },
          { name: "NotRecieved", value: this.NotRecieved },
          { name: "Users clicked links", value: this.UserLinks },
          { name: "Acknowledged", value: this.Acknowledged },
          { name: "Likes Count", value: 0 },
        ];
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

  // Survey Details api

  public PageTotalNumberSurveyDetail: any = [];
  public currentPageSurveyDetail: number = 1;
  public totalItemsSurveyDetail: number | undefined;

  formSurveyDetail = new FormGroup({
    search: new FormControl(''),
  });
  onSearchSurveyDetail(formValue: any) {
    this.currentPage = 1;
    this.GetSurveyList(1)
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
      this.loading_SurveyDetails = false;
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

  onPageChangeSurveyDetail(event: any, data: any) {
    if (data === '1') {
      this.currentPageSurveyDetail = event;
      this.GetSurveyList(event)
    } else {
      this.currentPageSurveyDetail = Number(event.target.value);
      this.GetSurveyList(this.currentPageSurveyDetail)
    }
  }


  formSurveyChart = new FormGroup({
    search: new FormControl(''),
  });

  IsChartAndListSurvey: any = false;
  AlertIDSurvey: any;
  public TotalQuestionList: any = 0;
  SurveyAlertName: any = '';
  GetGraphStatsSurvey(data: any, item: any) {
    this.AlertIDSurvey = data.id;
    this.SurveyAlertName = data.name;
    this.IsQuiz = item.type;
    this.loading = true;
    this.IsChartAndListSurvey = false;
    this.saleData = [];
    this.PieChartData = [];
    this.RSVPChartData = [];
    this.showChart = 0;
    this.LastIndex = false;
    this.formSurveyChart.value.search = '';
    this.formSurveyChart.setValue({
      search: '',
    })
    this.http.get(`alerts_database/${data.id}/alert_stats/`, null).subscribe((res: any) => {
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
        this.TotalQuestion = res.data.total_question;
        this.authService.setCurrentUser({ token: res.token });

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
    // this.LastIndex = false;
    // if (index + 1 === this.TotalQuestionList.length) {
    //   this.LastIndex = true;
    //   this.showChart = index - 1;
    //   return;
    // }
    // if (item === 'Next') {
    //   this.showChart = index + 1;
    // } else {
    //   if (firstIndex) {
    //     return
    //   } else {
    //     this.showChart = index - 1;
    //   }
    // }
    // let TotalAnswerList = this.TotalQuestionList[this.showChart].options
    // this.PieChartData = [];
    // for (let i = 0; i < TotalAnswerList.length; i++) {
    //   const element = TotalAnswerList[i];
    //   this.PieChartData.push({ name: element.option_text, value: element.count, optionId: element.option_id, option_image: element.option_image });
    // }
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
    this.currentPageChartSurvey = 1;
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
    this.QuizList = item.selected_answer
  }

  //Popup, Ticker and RSVP Alert Reports List api
  formAlertReport = new FormGroup({
    to_date: new FormControl(''),
    from_date: new FormControl(''),
  });

  onSearchAlertReport(formValue: any) {
    this.GetAlertReportList(1);
    this.currentPageAlerts = 1;
  }

  GetAlertReportList(page: number) {
    this.ScreenSaverAndOtherType = '';
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formAlertReport.value;
    const toDate = formValue.to_date || '';
    const fromDate = formValue.from_date || '';
    // formData.append('search', search);
    let params = new HttpParams();
    params = params.append('page', page.toString());
    this.http.get(`reports/alerts_reports/?page=${page}&to_date=${toDate}&from_date=${fromDate}`, null).subscribe((res: any) => {
      const responseData = res;
      this.AlertReportList = res.results;
      if (res.status === true) {
        this.AlertReportList = res.data;
        this.totalItemsAlerts = responseData.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberAlerts = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJump) {
        this.PageTotalNumberAlerts.push(i);
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

  totalItemsAlerts: any = 1;
  currentPageAlerts: any = 1;
  PageTotalNumberAlerts: any = [];
  onPageChangeAlert(event: any, data: any) {
    if (data === '1') {
      this.currentPageAlerts = event;
      this.GetAlertReportList(event)
    } else {
      this.currentPageAlerts = Number(event.target.value);
      this.GetAlertReportList(this.currentPageAlerts)
    }
  }

  //User Reports List api
  formUsersReport = new FormGroup({
    search: new FormControl(''),
  });
  onSearchUsersReport(formValue: any) {
    this.GetUsersList(1);
    this.currentPageUsers = 1;
  }

  GetUsersList(page: number) {
    this.ScreenSaverAndOtherType = '';
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formUsersReport.value;
    const search = formValue.search || '';
    formData.append('search', search);
    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`reports/users_reports/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.UsersList = res.data;
        this.totalItemsUsers = responseData.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberUsers = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJumpUser) {
        this.PageTotalNumberUsers.push(i);
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

  totalItemsUsers: any = 1;
  currentPageUsers: any = 1;
  PageTotalNumberUsers: any = [];
  onPageChangeUser(event: any, data: any) {
    if (data === '1') {
      this.currentPageUsers = event;
      this.GetUsersList(event)
    } else {
      this.currentPageUsers = Number(event.target.value);
      this.GetUsersList(this.currentPageUsers)
    }
  }

  //Survey Reports List api

  formSurvey = new FormGroup({
    to_date: new FormControl(''),
    from_date: new FormControl(''),
  });
  onSearchSurvey(formValue: any) {
    this.GetSurveysList(1);
    this.currentPageSurveys = 1;
  }

  GetSurveysList(page: number) {
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formSurvey.value;
    const toDate = formValue.to_date || '';
    const fromDate = formValue.from_date || '';
    // formData.append('search', search);
    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`reports/survey_reports/?page=${page}&to_date=${toDate}&from_date=${fromDate}`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.SurveysList = res.data;
        this.totalItemsSurveys = responseData.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberSurveys = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJump) {
        this.PageTotalNumberSurveys.push(i);
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

  totalItemsSurveys: any = 1;
  currentPageSurveys: any = 1;
  PageTotalNumberSurveys: any = [];
  onPageChangeSurvey(event: any, data: any) {
    if (data === '1') {
      this.currentPageSurveys = event;
      this.GetSurveysList(event)
    } else {
      this.currentPageSurveys = Number(event.target.value);
      this.GetSurveysList(this.currentPageSurveys)
    }
  }

  //Screensavers Reports list api's

  formScreensaver = new FormGroup({
    to_date: new FormControl(''),
    from_date: new FormControl(''),
  });

  onSearchScreensaver(formValue: any) {
    this.GetScreensaverList(1);
    this.currentPageScreenSaver = 1;
  }

  GetScreensaverList(page: number) {
    this.ScreenSaverAndOtherType = 'ScreensaverAlert';
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formScreensaver.value;
    const toDate = formValue.to_date || '';
    const fromDate = formValue.from_date || '';
    // formData.append('search', search);
    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`reports/screensaver_reports/?page=${page}&to_date=${toDate}&from_date=${fromDate}`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.ScreensaverList = res.data;
        this.totalItemsScreenSaver = responseData.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberScreenSaver = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJumpUser) {
        this.PageTotalNumberScreenSaver.push(i);
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

  totalItemsScreenSaver: any = 1;
  currentPageScreenSaver: any = 1;
  PageTotalNumberScreenSaver: any = [];
  onPageChangeScreensaver(event: any, data: any) {
    if (data === '1') {
      this.currentPageScreenSaver = event;
      this.GetScreensaverList(event)
    } else {
      this.currentPageScreenSaver = Number(event.target.value);
      this.GetScreensaverList(this.currentPageScreenSaver)
    }
  }

  //Wallpaper Reports List api

  formWallpaper = new FormGroup({
    to_date: new FormControl(''),
    from_date: new FormControl(''),
  });
  onSearchWallpaper(formValue: any) {
    this.GetWallpaperList(1);
    this.currentPageWallpaper = 1;
  }

  GetWallpaperList(page: number) {
    this.ScreenSaverAndOtherType = 'WallpaperAlert';
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formWallpaper.value;
    const toDate = formValue.to_date || '';
    const fromDate = formValue.from_date || '';
    // formData.append('search', search);
    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`reports/wallpaper_reports/?page=${page}&to_date=${toDate}&from_date=${fromDate}`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.WallpaperList = res.data;
        this.totalItemsWallpaper = responseData.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberWallpaper = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJumpUser) {
        this.PageTotalNumberWallpaper.push(i);
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

  totalItemsWallpaper: any = 1;
  currentPageWallpaper: any = 1;
  PageTotalNumberWallpaper: any = [];
  onPageChangeWallpaper(event: any, data: any) {
    if (data === '1') {
      this.currentPageWallpaper = event;
      this.GetWallpaperList(event)
    } else {
      this.currentPageWallpaper = Number(event.target.value);
      this.GetWallpaperList(this.currentPageWallpaper)
    }
  }

  //Lockscreen Reports List api

  formLockscreen = new FormGroup({
    to_date: new FormControl(''),
    from_date: new FormControl(''),
  });
  onSearchLockscreen(formValue: any) {
    this.GetLockscreenList(1);
    this.currentPageLockscreen = 1;
  }

  GetLockscreenList(page: number) {
    this.ScreenSaverAndOtherType = 'LockscreenAlert';
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formLockscreen.value;
    const toDate = formValue.to_date || '';
    const fromDate = formValue.from_date || '';
    // formData.append('search', search);
    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`reports/lockscreen_reports/?page=${page}&to_date=${toDate}&from_date=${fromDate}`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.LockscreenList = res.data;
        this.totalItemsLockscreen = responseData.count;
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberLockscreen = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJumpUser) {
        this.PageTotalNumberLockscreen.push(i);
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

  totalItemsLockscreen: any = 1;
  currentPageLockscreen: any = 1;
  PageTotalNumberLockscreen: any = [];
  onPageChangeLockscreen(event: any, data: any) {
    if (data === '1') {
      this.currentPageLockscreen = event;
      this.GetLockscreenList(event)
    } else {
      this.currentPageLockscreen = Number(event.target.value);
      this.GetLockscreenList(this.currentPageLockscreen)
    }
  }

}