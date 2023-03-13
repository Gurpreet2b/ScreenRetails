import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-opt-list',
  templateUrl: './opt-list.component.html',
  styleUrls: ['./opt-list.component.css'],
})
export class OPTListComponent implements OnInit {
  public loading = false;
  public OptTitle: any;
  public optId: any;
  public OptList: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Subscription List`);
    this.GetSubscriptionList(1);
  }

  ValueChanged(type: any) {
    if (type === 'OPT') {
      this.GetSubscriptionList(1);
    }
  }

  onAddOpt() {
    this.optId = '';
    this.OptTitle = 'Create';
  }

  onEditOpt(id: any) {
    this.optId = id;
    this.OptTitle = 'Edit';
  }

  formSubscription = new FormGroup({
    search: new FormControl(''),
  });

  onSearchSubscription(formValue: any) {
    this.GetSubscriptionList(1)
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetSubscriptionList(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formSubscription.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`subscription/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.OptList = res.data;
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
      this.GetSubscriptionList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetSubscriptionList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteSubscription(id);
    }
  }
  onDeleteSubscription(id: number) {
    this.loading = true;
    this.http.delete(`subscription/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Subscription Deleted Successfully");
        this.GetSubscriptionList(this.currentPage);
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.toastr.error(res.error);
        this.loading = false;
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

}