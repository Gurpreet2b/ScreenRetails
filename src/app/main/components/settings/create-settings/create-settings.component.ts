import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-settings',
  templateUrl: './create-settings.component.html',
  styleUrls: ['./create-settings.component.css'],
})
export class CreateSettingsComponent implements OnInit {

  public loading = false;
  public submitted: true;
  @Output() valueChange = new EventEmitter();
  @Input() languageId: any;

  constructor(private http: HttpService,
    private toastr: ToastrService,
    private activeRoute: ActivatedRoute,public translate: TranslateService,
    private dtPipe: DatePipe,public fb: FormBuilder,
    private authService: AuthService) {
      translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.languageId) {
      this.GetLanguageListById();
    } else {
      this.languageForm.reset();
    }
  }


  languageForm = this.fb.group({
    name: ['', Validators.required],
    code: ['', Validators.required],
  })
  get mylanguageForm() {
    return this.languageForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    this.languageForm.markAllAsTouched();
    if (!this.languageForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.languageForm.value };
    const formData = new FormData();
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });
    this.loading = true;
    if (this.languageId === '') {
      this.http.post('alert_language_settings/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Language Added Successfully !!");
          this.languageForm.reset();
          this.onDismiss();
          this.valueChange.emit('Language');
          this.loading = false;
        } else {
          this.toastr.error(res.error);
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
    } else {
      this.http.patch(`alert_language_settings/${this.languageId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Language Updated Successfully !!");
          this.languageForm.reset();
          this.onDismiss();
          this.valueChange.emit('Language');
          this.loading = false;
        } else {
          this.toastr.error(res.error);
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

  }
  onDismiss() {
    const target = "#CreateLanguageModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
    $("body").addClass("modal-overflow");
  }

  private GetLanguageListById() {
    this.loading = true;
    this.http.get(`alert_language_settings/${this.languageId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.languageForm.setValue({
          name: res.result.name,
          code: res.result.code
        });
      } else {
        this.loading = false;
        this.toastr.warning(res.message);
      }
    })
  }

}