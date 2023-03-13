import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-opt',
  templateUrl: './create-opt.component.html',
  styleUrls: ['./create-opt.component.css'],
})
export class CreateOPTComponent implements OnInit, OnChanges {
  public loading = false;
  submitted: true;
  @Output() valueChange = new EventEmitter();
  @Input() optId: any;

  constructor(private http: HttpService,
    private toastr: ToastrService, private router: Router,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }
  ngOnInit(): void {
    // this.authService.SetRestaurantName(`OPT List`);
  }
  ngOnChanges() {
    if (this.optId) {
      this.GetOptListById();
    } else {
      this.optForm.reset();
    }
  }
  optForm = this.fb.group({
    name: ['', Validators.required],
  })
  get myOptForm() {
    return this.optForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    this.optForm.markAllAsTouched();
    if (!this.optForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.optForm.value };
    const formData = new FormData();
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });
    this.loading = true;
    if (this.optId === '') {
      this.http.post('subscription/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Subscription Added Successfully !!");
          this.optForm.reset();
          this.onDismiss();
          this.valueChange.emit('OPT');
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
      this.http.patch(`subscription/${this.optId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Subscription Updated Successfully !!");
          this.optForm.reset();
          this.onDismiss();
          this.valueChange.emit('OPT');
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
    const target = "#CreateOPTModal";
    $(target).hide();
    $('.modal-backdrop').remove();
  }

  private GetOptListById() {
    this.loading = true;
    this.http.get(`subscription/${this.optId}`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
        this.optForm.setValue({
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

