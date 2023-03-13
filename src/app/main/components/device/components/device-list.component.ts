import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-device-list',
  templateUrl: './device-list.component.html',
  styleUrls: ['./device-list.component.css'],
})
export class DeviceListComponent implements OnInit {

  public loading = false;
  public deviceId: any;
  public DeviceTitle: any;
  public DeviceList: any = [];
  public currentURL: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, private router: Router,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Digital signage devices`);
    this.GetDeviceList(1);
    this.currentURL = window.location.href;
  }

  dateformat(datas: string) {
    return this.authService.Dateformat(datas);
  }

  Timeformat(time: string) {
    return this.authService.Timeformat(time);
  }


  ValueChanged(type: any) {
    if (type === 'Device') {
      this.GetDeviceList(1);
    }
  }

  onAddDevice() {
    this.deviceId = '';
    this.DeviceTitle = 'Create';
  }

  onEditDevice(id: any) {
    this.deviceId = id;
    this.DeviceTitle = 'Edit';
  }


  formDevice = new FormGroup({
    search: new FormControl(''),
  });

  onSearchDevice(formValue: any) {
    this.GetDeviceList(1);
    this.currentPage = 1;
  }

  GetDeviceList(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formDevice.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`digital_signage/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.DeviceList = res.result;
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

  PageJump: any = 10;
  PageTotalNumber: any = [];
  currentPage: number = 1;
  totalItems: number | undefined;
  onPageChange(event: any, data: any) {
    if (data === '1') {
      this.currentPage = event;
      this.GetDeviceList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetDeviceList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteDigitalSignage(id);
    }
  }
  onDeleteDigitalSignage(id: number) {
    this.loading = true;
    this.http.delete(`digital_signage/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Digital Signage Deleted Successfully");
        this.GetDeviceList(this.currentPage)
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