import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.css'],
})
export class ApprovalListComponent implements OnInit {
  public loading = false;
  public submitted = false;
  public wallpaperId: any;
  public ApprovalTitle: any;
  public ApprovalList: any = [];
  public Think: any;
  public HeaderBorder: any;
  public HeaderLogo: any;
  public HeaderTextImg: any;
  public Permission: any = [];
  public RoleName: any;
  public RoleAssign: any = [];
  public RejectId: any;
  public AlertType: any;
  public AlertDetails: any = [];
  public RecipientId: any;
  public AlertRecipientDetails: any = [];
  public AlertTypeRecipient: any;

  constructor(private http: HttpService,
    private toastr: ToastrService, private router: Router,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Approval`);
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.RoleName = this.Permission.role;
    this.GetApprovalList(1);
  }

  dateformat(datas: string) {
    return this.authService.Dateformat(datas);
  }

  Timeformat(time: string) {
    return this.authService.Timeformat(time);
  }

  formApproval = new FormGroup({
    search: new FormControl(''),
  });

  onSearchApproval(formValue: any) {
    this.GetApprovalList(1);
    this.currentPage = 1;
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetApprovalList(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formApproval.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`alerts_database/approval_alerts_list/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.ApprovalList = res.data;
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
      this.GetApprovalList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetApprovalList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteApproval(id);
    }
  }
  onDeleteApproval(id: number) {
    this.loading = true;
    this.http.delete(`alerts_database/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Approval Alert Deleted Successfully");
        this.GetApprovalList(this.currentPage);
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

  IsApprovalAlert(id: any, alertType: any) {
    this.loading = true;

    const formData = new FormData();
    formData.append('alert_type', alertType);
    this.http.post(`alerts_database/${id}/approve_alert/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('Approved Successfully !!');
        this.GetApprovalList(1);
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

  formRejected = this.fb.group({
    message: ['', Validators.required],
  })

  // Getter method to access formcontrols
  get myRejectedForm() {
    return this.formRejected.controls;
  }

  IsRejectedAlert(id: any, alertType: any) {
    this.RejectId = id;
    this.AlertType = alertType;
  }

  OnRejectSubmit() {
    this.submitted = true;
    this.formRejected.markAllAsTouched();
    if (!this.formRejected.valid) {
      return;
    }
    const dataToSubmit = { ...this.formRejected.value };
    const formData = new FormData();
    formData.append('alert_type', this.AlertType);
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    this.http.post(`alerts_database/${this.RejectId}/reject_alert/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success('Rejected Successfully !!');
        this.GetApprovalList(1);
        this.onDismiss();
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

  onDismiss() {
    const target = "#RejectedModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
    $("body").addClass("modal-overflow");
  }

  IsAlertDetails(id: any) {
    this.loading = true;
    this.http.post(`alerts_database/${id}/get_alert_details/`, null).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.AlertDetails = res.data;
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

  formDetail = new FormGroup({
    search: new FormControl(''),
  });

  onSearch(formValue: any) {
    this.OnSubmitAlertRecipient(1);
    this.currentPageUser = 1;
  }

  IsAlertRecipient(data: any) {
    this.RecipientId = data.id;
    this.AlertTypeRecipient = data.alert_type;
    this.formDetail.setValue({
      search: '',
    })
    this.OnSubmitAlertRecipient(1);
  }

  OnSubmitAlertRecipient(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formDetail.value;
    const search = formValue.search || '';
    formData.append('search', search);
    formData.append('alert_type', this.AlertTypeRecipient);

    this.http.post(`alerts_database/${this.RecipientId}/total_recipients_list/?page=${page}`, formData).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.loading = false;
        this.AlertRecipientDetails = res.data;
        this.totalItemsUser = responseData.count;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
      this.PageTotalNumberUser = [];
      let Count = responseData.count / 10;
      for (let i = 0; i < Count; i += this.PageJump) {
        this.PageTotalNumberUser.push(i);
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

  currentPageUser: number = 1;
  totalItemsUser: number | undefined;
  PageTotalNumberUser: any = [];
  onPageUserChange(event: any, data: any) {
    if (data === '1') {
      this.currentPageUser = event;
      this.OnSubmitAlertRecipient(event)
    } else {
      this.currentPageUser = Number(event.target.value);
      this.OnSubmitAlertRecipient(this.currentPageUser)
    }
  }

}