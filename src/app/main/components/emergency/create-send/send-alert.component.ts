import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-send-alert',
  templateUrl: './send-alert.component.html',
  styleUrls: ['./send-alert.component.css'],
})
export class SendNowAlertComponent implements OnInit {

  public loading = false;
  public EmergencyList: any = [];
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
  public IsWhiteColor: any = true

  public HeaderTitle: any = '';
  public HeaderFontSize: any = '';
  public HeaderBgColor: any = '';
  public AlertBgColor: any = '';
  public FooterImageUrl: any = '/assets/img/dewa-lines.png';

  public Permission: any = [];
  public RoleName: any;
  public RoleAssign: any = [];
  public ShowFooter = false;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, private router: Router,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Emergency Alerts`);
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.RoleName = this.Permission.role;
    this.GetEmergencyList(1);
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];

  GetEmergencyList(page: number) {
    this.loading = true;
    let params = new HttpParams();
    params = params.append('page', page.toString())

    this.http.get(`emergency_alerts/`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.loading = false;
        this.totalItems = res.count;
        this.EmergencyList = res.data;
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
      this.GetEmergencyList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetEmergencyList(this.currentPage)
    }
  }

  OnSubmitEmergency(item: any) {
    const formData = new FormData();
    formData.append('alert_id', item.id);
    formData.append('alert_type', item.alert_type);
    this.loading = true;
    this.http.post('emergency_alerts/', formData).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res.data;
        this.toastr.success("Emergency Alert Sent Successfully !!");
        this.router.navigate([`/create-alerts/sent`]);
        this.loading = false;
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

  delete(item: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteEmergency(item);
    }
  }
  onDeleteEmergency(item: any) {
    this.loading = true;
    this.http.post(`emergency_alerts/delete/?alert_id=${item.id}&alert_type=${item.alert_type}`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Emergency Alert Deleted Successfully");
        this.GetEmergencyList(this.currentPage);
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

  async GetSkinListById(item: any) {
    if (item.skin.name === 'White') {
      this.IsWhiteColor = true;
    } else {
      this.IsWhiteColor = false;
    }
    if (item.alert_type === 'EmergencyPopupAlert') {
      this.AlertType = item.alert_type;
      this.TextTitle = item.name;
      this.TextBody = item.body_text
      this.Think = item.skin.border_thickness;
      this.HeaderBorder = item.skin.border_color;
      this.HeaderTextImg = item.skin.team_image;
      this.FooterLogo = item.skin.footer_align;
      this.FooterBgColor = item.skin.footer_background_color;
      this.HeaderLogo = item.skin.team_image_align;
      this.footerColor = item.skin.footer_text_color;
      this.FooterFontSize = item.skin.footer_font_size;
      this.FooterText = item.skin.footer_text;
      this.acknowledgementRequired = item.acknowledgement_required;
      this.AddPrint = item.add_print_button;
      this.AllowFeedback = item.allow_feedback;
      this.ShowFooter = item.skin.show_alert_footer;
      this.AlertBgColor = item.skin.alert_background_color;
      this.HeaderBgColor = item.skin.header_background_color;
      this.HeaderTitle = item.skin.header_custom_message;
      this.HeaderFontSize = item.skin.header_custom_message_font_color;
      this.FooterImageUrl = item.skin.footer_background_image;

      await new Promise(f => setTimeout(f, 100));

      if (document.getElementById("emergency-body-text")) {
        document.getElementById("emergency-body-text").innerHTML = item.body;
      }

    } else if (item.alert_type === 'EmergencyTickerAlert') {
      
      this.ShowFooter = item.skin.show_alert_footer;
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