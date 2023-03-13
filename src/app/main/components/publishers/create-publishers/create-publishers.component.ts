import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-create-publishers',
  templateUrl: './create-publishers.component.html',
  styleUrls: ['./create-publishers.component.css'],
})
export class CreatePublishersComponent implements OnInit, OnChanges {

  public loading = false;
  public submitted: true;
  public PolicyList: any = [];

  @Output() valueChange = new EventEmitter();
  @Input() publishersId: any;

  constructor(private http: HttpService,
    private toastr: ToastrService, public translate: TranslateService,
    private activeRoute: ActivatedRoute, private router: Router,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }


  ngOnInit(): void {
    this.GetPolicy();
  }

  ngOnChanges() {
    if (this.publishersId) {
      this.GetPublishersListById();
    } else {
      this.publishersForm.reset();
    }
  }


  publishersForm = this.fb.group({
    name: ['', Validators.required],
    password: ['', Validators.required],
    policy_id: [null, Validators.required],
  })
  get myPublishersForm() {
    return this.publishersForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    this.publishersForm.markAllAsTouched();
    if (!this.publishersForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.publishersForm.value };
    const formData = new FormData();
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });
    this.loading = true;
    if (this.publishersId === '') {
      this.http.post('publishers/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Publishers Added Successfully !!");
          this.publishersForm.reset();
          this.onDismiss();
          this.valueChange.emit('Publishers');
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.warning(res.message);
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
      this.http.patch(`publishers/${this.publishersId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Publishers Updated Successfully !!");
          this.publishersForm.reset();
          this.onDismiss();
          this.valueChange.emit('Publishers');
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.toastr.warning(res.message);
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
    const target = "#CreatePublisherModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
    $("body").addClass("modal-overflow");
  }

  private GetPublishersListById() {
    this.loading = true;
    this.http.get(`publishers/${this.publishersId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.authService.setCurrentUser({ token: res.token });
        this.publishersForm.setValue({
          name: res.result.name,
          password: '',
          policy_id: res.result.policy_id,
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

  GetPolicy() {
    this.loading = true;
    this.http.get(`policies/policies_name_list/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.PolicyList = res.result;
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

}