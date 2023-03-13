import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { translateHttpLoaderFactory } from '../wallpaper.module';
@Component({
  selector: 'app-send-user-alert',
  templateUrl: './send-user-alert.component.html',
  styleUrls: ['./send-user-alert.component.css'],
})
export class SendUserAlertComponent implements OnInit {
  public loading = false;
  Users: any = true;
  Groups: any = false;
  Computers: any = false;
  public Subscription: any = false;
  UsersList: any = [];
  UsersListSelected: any = [];
  UserType: any;
  AlertId: any;
  AlertType: any;
  items: any;
  simpleItems: any = {};
  OrgList: any = [];
  OrganizationList: any = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  public RecipientListChoice: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, private router: Router,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Alerts`);
    this.AlertId = this.activeRoute.snapshot.params['id'] || 0;
    this.AlertType = this.activeRoute.snapshot.params['type'];
    this.GetOrganizationList();
    let Permission = this.authService.getPermission();
    this.RecipientListChoice = Permission.recipients_list_choice;
  }

  onSelectedUserType(event: any) {
    this.UserType = event.target.value;
    if (this.UserType === 'broadcast') {
      this.UsersList = [];
      // this.GetAddUserToAlert();
    }
  }

  IsSelectedUsers() {
    this.GetAddUserToAlert(1);
    this.currentPage = 1;
  }

  onSelectedChange(event: any) {
    if (event.length === 0) {
      this.OrgList = 'all'
    } else {
      this.OrgList = event;
    }
    this.GetAddUserToAlert(1);
  }

  formSendUser = new FormGroup({
    search: new FormControl(''),
  });

  onSearchSendUser(formValue: any) {
    this.GetAddUserToAlert(1)
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];

  GetAddUserToAlert(page: number) {
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formSendUser.value;
    const search = formValue.search || '';
    // formData.append('page', page.toString());
    formData.append('search', search);
    formData.append('users', this.Users),
      formData.append('groups', this.Groups),
      formData.append('computers', this.Computers),
      formData.append('subscription_list', this.Subscription),
      formData.append('ou', this.OrgList),
      this.http.post(`add_users_to_alert_page_list/?page=${page}`, formData).subscribe((res: any) => {
        const responseData = res;
        if (res.status === true) {
          this.totalItems = responseData.count;
          this.OrganizationList = res.data;
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
      this.GetAddUserToAlert(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetAddUserToAlert(this.currentPage)
    }
  }

  getItems(parentChildObj: any) {
    let itemsArray = [];
    parentChildObj.forEach((set: any) => {
      itemsArray.push(new TreeviewItem(set))
    });
    return itemsArray;
  }

  GetOrganizationList() {
    this.loading = true;
    this.http.get(`organization/`, null).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res;
        this.simpleItems = res.data;
        this.items = this.getItems([this.simpleItems]);
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

  SendAlert() {
    this.loading = true;
    const formData = new FormData();
    formData.append('users_list', JSON.stringify(this.UsersList)),
      formData.append('broadcast', this.UserType),
      formData.append('alert_id', this.AlertId),
      formData.append('alert_type', this.AlertType),
      formData.append('ou', this.OrgList),
      this.http.post(`add_users_to_wallpaper_lockscreen_screensaver/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res;
          this.toastr.success('Alert Sent Successfully !!');
          if (this.AlertType === 'WallpaperAlert') {
            this.router.navigate([`/wallpaper`]);
          } else if (this.AlertType === 'LockscreenAlert') {
            this.router.navigate([`/lockscreen`]);
          } else if (this.AlertType === 'ScreensaverAlert') {
            this.router.navigate(['/screensaver']);
          }
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

  IsSelectedOrgList(event: any, item: any) {
    let checkedVal = event.target.checked;
    if (checkedVal === true) {
      this.UsersList.push(item);
    } else {
      this.UsersListSelected = this.UsersList.filter((x: any) => x.name !== item.name);
      this.UsersList = this.UsersListSelected;
    }
  }

}