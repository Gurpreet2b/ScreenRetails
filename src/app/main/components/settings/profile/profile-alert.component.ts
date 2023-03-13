import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { ConfirmedValidator } from './confirmed.validator';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-profile-alert',
  templateUrl: './profile-alert.component.html',
  styleUrls: ['./profile-alert.component.css'],
})
export class ProfileAlertComponent implements OnInit {

  public loading = false;
  public submitted = false;
  public ProfileDetails: any = {};
  public form: FormGroup = new FormGroup({});
  public Permission: any = [];
  public RoleName: any;
  public RoleAssign: any = [];

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe,public fb: FormBuilder,
    private authService: AuthService) {
      translate.setDefaultLang(authService.currentLanguage);
    this.form = fb.group({
      old_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required]),
      confirm_password: new FormControl('', [Validators.required])
    },
    { 
      validator: ConfirmedValidator('new_password', 'confirm_password')
    })
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Profile Settings`);
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.RoleName = this.Permission.role;

    this.GetProfileDetails();
  }

  GetProfileDetails() {
    this.loading = true;
    this.http.get(`publishers/get_profile/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.ProfileDetails = res.data;
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    })
  }

  UpdateProfileDetails() {
    this.loading = true;
    const formData = new FormData();
    formData.append('interface_language', this.ProfileDetails.interface_language);
    formData.append('start_page', this.ProfileDetails.start_page);
    this.http.post(`publishers/update_profile/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.toastr.success("Profile Updated Successfully !!");
        this.GetProfileDetails();
        localStorage.setItem("setLanguage", JSON.stringify(this.ProfileDetails.interface_language));
        window.location.reload();
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    })
  }
 
  OnSubmit(): any {
    this.submitted = true;
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }
    const dataToSubmit = { ...this.form.value };
    const formData = new FormData();

    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });
    this.loading = true;
    this.http.post('publishers/change_password/', formData).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res.data;
        this.toastr.success("Change Password Successfully !!");
        this.form.reset();
        this.onDismiss();
        this.loading = false;
      } else {
        this.toastr.warning(res.message);
        this.loading = false;
      }
    }, error => {
      this.loading = false;
      if(error.status === 400) {
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
    const target = "#ChangePasswordModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $('modal-open').remove();
    $("body").removeClass("modal-open");
    $("body").addClass("modal-overflow");
  }

}