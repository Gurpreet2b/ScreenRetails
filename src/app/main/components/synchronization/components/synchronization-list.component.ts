import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
@Component({
  selector: 'app-synchronization-list',
  templateUrl: './synchronization-list.component.html',
  styleUrls: ['./synchronization-list.component.css'],
})
export class SynchronizationListComponent implements OnInit {
  public loading = false;
  SynchronizationList: any = [];
  synchronizationId: any;
  SyncTitle: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }
  ngOnInit(): void {
    this.authService.SetRestaurantName(`Synchronizations`);
    this.GetSynchronizationList(1);
  }

  // ValueChanged(type: any) {
  //   if (type === 'Synchronization') {
  //     this.GetSynchronizationList(1);
  //   }
  // }

  formSynchronization = new FormGroup({
    search: new FormControl(''),
  });

  onSearchSynchronization(formValue: any) {
    this.GetSynchronizationList(1);
    this.currentPage = 1;
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetSynchronizationList(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formSynchronization.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`synchronization/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.SynchronizationList = res.data;
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
      this.GetSynchronizationList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetSynchronizationList(this.currentPage)
    }
  }

  GetSynchronizationSync(SyncId: any) {
    this.loading = true;
    this.http.get(`synchronization/${SyncId}/sync`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        // this.GetSynchronizationList(1);
        this.toastr.success(res.message);
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

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteSynchronization(id);
    }
  }
  onDeleteSynchronization(id: number) {
    this.loading = true;
    this.http.delete(`synchronization/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Synchronization Deleted Successfully");
        this.GetSynchronizationList(1);
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

}