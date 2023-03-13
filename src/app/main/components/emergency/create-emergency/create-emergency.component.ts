import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-emergency',
  templateUrl: './create-emergency.component.html',
  styleUrls: ['./create-emergency.component.css'],
})
export class CreateEmergencyComponent implements OnInit, OnChanges {

  public loading = false;
  public submitted: true;

  @Output() valueChange = new EventEmitter();
  @Input() colorCodeId: any;

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
    if (this.colorCodeId) {
      this.GetEmergencyListById();
    } else {
      this.colorCodeForm.reset();
    }
  }

  colorCodeForm = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required]
  })
  get myEmergencyForm() {
    return this.colorCodeForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    this.colorCodeForm.markAllAsTouched();
    if (!this.colorCodeForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.colorCodeForm.value };
    const formData = new FormData();
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });
    this.loading = true;
    if (this.colorCodeId === '') {
      this.http.post('color_code/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Color Code Added Successfully !!");
          this.colorCodeForm.reset();
         
          this.onDismiss();
          this.valueChange.emit('colorCode');
          this.loading = false;
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
    } else {
      this.http.patch(`color_code/${this.colorCodeId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Color Code Updated Successfully !!");
          this.colorCodeForm.reset();
          this.onDismiss();
          this.valueChange.emit('colorCode');
          this.loading = false;
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

  onDismiss() {
    const target = "#CreateColorCodeModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
    $("body").addClass("modal-overflow");
  }

  private GetEmergencyListById() {
    this.loading = true;
    this.http.get(`color_code/${this.colorCodeId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
        this.colorCodeForm.setValue({
          name: res.data.name,
          code: res.data.code,
        });
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
