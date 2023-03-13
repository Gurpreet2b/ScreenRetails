import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserLimitMessageComponent } from 'src/app/core/components/layout/userLimitMessage/userLimitMessage.component';
@Component({
  selector: 'app-send-user-alert',
  templateUrl: './send-user-alert.component.html',
  styleUrls: ['./send-user-alert.component.css'],
})
export class SendUserAlertComponent implements OnInit {
  public loading = false;
  // Users: any = true;
  // Groups: any = false;
  // Computers: any = false;
  public ReturnDataType: any = 'users';
  UsersList: any = [];
  UsersListSelected: any = [];
  UserType: any;
  AlertId: any;
  AlertType: any;
  items: any;
  simpleItems: any = {};
  OrgList: any = [];
  OuTree: any = [];
  OrganizationList: any = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: true,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });
  public RecipientListChoice: any;
  public GroupUserList: any = [];

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
  }

  onSelectedChange(event: any, data: any) {
    this.OuTree = data;
    if (event.length === 0) {
      this.OrgList = 'all'
    } else {
      this.OrgList = event;
    }
    this.GetAddUserToAlert(1);

    this.currentPage = 1;
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
    formData.append('search', search);

    // formData.append('users', this.Users),
    //   formData.append('groups', this.Groups),
    //   formData.append('computers', this.Computers),
    formData.append('return_data_type', this.ReturnDataType),
      formData.append('ou', this.OrgList),
      formData.append('ou_tree', JSON.stringify(this.OuTree));
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

  SendAlert() {
    if (this.UserType === 'select-recipients') {
      if (this.UsersList.length === 0) {
        this.toastr.warning('Please select atleast one recipient');
        return;
      }
    }
    this.loading = true;
    const formData = new FormData();
    formData.append('users_list', JSON.stringify(this.UsersList)),
      formData.append('broadcast', this.UserType),
      formData.append('alert_id', this.AlertId),
      formData.append('alert_type', this.AlertType),
      formData.append('ou', this.OrgList),
      formData.append('ou_tree', JSON.stringify(this.OuTree));
    this.http.post(`add_users_to_emergency_alerts/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res;
        this.toastr.success('Emergency Alert Sent Successfully !!');
        if (this.authService.getUserLimitCrossed() === 'true') {
          this.onShowWarning();
        }
        this.router.navigate([`/emergency/send-now`]);
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

  IsSelectedOrgList(event: any, item: any) {
    let checkedVal = event.target.checked;
    if (checkedVal === true) {
      this.UsersList.push(item);
    } else {
      this.UsersListSelected = this.UsersList.filter((x: any) => x.name !== item.name);
      this.UsersList = this.UsersListSelected;
    }
  }

  DeleteSelectedGroupAndUser(index: any, item: any) {
    this.UsersList.splice(index, 1);
    this.UsersListSelected = this.OrganizationList.filter((x: any) => x.name === item.name);
    this.UsersListSelected[0].selected = false;
  }

  onShowWarning() {
    const modalRef = this.modalService.open(UserLimitMessageComponent);
  }
   
  formGroupUserList = new FormGroup({
    search: new FormControl(''),
  });

  onSearchGroupUserList(formValue: any) {
    this.GetGroupUserList(1, '');
    this.currentUserPage = 1;
  }

  GroupUserName: any;
  GroupName: any = '';
  GetGroupUserList(page: number, data: any) {
    this.loading = true;
    
    if (data !== '') {
      this.GroupUserName = data;
      this.GroupName = data.name;
    }
    const formData = new FormData();
    const formValue = this.formGroupUserList.value;
    const search = formValue.search || '';
    formData.append('search', search);
    formData.append('distinguished_name', this.GroupUserName.distinguished_name),
    this.http.post(`organization/show_group_users/?page=${page}`, formData).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.totalItemsUsers = responseData.count;
        this.GroupUserList = res.data;
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

  currentUserPage: number = 1;
  totalItemsUsers: number | undefined;
  onPageGroupUserChange(event: any, data: any) {
    if (data === '1') {
      this.currentUserPage = event;
      this.GetGroupUserList(event, '')
    } else {
      this.currentUserPage = Number(event.target.value);
      this.GetGroupUserList(this.currentUserPage, '')
    }
  }


}