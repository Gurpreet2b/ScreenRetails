import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-device',
  templateUrl: './create-device.component.html',
  styleUrls: ['./create-device.component.css'],
})
export class CreateDeviceComponent implements OnInit, OnChanges {

  public loading = false;
  public submitted = false;

  @Output() valueChange = new EventEmitter();
  @Input() deviceId: any;

  constructor(private http: HttpService,
    private toastr: ToastrService, private router: Router,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Digital signage devices`);
  }

  ngOnChanges() {
    if (this.deviceId) {
      this.GetDeviceListById();
    } else {
      this.deviceForm.reset();
    }
  }

  // Create Device All function Start

  deviceForm = this.fb.group({
    name: ['', Validators.required],
    unique_code: [''],
    refresh_time: [''],
    refresh_time_choice: [''],
  })

  // Getter method to access formcontrols
  get myDeviceForm() {
    return this.deviceForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    this.deviceForm.markAllAsTouched();
    if (!this.deviceForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.deviceForm.value };
    const formData = new FormData();
    formData.append('link', dataToSubmit.name);
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.deviceId === '') {
      this.http.post('digital_signage/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Device Added Successfully !!");
          this.deviceForm.reset();
          this.onDismiss();
          this.valueChange.emit('Device');
          this.loading = false;
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
    } else {
      this.http.patch(`digital_signage/${this.deviceId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Device Updated Successfully !!");
          this.deviceForm.reset();
          this.onDismiss();
          this.valueChange.emit('Device');
          this.loading = false;
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

  onDismiss() {
    const target = "#DeviceModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
    $("body").addClass("modal-overflow");
  }

  // Create Device All function End

  // Device List By Id Function 
  private GetDeviceListById() {
    this.loading = true;
    this.http.get(`digital_signage/${this.deviceId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.deviceForm.setValue({
          name: res.data.name,
          unique_code: res.data.unique_code,
          refresh_time: res.data.refresh_time,
          refresh_time_choice: res.data.refresh_time_choice,
        });
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    }, error => {
      if (error.error.code === 'token_not_valid') {
        this.authService.logout();
        this.router.navigate(['/signin']);
        this.loading = false;
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

}