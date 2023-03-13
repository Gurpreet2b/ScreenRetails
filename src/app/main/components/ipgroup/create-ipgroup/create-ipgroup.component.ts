import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-ipgroup',
  templateUrl: './create-ipgroup.component.html',
  styleUrls: ['./create-ipgroup.component.css'],
})
export class CreateIpgroupComponent implements OnInit, OnChanges {

  public loading = false;
  // ipgroupId: any;
  submitted: boolean;
  //valueChange: any;

  @Output() valueChange = new EventEmitter();
  @Input() ipgroupId: any;

  constructor(private http: HttpService,
    private toastr: ToastrService, private router: Router,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.ipgroupId) {
      this.GetIpgroupListById();
    } else {
      this.ipgroupForm.reset();
    }
  }

  ipgroupForm = this.fb.group({
    name: ['', Validators.required],
  })
  get myIpgroupForm() {
    return this.ipgroupForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    this.ipgroupForm.markAllAsTouched();
    if (!this.ipgroupForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.ipgroupForm.value };
    const formData = new FormData();
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });
    this.loading = true;
    if (this.ipgroupId === '') {
      this.http.post('lockscreenalert/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Ipgroup Added Successfully !!");
          this.ipgroupForm.reset();
          this.onDismiss();
          this.valueChange.emit('Ipgroup');
          this.loading = false;
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
    } else {
      this.http.patch(`lockscreen/${this.ipgroupId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Ipgroup Updated Successfully !!");
          this.ipgroupForm.reset();
          this.onDismiss();
          this.valueChange.emit('Ipgroup');
          this.loading = false;
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

  onDismiss() {
    const target = "#CreateIpgroupModal";
    $(target).hide();
    $('.modal-backdrop').remove();
  }

  GetIpgroupListById() {
    this.loading = true;
    this.http.get(`lockscreenalert/${this.ipgroupId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
        this.ipgroupForm.setValue({
          name: res.data.name,
        });
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
        this.toastr.error(error);
        this.loading = false;
      }
    });
  }

}