import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-policies-list',
  templateUrl: './policies-list.component.html',
  styleUrls: ['./policies-list.component.css'],
})
export class PoliciesListComponent implements OnInit {
  public loading = false;
  policiesId: any;
  PoliciesTitle: any;
  PoliciesList: any;


  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Policies`);
    this.GetPoliciesList(1);
  }

  // ValueChanged(type: any) {
  //   if (type === 'Policies') {
  //     this.GetPoliciesList(1);
  //   }
  // }

  // onAddPolicies() {
  //   this.policiesId = '';
  //   this.PoliciesTitle = 'Create';
  // }

  // onEditPolicies(id: any) {
  //   this.policiesId = id;
  //   this.PoliciesTitle = 'Edit';
  // }

  formPolicy = new FormGroup({
    search: new FormControl(''),
  });

  onSearchPolicy(formValue: any) {
    this.GetPoliciesList(1);
    this.currentPage = 1;
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetPoliciesList(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formPolicy.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`policies/dashboard_list/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.totalItems = res.count;
        this.PoliciesList = res.result;
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
      this.GetPoliciesList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetPoliciesList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteSkin(id);
    }
  }
  onDeleteSkin(id: number) {
    this.loading = true;
    this.http.delete(`policies/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Policy Deleted Successfully");
        this.GetPoliciesList(this.currentPage);
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

  GetPolicyDuplicate(policyId: any) {
    this.loading = true;
    this.http.post(`policies/${policyId}/duplicate_policy/`, null).subscribe((res: any) => {
      this.loading = false;
      if (res.status === true) {
        this.GetPoliciesList(1);
        this.toastr.success('Duplicate Created Successfully !!');
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

}