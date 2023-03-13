import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as xlsx from 'xlsx';
const Excel_Extension = '.xlsx';
import { TranslateService } from '@ngx-translate/core';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
@Component({
  selector: 'app-active-alert',
  templateUrl: './active-alert.component.html',
  styleUrls: ['./active-alert.component.css'],
})
export class ActiveAlertComponent implements OnInit {
  @ViewChild('Surveyepltable', { static: false })
  Surveyepltable!: ElementRef;

  @ViewChild('SurveyQuestionepltable', { static: false })
  SurveyQuestionepltable!: ElementRef;

  public loading = false;
  public ActiveList: any = [];
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
  public DateTimePopup = new Date();
  public AddNewRow: any = [];
  public Sent: any = 0;
  public Recieved: any = 0;
  public Displayed: any = 0;
  public Liked: any = 0;
  public TotalRecipients: any = 0;
  public Acknowledged: any = 0;
  public NotRecieved: any = 0;

  public Voted: any = 0;
  public RecievedNotVoted: any = 0;
  public TotalQuestionList: any = 0;
  public TotalQuestion: any;

  public saleData: any = [];
  public PieChartData: any = [];
  public RSVPChartData: any = [];
  public Permission: any = [];
  public RoleAssign: any = [];
  public RoleName: any;
  public filterType: any = 'all';
  AlertBgClr: any;
  AlertBgImg: any;
  BorderClr: any;
  BorderThickness: any;
  FooterBgImg: any;
  HeaderBgColor: any;
  HeaderTitle: any;
  HeaderFontSize: any;
  FooterImageUrl: any;
  ShowFooter: any;
  AlertBgColor: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Active Surveys`);
    this.Permission = this.authService.getPermission();
    this.RoleName = this.Permission.role;
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.GetActiveList(1);
  }

  // Survey List with pagination and preview data functions Start

  IsAlertSurveyFilter(event: any) {
    this.filterType = event.target.value;
    this.GetActiveList(1);
  }

  dateformat(datas: string) {
    return this.authService.Dateformat(datas);
  }

  Timeformat(time: string) {
    return this.authService.Timeformat(time);
  }

  formSurvey = new FormGroup({
    search: new FormControl(''),
  });

  formSurveyChart = new FormGroup({
    search: new FormControl(''),
  });

  onSearchSurvey(formValue: any) {
    this.GetActiveList(1);
    this.currentPage = 1;
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetActiveList(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formSurvey.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`alerts_database/survey_alerts_list/?search=${search}&survey_type=${this.filterType}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.ActiveList = res.data;
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
      this.GetActiveList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetActiveList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteSurvey(id);
    }
  }
  onDeleteSurvey(id: number) {
    this.loading = true;
    this.http.delete(`alerts_database/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Survey Alerts Deleted Successfully");
        this.GetActiveList(this.currentPage);
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.toastr.error(res.error);
        this.loading = false;
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

  show: any = 0;
  OnNextSubmit(index: any, lastIndex: any) {
    this.show = index + 1;
    if (lastIndex === true) {
      this.AddNewRow.push({
        'rowAns': [{ answer1: '', Url: '', selectedVal: false }], 'question': '', 'choice': 'Submitted', 'answer': '', 'intermAnswer': '',
        minNumber: '', minLabel: '', maxNumber: '', maxLabel: '', intermUrl: '', UrlQuestion: ''
      });
    }
  }

  // Survey List with pagination and preview data functions End

  // Survey List Action column Start and stop functions Start
  IsResumeAlert(id: any) {
    this.loading = true;

    this.http.post(`alerts_database/${id}/resume_alert/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('Active Started Successfully !!');
        this.GetActiveList(1);
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
        this.toastr.success('Active Stopped Successfully !!');
        this.GetActiveList(1);
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
  // Survey List Action column Start and stop functions End

  GetSkinListById(item: any) {
    this.TextTitle = item.name;
    this.Think = item.skin.border_thickness;
    this.HeaderBorder = item.skin.border_color;
    this.HeaderLogo = item.skin.team_image_align;
    this.HeaderTextImg = item.skin.team_image;
    this.FooterLogo = item.skin.footer_align;
    this.FooterBgColor = item.skin.footer_background_color;
    this.footerColor = item.skin.footer_text_color;
    this.FooterFontSize = item.skin.footer_font_size;
    this.FooterText = item.skin.footer_text;
    this.AlertBgColor = item.skin.alert_background_color;
    this.AlertBgImg = item.skin.alert_background_image;
    this.BorderClr = item.skin.border_color;
    this.BorderThickness = item.skin.border_thickness;
    this.HeaderBorder = item.skin.border_color;
    this.HeaderTextImg = item.skin.team_image;
    this.HeaderBgColor = item.skin.header_background_color;
    this.HeaderTitle = item.skin.header_custom_message;
    this.ShowFooter = item.skin.show_alert_footer;
    this.HeaderFontSize = item.skin.header_custom_message_font_color;
    this.FooterImageUrl = item.skin.footer_background_image;

    this.AddNewRow = JSON.parse(item.survey_alert.questions);
    this.AddNewRow.splice(this.AddNewRow.length - 1, 1);
    this.show = 0;
  }

  //ngx-chart bar vertical and Chart list with api's

  IsChartAndList: any = false;
  AlertID: any;
  IsQuiz: any;
  SurveyAlertName: any = '';
  GetGraphStats(data: any, item: any) {
    this.AlertID = data.id;
    this.SurveyAlertName = data.name
    this.GetExportExcelAndCsv(data);
    this.GetRSVPQuesExportExcelAndCsv(data);
    this.IsQuiz = item.type;
    this.loading = true;
    this.IsChartAndList = false;
    this.saleData = [];
    this.PieChartData = [];
    this.RSVPChartData = [];
    this.showChart = 0;
    // this.LastIndex = false;
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
        this.TotalQuestion = res.data.total_question

        if (res.data.question_list.length) {
          let TotalAnswerList = res.data.question_list[0].options
          for (let i = 0; i < TotalAnswerList.length; i++) {
            const element = TotalAnswerList[i];
            this.PieChartData.push({ name: element.option_text, value: element.count, optionId: element.option_id, option_image: element.option_image });
          }
        }
       

        this.RSVPChartData = [
          { name: "Sent", value: this.Sent },
          // { name: "Recieved", value: this.Recieved },
          { name: "Displayed", value: this.Displayed },
          { name: "NotRecieved", value: this.NotRecieved },
          { name: "Voted", value: this.Voted },
          { name: "Received, but not voted", value: this.RecievedNotVoted },
        ];
        // this.PieChartData = [
        //   { name: "Yes", value: 5 },
        //   { name: "No", value: 10 },
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

  showChart: any = 0;
  // LastIndex: any = false;
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

  SurveyPieChartAns(question: any, answer: any, variable: any) {
    this.QuestionData = question;
    this.AnswerData = answer.optionId;
    this.VariableData = variable;
    this.IsChartAndList = true;
    this.currentPageChart = 1;
    this.GetChartList(1);
  }

  onSearchSurveyChart(formValue: any) {
    this.GetChartList(1);
    this.currentPageChart = 1;
  }

  QuestionData: any = '';
  AnswerData: any = '';
  PageJumpChart: any = 10;
  PageTotalNumberChart: any = [];
  AlertDetailList: any = []
  VariableData: any = 'total_recipients_list';
  GetChartList(page: number) {
    this.loading = true;
    const formData = new FormData();
    formData.append('question_text', this.QuestionData);
    formData.append('option_id', this.AnswerData);
    const formValue = this.formSurveyChart.value;
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

  QuizList: any = [];
  IsQuizList(item: any) {
    this.QuizList = item.selected_answers
  }

  // Export to Excel And Csv Survey Questions Download functionality
  ExportExcelAndCsvSurveyList: any = [];
  ExportType: any;
  GetExportExcelAndCsv(item: any) {
    this.ExportType = item.alert_type;
    this.loading = true;
    this.http.get(`alerts_database/${item.id}/alerts_csv_excel/?alert_type=${item.survey_alert.alert_type}`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.ExportExcelAndCsvSurveyList.push(res.data);
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

  ExportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.Surveyepltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'SurveyDetail.xlsx' + new Date().getTime() + Excel_Extension);
  }

  downloadCSV() {
    var options = {
      title: 'Survey Details',
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: ['Alert Title', 'Sent Date', 'Total Recipients', 'Sent', 'Recieved', 'Displayed', 'Not Recieved', 'Voted', 'Not Voted', 'Total Question']
    }

    new AngularCsv(this.ExportExcelAndCsvSurveyList, 'SurveyDetail', options);
  }

  SurveyQuesExportExcelAndCsvList: any = [];
  GetRSVPQuesExportExcelAndCsv(item: any) {
    this.loading = true;
    this.http.get(`alerts_database/${item.id}/survey_csv_excel/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.SurveyQuesExportExcelAndCsvList = res.data;
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

  SurveyExportToExcel() {
    const ws: xlsx.WorkSheet =
      xlsx.utils.table_to_sheet(this.SurveyQuestionepltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, 'SurveyQuestionDetail.xlsx' + new Date().getTime() + Excel_Extension);
  }

  SurveydownloadCSV() {
    var options = {
      title: 'Survey Alert Question Details',
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true,
      headers: ['Question Type', 'Question Text', 'Answer', 'Image', 'Count', 'Users']
    };

    new AngularCsv(this.SurveyQuesExportExcelAndCsvList, 'SurveyQuestionDetail', options);
  }

}
