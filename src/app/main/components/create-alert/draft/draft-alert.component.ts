import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as xlsx from 'xlsx';
const Excel_Extension = '.xlsx';
import { AngularCsv } from 'angular-csv-ext/dist/Angular-csv';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-draft-alert',
  templateUrl: './draft-alert.component.html',
  styleUrls: ['./draft-alert.component.css'],
})
export class DraftAlertComponent implements OnInit {
  // @ViewChild('PopupAlertepltable', { static: false })
  // PopupAlertepltable!: ElementRef;

  public loading = false;
  public DraftList: any = [];
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
  public Permission: any = [];
  public RoleAssign: any = [];
  public RoleName: any;
  // formRSVP: any;
  // VariableData: any;
  currentPageChart: number;
  totalItemsChart: any;
  IsDraftList: boolean;
  VariableDraftData: any;
  currentPageDraftChart: number;
  currentPageDraftListr: number;
  DraftTitle: any;
  public filterType: any = 'all';
  DraftId: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe,public translate: TranslateService,
    private authService: AuthService) {
      translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Draft Alerts`);
    this.GetDraftList(1);
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.RoleName = this.Permission.role;
  }

  IsAlertFilter(event: any) {
    this.filterType = event.target.value;
    this.GetDraftList(1);
    this.currentPage = 1;
  }

  // onEditDraft(id: any) {
  //   this.DraftId = id;
  //   this.DraftTitle = 'Edit';
  // }


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
    this.GetDraftList(1);
    this.currentPage = 1;
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetDraftList(page: number) {
    this.loading = true;
    const formData = new FormData();
    const formValue = this.form.value;
    const search = formValue.search || '';
    formData.append('search', search);
    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`alerts_database/draft_alerts_list/?search=${search}&alert_type=${this.filterType}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.DraftList = res.data;
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
      this.GetDraftList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetDraftList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteAlert(id);
    }
  }
  onDeleteAlert(id: number) {
    this.loading = true;
    this.http.post(`alerts_database/${id}/delet_draft_alert/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Alerts Deleted Successfully");
        this.GetDraftList(this.currentPage);
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.toastr.error(res.message);
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

  public HeaderTitle: any = '';
  public HeaderFontSize: any = '';
  public HeaderBgColor: any = '';
  public AlertBgColor: any = '';

  public FooterImageUrl: any = '/assets/img/dewa-lines.png';

  GetSkinListById(item: any) {
    if (item.alert_type === 'PopupAlert') {
      this.AlertType = item.alert_type;
      this.TextTitle = item.name;
      this.TextBody = item.body_text;
      this.Think = item.skin.border_thickness;
      this.HeaderBorder = item.skin.border_color;
      this.HeaderLogo = item.skin.team_image_align;
      this.HeaderTextImg = item.skin.team_image;
      this.FooterLogo = item.skin.footer_align;
      this.FooterBgColor = item.skin.footer_background_color;
      this.footerColor = item.skin.footer_text_color;
      this.FooterFontSize = item.skin.footer_font_size;
      this.FooterText = item.skin.footer_text;
      this.acknowledgementRequired = item.acknowledgement_required;
      this.AddPrint = item.add_print_button;
      this.AllowFeedback = item.allow_feedback;

      this.AlertBgColor = item.skin.alert_background_color;
      this.HeaderBgColor = item.skin.header_background_color;
      this.HeaderTitle = item.skin.header_custom_message;
      this.HeaderFontSize = item.skin.header_custom_message_font_color;
      this.FooterImageUrl = item.skin.footer_background_image;

    } else if (item.alert_type === 'TickerAlert') {
      this.AlertType = item.alert_type;
      this.TextTitle = item.name;
      this.TextBody = item.body_text
      this.Think = item.skin.border_thickness;
      this.HeaderBorder = item.skin.border_color;
      this.HeaderTextImg = item.skin.team_image;

      this.AlertBgColor = item.skin.alert_background_color;
      this.HeaderBgColor = item.skin.header_background_color;
      this.HeaderTitle = item.skin.header_custom_message;
      this.HeaderFontSize = item.skin.header_custom_message_font_color;
      this.FooterImageUrl = item.skin.footer_background_image;
    }

  }

}