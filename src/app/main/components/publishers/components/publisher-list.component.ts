import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-publisher-list',
  templateUrl: './publisher-list.component.html',
  styleUrls: ['./publisher-list.component.css'],
})
export class PublisherListComponent implements OnInit {

  public loading = false;
  PublishersList: any;
  publishersId: any;
  PublishersTitle: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public translate: TranslateService,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Publishers`);
    this.GetPublishersList(1);
  }

  dateformat(datas: string) {
    return this.authService.Dateformat(datas);
  }

  Timeformat(time: string) {
    return this.authService.Timeformat(time);
  }

  ValueChanged(type: any) {
    if (type === 'Publishers') {
      this.GetPublishersList(1);
    }
  }

  onAddPublishers() {
    this.publishersId = '';
    this.PublishersTitle = 'Add';
  }

  onEditPublishers(id: any) {
    this.publishersId = id;
    this.PublishersTitle = 'Edit';
  }

  formPublisher = new FormGroup({
    search: new FormControl(''),
  });

  onSearchPublisher(formValue: any) {
    this.GetPublishersList(1);
    this.currentPage = 1;
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetPublishersList(page: number) {
    this.loading = true;
    const formData = new FormData();
    const formValue = this.formPublisher.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`publishers/dashboard_list/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.totalItems = res.count;
        this.PublishersList = res.result;
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
      this.GetPublishersList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetPublishersList(this.currentPage)
    }
  }

  GetPublisherEnable(publisherId: any, data: any) {
    this.loading = true;
    this.http.post(`publishers/${publisherId}/enable_disable_publisher/`, null).subscribe((res: any) => {
      this.loading = false;
      if (res.status === true) {
        this.GetPublishersList(1);
        this.authService.setCurrentUser({ token: res.token });
        if (data === 'Enabled') {
          this.toastr.success('publisher Enabled Successfully !!');
        } else {
          this.toastr.success('publisher Disabled Successfully !!');
        }

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
      this.onDeleteSkin(id);
    }
  }
  onDeleteSkin(id: number) {
    this.loading = true;
    this.http.delete(`publishers/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Publishers Deleted Successfully");
        this.GetPublishersList(this.currentPage);
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

}