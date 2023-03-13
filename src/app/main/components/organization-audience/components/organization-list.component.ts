import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { TreeviewConfig, TreeviewItem } from 'ngx-treeview';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-organization-list',
  templateUrl: './organization-list.component.html',
  styleUrls: ['./organization-list.component.css'],
})
export class OrganizationListComponent implements OnInit {
  public loading = false;
  UserType: any;
  items: any;
  simpleItems: any = {};
  OrgList: any = [];
  OrganizationList: any = [];
  config = TreeviewConfig.create({
    hasAllCheckBox: false,
    hasFilter: false,
    hasCollapseExpand: true,
    decoupleChildFromParent: false,
    maxHeight: 400
  });

  OuTree: any = [];
  public GroupUserList: any = [];

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Organization/Audience`);
    this.GetOrganizationList();
  }

  onSelectedUserType(event: any) {
    this.UserType = event.target.value;
    this.GetOrganizationById(1);
  }

  onSelectedChange(event: any, data: any) {
    this.OuTree = data;
    if (event.length === 0) {
      this.OrgList = 'all'
    } else {
      this.OrgList = event;
    }
    this.GetOrganizationById(1);
  }

  formOrganization = new FormGroup({
    search: new FormControl(''),
  });

  onSearchOrganization(formValue: any) {
    this.GetOrganizationById(1);
    this.currentPage = 1;
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetOrganizationById(page: number) {
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formOrganization.value;
    const search = formValue.search || '';
    formData.append('search', search);
    formData.append('result_type', this.UserType),
      formData.append('ou', this.OrgList),
      formData.append('ou_tree', JSON.stringify(this.OuTree));
    this.http.post(`organization/?page=${page}`, formData).subscribe((res: any) => {
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
      this.GetOrganizationById(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetOrganizationById(this.currentPage)
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
        this.authService.setCurrentUser({ token: res.token });
        this.items = this.getItems([this.simpleItems]);
        this.loading = false;
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
      this.GroupName = data.group_name;
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