import { DOCUMENT } from '@angular/common';
import { Component, DoCheck, Inject, OnChanges, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, HttpService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WarningMessageComponent } from '../warningMessage/warningMessage.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, DoCheck {
  public loading = false;
  isIconOnly: boolean = false;
  name: string | null | undefined;
  public HeaderTitleName: any;
  public CommonSettingList: any = {};
  public SetInterval: any = 1;
  public LicenseDays: any = '';
  public LicenseUsed: any = '';
  public IsShowWarning: any = 'false';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public authService: AuthService,
    private router: Router,
    private http: HttpService, private modalService: NgbModal,
    private toastr: ToastrService, public translate: TranslateService,
  ) { 
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    let UserName = this.authService.getUserName();
    this.name = UserName;
    this.GetCommonSettings();
    this.GetInfoWork();
    this.SetInterval = setInterval(() => {
      this.GetInfoWork();
    }, 1800000);
    this.IsShowWarning = this.authService.getShowWarning();
      if (this.IsShowWarning === "true") {
        this.onShowWarning();
      }
  }

  onShowWarning() {
      const modalRef = this.modalService.open(WarningMessageComponent);
  }

  ngDoCheck() {
    this.HeaderTitleName = this.authService.TitleName;
  }

  /**
   * Toggle the sidebar
   */
  onToggleSidebar() {

    if (this.isIconOnly) {
      this.renderer.removeClass(this.document.body, 'sidebar-icon-only');
    } else {
      this.renderer.addClass(this.document.body, 'sidebar-icon-only');
    }

    this.isIconOnly = !this.isIconOnly;
  }

  /**
   * Logout the current session
   */
  onLogout() {
    this.http.post(`logout/`, null).subscribe((res: any) => {
      const responseData = res;
    });
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

  // Common Settings Check function
  GetCommonSettings() {
    this.loading = true;
    this.http.get(`settings/`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.CommonSettingList = res.result;
        this.authService.setDateFormat(this.CommonSettingList.date_format);
        this.authService.setTimeFormat(this.CommonSettingList.time_format);
        this.loading = false;
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    },  error => {
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

  GetInfoWork() {
    this.http.get(`info/`, null).subscribe((res: any) => {
      this.LicenseDays = res.difference;
      this.LicenseUsed = res.clients_count;
      this.authService.setUserLimitCrossed(res.user_limit_crossed);
    });
  }

}
