import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLimitMessageComponent } from 'src/app/core/components/layout/userLimitMessage/userLimitMessage.component';
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
  // formSend: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, private router: Router,
    private authService: AuthService, private modalService: NgbModal) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Alerts`);
    this.AlertId = this.activeRoute.snapshot.params['id'] || 0;
    this.AlertType = this.activeRoute.snapshot.params['type'];
  }

  onSelectedUserType(event: any) {
    this.UserType = event.target.value;
    this.GetAddUserToAlert(1);
    // if(this.UserType === 'broadcast') {
    //   this.UsersList = [];
    //   // this.GetAddUserToAlert();
    // }
  }

  IsSelectedUsers() {
    this.GetAddUserToAlert(1);
  }

  formSend = new FormGroup({
    search: new FormControl(''),
  });

  onSearchSend(formValue: any) {
    this.GetAddUserToAlert(1)
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];

  GetAddUserToAlert(page: number) {
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formSend.value;
    const search = formValue.search || '';
    
    formData.append('users', this.Users),
      formData.append('groups', this.Groups),
      formData.append('computers', this.Computers),
      formData.append('ou', this.OrgList),
      this.http.get(`digital_signage/users_names_list/?page=${page}&search=${search}`, null).subscribe((res: any) => {
        const responseData = res;
        if (res.status === true) {
          this.totalItems = responseData.count;
          this.OrganizationList = res.result;
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
      this.GetAddUserToAlert(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetAddUserToAlert(this.currentPage)
    }
  }

  SendAlert() {
      if (this.UsersList.length === 0) {
        this.toastr.warning('Please select atleast one recipient');
        return;
      }
    this.loading = true;
    const formData = new FormData();
    formData.append('users_list', JSON.stringify(this.UsersList)),
      formData.append('alert_type', this.AlertType),
      this.http.post(`digital_signage/${this.AlertId}/add_users_to_alert/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res;
          this.toastr.success('Alert Sent Successfully !!');
          if (this.authService.getUserLimitCrossed() === 'true') {
            this.onShowWarning();
          }
          this.router.navigate([`/device`]);
          // if(this.AlertType === 'SurveyAlert') {
          //   this.router.navigate([`/device`]);
          // } else {
          //   this.router.navigate([`/create-alerts/sent`]);
          // }
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

  IsSelectedOrgList(event: any, item: any) {
    let checkedVal = event.target.checked;
    if (checkedVal === true) {
      this.UsersList.push(item);
    } else {
      this.UsersListSelected = this.UsersList.filter((x: any) => x.name !== item.name);
      this.UsersList = this.UsersListSelected;
    }
  }

  onShowWarning() {
    const modalRef = this.modalService.open(UserLimitMessageComponent);
  }

}