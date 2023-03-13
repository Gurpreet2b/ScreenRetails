import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';

@Component({
  selector: 'app-device-alert',
  templateUrl: './device-alert.component.html',
  styleUrls: ['./device-alert.component.css'],
})
export class DeviceAlertComponent implements OnInit {
  public loading = false;
  public DigitalAlertList: any = [];
  public DigitalAlertTicker: any = [];
  public HeaderTextImg: any = '/assets/img/deva-logo.png';
  public DateTimePopup = new Date();

  public Permission: any = [];
  public RoleAssign: any = [];
  public RoleName: any;
  public DeviceName: any;
  public SetInterval: any = 1;
  public DigitalTime: any = 30;
  public ShowSlideImage: any = 0;
  public Uuid: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,
    private dtPipe: DatePipe, private router : Router,
    private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Digital Alert`);
    this.Uuid = this.authService.getUuid();
    if (!this.Uuid) {
      this.GetUid();
    } else {
      this.DeviceName =  this.activeRoute.snapshot.params['type'];
      this.GetDigitalAlertList();
      this.Permission = this.authService.getPermission();
      this.RoleAssign = JSON.parse(this.Permission.access_control_list);
      this.RoleName = this.Permission.role;
      
      // this.SetInterval = setInterval(() => {
      //   this.GetDigitalAlertList();
      // }, Number(this.DigitalTime) * 1000);
    }
  }

  openNav() {
    document.getElementById("myNav").style.width = "20%";
  }

  closeNav(){
    document.getElementById("myNav").style.width = "0%";
  }

  OnReloadAlert(){
    this.GetDigitalAlertList();
  }

  GetDigitalAlertList() {
    this.loading = true;

    this.http.get(`digital_signage/user_polling_list/?unique_code=${this.Uuid}`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {

        this.DigitalAlertList = res.data.scroller_media;

        let index = 0
        if (this.DigitalAlertList.length > 0) {
            this.SetInterval = setInterval(() => {
              if (index === this.DigitalAlertList.length-1){
                index = 0;
              }
              else{
                index = index + 1;
              }
            this.ShowSlideImage = index;
          }, Number(this.DigitalAlertList[index].total_seconds) * 1000);
        }
        this.DigitalAlertTicker = res.data.ticker_alerts;
        this.DigitalTime = res.data.time_seconds;
        this.loading = false;
        
        
        // for (let i = 0; i < this.DigitalAlertList.length; i++) {
        //   const element = this.DigitalAlertList[i];
        //   document.getElementById("digital-body-text").innerHTML = element.body;
        // }
      } else {
        this.loading = false;
        // this.toastr.warning(res.message);
      }
    }, error => {
      this.loading = false;
      // if(error.status === 400) {
      //   this.toastr.error("Server Bad Request");
      // } else if(error.status === 403) {
      //   this.toastr.error("Forbidden Error");
      // } else if(error.status === 404) {
      //   this.toastr.error("Server not Found");
      // } else if(error.status === 500) {
      //   this.toastr.error("Internal Server Error");
      // } else {
      //   this.toastr.error("Server not reachable");
      //   this.loading = false;
      // }
    });
  }

  onCloseAlert(item: any) {
    this.loading = true;
    const formData = new FormData();
    formData.append('name', this.DeviceName);
    formData.append('alert_type', item.alert_type);
    this.http.post(`digital_signage/${item.id}/close_alert/`, formData).subscribe((res: any) => {
      if(res.status === true) {
        // this.toastr.success(res.message);
        this.GetDigitalAlertList();
      } else {
        // this.toastr.error(res.message);
        this.loading = false;
      }
    }, error => {
      this.loading = false;
      // if(error.status === 400) {
      //   this.toastr.error("Server Bad Request");
      // } else if(error.status === 403) {
      //   this.toastr.error("Forbidden Error");
      // } else if(error.status === 404) {
      //   this.toastr.error("Server not Found");
      // } else if(error.status === 500) {
      //   this.toastr.error("Internal Server Error");
      // } else {
      //   this.toastr.error("Server not reachable");
      //   this.loading = false;
      // }
    });
  }

  GetUid() {
    this.loading = true;
    this.http.post(`uuid/`, null).subscribe((res: any) => {
      if(res.status === true) {
        this.Uuid = res.uid;
        this.authService.setUuid(res.uid);
      } else {
        // this.toastr.error(res.message);
        this.loading = false;
      }
    }, error => {
      this.loading = false;
      // if(error.status === 400) {
      //   this.toastr.error("Server Bad Request");
      // } else if(error.status === 403) {
      //   this.toastr.error("Forbidden Error");
      // } else if(error.status === 404) {
      //   this.toastr.error("Server not Found");
      // } else if(error.status === 500) {
      //   this.toastr.error("Internal Server Error");
      // } else {
      //   this.toastr.error("Server not reachable");
      //   this.loading = false;
      // }
    });
  }

}