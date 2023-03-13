import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import * as $ from 'jquery';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-multiple-alert',
  templateUrl: './multiple-alert.component.html',
  styleUrls: ['./multiple-alert.component.css'],
})
export class MultipleAlertComponent implements OnInit {

  public loading = false;
  public submitted = false;
  public SkinList: any = [];
  public SkinId: any;
  public HeaderBorder: any = '#00838f';
  public Think: any = 5;
  public HeaderLogo: any = 'left';
  public FooterLogo: any = 'left';
  public FooterBgColor: any;
  public footerColor: any;
  public FooterFontSize: any;
  public FooterText: any;
  public picture: File | undefined;
  public MultiAlertImageList: any = [];

  constructor(private http: HttpService,
    private toastr: ToastrService, private router: Router,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService) {
      translate.setDefaultLang(authService.currentLanguage);
  }
  htmlContent = '';

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '15rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    outline: true,
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    
  };

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Create Multiple Alert`);
    this.GetSkinList();
  }

    // Image File Upload functionality Start

    OnFileImageModel(){
      this.GetImageDatebase(1);
    }
  
    UploadImageDatebase() {
      this.loading = true;
      const formData = new FormData();
      formData.append('image', this.picture);
      this.http.post(`image_database/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res;
          this.GetImageDatebase(1);
          this.loading = false;
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
  
    formImageMultiAlert = new FormGroup({
      search: new FormControl(''),
    });
  
    onSearchImageMultiAlert(formValue: any) {
      this.GetImageDatebase(1)
    }
  
    GetImageDatebase(page: number) {
      this.loading = true;
  
      const formData = new FormData();
      const formValue = this.formImageMultiAlert.value;
      const search = formValue.search || '';
      formData.append('search', search);
  
      let params = new HttpParams();
      params = params.append('page', page.toString())
      this.http.get(`image_database/?search=${search}`, null,{ params: params }).subscribe((res: any) => {
        const responseData = res;
  
        if (res.status === true) {
          this.totalItemsImage = responseData.count;
          this.MultiAlertImageList = res.data;
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.loading = false;
          this.toastr.warning(res.message);
        }
        this.PageTotalNumberImage = [];
        let Count = responseData.count / 10;
        for (let i = 0; i < Count; i += this.PageJumpImage) {
          this.PageTotalNumberImage.push(i);
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
  
    PageJumpImage: any = 10;
    PageTotalNumberImage: any = [];
    currentPageImage: number = 1;
    totalItemsImage: number | undefined;
    onPageImageChange(event: any, data: any) {
      if (data === '1') {
        this.currentPageImage = event;
        this.GetImageDatebase(event)
      } else {
        this.currentPageImage = Number(event.target.value);
        this.GetImageDatebase(this.currentPageImage)
      }
    }
  
    deleteImage(id: number) {
      if (confirm('Are you sure delete this record?')) {
        this.onDeleteImageMultiAlert(id);
      }
    }
    onDeleteImageMultiAlert(id: number) {
      this.loading = true;
      this.http.delete(`image_database/${id}/`).subscribe((res: any) => {
        if (res.status === true) {
          this.toastr.success("Image Deleted Successfully");
          this.GetImageDatebase(this.currentPageImage);
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
  
    ImageUrlSelected: any = '';
    SelectedName: any = '';
    IsImageUrlSelected(url: any) {
      this.ImageUrlSelected = url.image.full;
      this.SelectedName = url.name
      this.onDismissImage();
    }
  
    onDismissImage() {
      const target = "#FileUploadMultiImageModal";
      $(target).hide();
      $('.modal-backdrop').remove();
      $("body").removeClass("modal-open");
      $("body").addClass("modal-overflow");
    }
  
    // Image File Upload functionality End

  multipleAlertForm = this.fb.group({
    compaign: ['', Validators.required],
    simple_sending: [''],
    group_sending: [''],
    high_priority: [''],
    acknowledgement_required: [''],
    unobtrusive: [''],
    self_distructive: [''],
    auto_close: [''],
    auto_close_time: [''],
    allow_manual_close: [''],
    lifetime_given: [''],
    lifetime: [''],
    lifetime_option: [''],
    add_print_button: [''],
    allow_feedback: [''],
    width: [''],
    height: [''],
    position: [''],
    resizable: [''],
    fullscreen: [''],
    device_type: [''],
  })  

  // Getter method to access formcontrols
  get MultiAlertForm() {
    return this.multipleAlertForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    this.multipleAlertForm.markAllAsTouched();
    if (!this.multipleAlertForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.multipleAlertForm.value};
    const formData = new FormData();
    // formData.append('group_list', this.IsSelectedGroupList);
    // formData.append('auto_sync_seconds_gap', this.AutoSyncSecondsGap);
    formData.append('skin', this.SkinId);
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    this.http.post('popupalert/', formData).subscribe((res: any) => {
      if(res.status === true) {
        const responseData = res.data;
        this.toastr.success("Multiple Alerts Added Successfully !!");
        this.multipleAlertForm.reset();
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

  onSelectFile(event: any) {
    const file = event.target.files[0];
    if(file.size > '1048576'){
      this.toastr.warning("File size cannot be larger than 1MB!");
      return;
    } else{
      this.picture = file;
    }
  }

  IsColorValue: any;
  IsColorChange(event: any){
    this.IsColorValue = event.target.value;
    this.SkinId = event.target.value;
    if (this.SkinId) {
      this.GetSkinListById();
    }
  }

  // Skin List All Data
  GetSkinList() {
    this.loading = true;
    this.http.get(`skins/`, null).subscribe((res: any) => {
    if (res.status === true) {
        const responseData = res;
        this.SkinList = res.data;
        this.loading = false;
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

  // Skin List By Id Data
  private GetSkinListById() {
    this.loading = true;
    this.http.get(`skins/${this.SkinId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.Think = res.data.border_thickness;
        this.HeaderBorder = res.data.border_color;
        this.HeaderLogo = res.data.team_image_align;

        this.FooterLogo = res.data.footer_align;
        this.FooterBgColor = res.data.footer_background_color;
        this.footerColor = res.data.footer_text_color;
        this.FooterFontSize = res.data.footer_font_size;
        this.FooterText = res.data.footer_text;
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