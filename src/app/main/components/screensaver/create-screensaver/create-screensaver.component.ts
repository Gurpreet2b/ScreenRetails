import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { HttpParams } from '@angular/common/http';
import * as $ from 'jquery';

@Component({
  selector: 'app-create-screensaver',
  templateUrl: './create-screensaver.component.html',
  styleUrls: ['./create-screensaver.component.css'],
})
export class CreateScreensaverComponent implements OnInit {

  public loading = false;
  public submitted = false;
  public picture: File | undefined;
  public ScreenSaverPicture: File | undefined;
  public VideoScreenSaverPicture: File | undefined;
  public PPTScreenSaverUrl: any;
  public VideoScreenSaverUrl: any;
  public ImageScreenSaverUrl: any;
  public AlertId: any;
  public AlertType: any;
  public IsActivePptAlert: any = false;
  public IsActiveImageAlert: any = false;
  public IsActiveVideoAlert: any = false;
  public IsActiveHTMLAlert: any = false;
  public ScreenSaverEdit: any;
  public ScreenSaverEditId: any;

  public ScreenSaverVideoList: any = [];
  public ScreenSaverImageList: any = [];

  Vconfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '15rem',
    maxHeight: '15rem',
    placeholder: '',

    translate: 'no',
    sanitize: false,
    outline: true,
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
  };

  constructor(private http: HttpService,
    private toastr: ToastrService, private router: Router,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Create Screensaver`);
    this.AlertId = this.activeRoute.snapshot.params['id'] || 0;
    this.AlertType = this.activeRoute.snapshot.params['type'] || '';
    this.ScreenSaverEdit = this.activeRoute.snapshot.params['edit'] || '';

    if (this.AlertType === 'ppt') {
      this.IsActivePptAlert = true;
      this.GetPowerPointAlertById();
    } else if (this.AlertType === 'image') {
      this.IsActivePptAlert = '';
      this.IsActiveImageAlert = true;
      this.GetImageAlertById();
    } else if (this.AlertType === 'video') {
      this.IsActivePptAlert = '';
      this.IsActiveVideoAlert = true;
      this.GetVideoAlertById();
    } else if (this.AlertType === 'html') {
      this.IsActivePptAlert = '';
      this.IsActiveHTMLAlert = true;
      this.GetHtmlAlertById();
    } else {
      this.IsActivePptAlert = true;
    }
  }

  dateformat(datas: string) {
    return this.authService.Dateformat(datas);
  }

  Timeformat(time: string) {
    return this.authService.Timeformat(time);
  }

  // Image File Upload functionality Start

  OnFileImageModel(){
    this.GetImageDatebase(1);
  }

  UploadImageDatebase() {
    this.loading = true;
    const formData = new FormData();
    formData.append('image', this.ScreenSaverPicture);
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

  formImageScreenSaver = new FormGroup({
    search: new FormControl(''),
  });

  onSearchImageScreenSaver(formValue: any) {
    this.GetImageDatebase(1)
  }

  GetImageDatebase(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formImageScreenSaver.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`image_database/?search=${search}`, null,{ params: params }).subscribe((res: any) => {
      const responseData = res;

      if (res.status === true) {
        this.totalItemsImage = responseData.count;
        this.ScreenSaverImageList = res.data;
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
      this.onDeleteImageScreenSaver(id);
    }
  }
  onDeleteImageScreenSaver(id: number) {
    this.loading = true;
    this.http.delete(`image_database/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Image Deleted Successfully");
        this.GetImageDatebase(this.currentPageImage);
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

  ImageUrlSelected: any = '';
  IsImageUrlSelected(url: any) {
    this.ImageUrlSelected = url.image.full;
    this.ScreensaverUrl = url.image.full;
    this.SelectedName = url.name
    this.onDismissImage();
  }

  onDismissImage() {
    const target = "#FileUploadImageModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
  }

  // Image File Upload functionality End

  // Video File Upload functionality Start

  OnFileVideoModel(){
    this.GetVideoDatebase(1);
  }

  UploadVideoDatebase() {
    this.loading = true;
    const formData = new FormData();
    formData.append('video', this.picture);
    this.http.post(`video_database/`, formData).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res;
        this.GetVideoDatebase(1);
        this.loading = false;
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
        this.toastr.error(error);
        this.loading = false;
      }
    });
  }

  formVideoScreenSaver = new FormGroup({
    search: new FormControl(''),
  });

  onSearchVideoScreenSaver(formValue: any) {
    this.GetVideoDatebase(1)
  }

  GetVideoDatebase(page: number) {
    this.loading = true;

    const formData = new FormData();
    const formValue = this.formVideoScreenSaver.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`video_database/?search=${search}`, null,{ params: params }).subscribe((res: any) => {
      const responseData = res;

      if (res.status === true) {
        this.totalItems = responseData.count;
        this.ScreenSaverVideoList = res.data;
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

  PageJump: any = 10;
  PageTotalNumber: any = [];
  currentPage: number = 1;
  totalItems: number | undefined;
  onPageChange(event: any, data: any) {
    if (data === '1') {
      this.currentPage = event;
      this.GetVideoDatebase(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetVideoDatebase(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteScreenSaver(id);
    }
  }
  onDeleteScreenSaver(id: number) {
    this.loading = true;
    this.http.delete(`video_database/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Video Deleted Successfully");
        this.GetVideoDatebase(this.currentPage);
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

  VideoUrlSelected: any = '';
  IsVideoUrlSelected(url: any) {
    this.VideoUrlSelected = url.video;
    this.onDismissVideo();
  }

  onDismissVideo() {
    const target = "#FileUploadModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
  }

  // Video File Upload functionality End

  // Import Power Point Created functionality Start

  powerPointForm = this.fb.group({
    name: ['', Validators.required],
    video: [''],
    display_time: ['60'],
    scheduled: [false],
    start_date_time: [''],
    end_date_time: [''],
  })

  // Getter method to access formcontrols
  get myPowerPointForm() {
    return this.powerPointForm.controls;
  }

  OnSubmit(val: any) {
    this.submitted = true;
    this.powerPointForm.markAllAsTouched();
    if (!this.powerPointForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.powerPointForm.value };
    const formData = new FormData();
    formData.append('content_type', 'ppt');
    formData.append('video', this.VideoUrlSelected);
    // formData.append('video_url', this.PPTScreenSaverUrl)
    // if (this.picture) {
    //   formData.append('video', this.picture);
    // } else {
    //   formData.append('video', '');
    // }
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.ScreenSaverEdit === '') {
      this.http.post('screensaveralert/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Power Point Added Successfully !!");
          this.powerPointForm.reset();
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
          if (val === 'next') {
            this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else {
            this.router.navigate([`/screensaver/draft`]);
          }
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
      this.http.patch(`screensaveralert/${this.ScreenSaverEditId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Power Point Updated Successfully !!");
          this.powerPointForm.reset();
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
          if (val === 'next') {
            this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else {
            this.router.navigate([`/screensaver/draft`]);
          }
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

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file.size > '5242880') {
      this.toastr.warning("File size cannot be larger than 5MB!");
      return;
    } else {
      this.picture = file;
    }
  }

  // Power Point Alert Get By ID 
  GetPowerPointAlertById() {
    this.loading = true;
    this.http.get(`screensaveralert/${this.AlertId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.ScreenSaverEditId = res.data.id;
        let StartDate = this.dtPipe.transform(res.data.start_date_time, 'yyyy-MM-ddTHH:mm');
        let EndDate = this.dtPipe.transform(res.data.end_date_time, 'yyyy-MM-ddTHH:mm');
        this.PPTScreenSaverUrl = res.data.video;
        this.VideoUrlSelected = res.data.video;
        this.authService.setCurrentUser({ token: res.token });
        this.powerPointForm.setValue({
          name: res.data.name,
          video: res.data.video,
          display_time: res.data.display_time,
          scheduled: res.data.scheduled,
          start_date_time: StartDate,
          end_date_time: EndDate,
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

  // Import Power Point Created functionality End

  // Import Screensaver Created functionality Start

  ScreensaverForm = this.fb.group({
    name: ['', Validators.required],
    image: [''],
    display_time: ['60'],
    scheduled: [false],
    start_date_time: [''],
    end_date_time: [''],
  })

  // Getter method to access formcontrols
  get myScreensaverForm() {
    return this.ScreensaverForm.controls;
  }

  OnSubmitScreenSaver(val: any) {
    this.submitted = true;
    this.ScreensaverForm.markAllAsTouched();
    if (!this.ScreensaverForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.ScreensaverForm.value };
    const formData = new FormData();
    formData.append('content_type', 'image');
    formData.append('image', this.ImageUrlSelected);
    // formData.append('image_url', this.ImageScreenSaverUrl)
    // if (this.ScreenSaverPicture) {
    //   formData.append('image', this.ScreenSaverPicture);
    // } else {
    //   formData.append('image', '');
    // }
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.ScreenSaverEdit === '') {
      this.http.post('screensaveralert/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("ScreenSaver Added Successfully !!");
          this.ScreensaverForm.reset();
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
          // this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          if (val === 'next') {
            this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else {
            this.router.navigate([`/screensaver/draft`]);
          }
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
      this.http.patch(`screensaveralert/${this.ScreenSaverEditId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("ScreenSaver Updated Successfully !!");
          this.ScreensaverForm.reset();
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
          // this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          if (val === 'next') {
            this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else {
            this.router.navigate([`/screensaver/draft`]);
          }
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

  public ScreensaverUrl: any;
  public SelectedName: any;
  public SelectedSize: any;
  onFileScreensaverChange(event: any) {
    const file = event.target.files[0];
    if (file.size > '2097152') {
      this.toastr.warning("File size cannot be larger than 2MB!");
      return;
    } else {
      this.ScreenSaverPicture = file;
    }
    // this.SelectedName = event.target.files[0].name;
    // let SelectedSize = event.target.files[0].size / 1024;
    // this.SelectedSize = SelectedSize;
    // if (file) {
    //   var reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   reader.onload = (event) => {
    //     this.ScreensaverUrl = (<FileReader>event.target).result;
    //   };
    // }
  }

  // ScreenSaver Image Alert Get By ID 
  GetImageAlertById() {
    this.loading = true;
    this.http.get(`screensaveralert/${this.AlertId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.ScreenSaverEditId = res.data.id;
        let StartDate = this.dtPipe.transform(res.data.start_date_time, 'yyyy-MM-ddTHH:mm');
        let EndDate = this.dtPipe.transform(res.data.end_date_time, 'yyyy-MM-ddTHH:mm');
        this.ImageScreenSaverUrl = res.data.image;
        this.ScreensaverUrl = res.data.image;
        this.authService.setCurrentUser({ token: res.token });
        this.ScreensaverForm.setValue({
          name: res.data.name,
          image: res.data.image,
          display_time: res.data.display_time,
          scheduled: res.data.scheduled,
          start_date_time: StartDate,
          end_date_time: EndDate,
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

  // Import Screensaver Created functionality End

  // Import Video Screensaver Created functionality Start

  VideoScreensaverForm = this.fb.group({
    name: ['', Validators.required],
    video: [''],
    display_time: ['60'],
    scheduled: [false],
    start_date_time: [''],
    end_date_time: [''],
  })

  // Getter method to access formcontrols
  get myVideoScreensaverForm() {
    return this.VideoScreensaverForm.controls;
  }

  OnSubmitVideoScreenSaver(val: any) {
    this.submitted = true;
    this.VideoScreensaverForm.markAllAsTouched();
    if (!this.VideoScreensaverForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.VideoScreensaverForm.value };
    const formData = new FormData();
    formData.append('content_type', 'video');
    formData.append('video', this.VideoUrlSelected);
    // formData.append('video_url', this.VideoScreenSaverUrl)
    // if (this.VideoScreenSaverPicture) {
    //   formData.append('video', this.VideoScreenSaverPicture);
    // } else {
    //   formData.append('video', '');
    // }
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.ScreenSaverEdit === '') {
      this.http.post('screensaveralert/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("ScreenSaver Video Added Successfully !!");
          this.VideoScreensaverForm.reset();
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
          // this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          if (val === 'next') {
            this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else {
            this.router.navigate([`/screensaver/draft`]);
          }
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
      this.http.patch(`screensaveralert/${this.ScreenSaverEditId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("ScreenSaver Video Updated Successfully !!");
          this.VideoScreensaverForm.reset();
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
          // this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          if (val === 'next') {
            this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else {
            this.router.navigate([`/screensaver/draft`]);
          }
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

  // onFileVideoScreensaverChange(event: any) {
  //   const file = event.target.files[0];
  //   if (file.size > '2097152') {
  //     this.toastr.warning("File size cannot be larger than 2MB!");
  //     return;
  //   } else {
  //     this.VideoScreenSaverPicture = file;
  //   }
  // }

  // ScreenSaver Video Alert Get By ID 
  GetVideoAlertById() {
    this.loading = true;
    this.http.get(`screensaveralert/${this.AlertId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.ScreenSaverEditId = res.data.id;
        let StartDate = this.dtPipe.transform(res.data.start_date_time, 'yyyy-MM-ddTHH:mm');
        let EndDate = this.dtPipe.transform(res.data.end_date_time, 'yyyy-MM-ddTHH:mm');
        this.VideoScreenSaverUrl = res.data.video;
        this.VideoUrlSelected = res.data.video;
        this.authService.setCurrentUser({ token: res.token });
        this.VideoScreensaverForm.setValue({
          name: res.data.name,
          video: res.data.video,
          display_time: res.data.display_time,
          scheduled: res.data.scheduled,
          start_date_time: StartDate,
          end_date_time: EndDate,
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

  // Import Video Screensaver Created functionality End

  // Import HTML Screensaver Created functionality Start

  htmlScreensaverForm = this.fb.group({
    name: ['', Validators.required],
    html: ['', Validators.required],
    display_time: ['60'],
    scheduled: [false],
    start_date_time: [''],
    end_date_time: [''],
  })

  // Getter method to access formcontrols
  get myHtmlScreensaverForm() {
    return this.htmlScreensaverForm.controls;
  }

  OnSubmitHtmlScreenSaver(val: any) {
    this.submitted = true;
    this.htmlScreensaverForm.markAllAsTouched();
    if (!this.htmlScreensaverForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.htmlScreensaverForm.value };
    const formData = new FormData();
    formData.append('content_type', 'html');
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.ScreenSaverEdit === '') {
      this.http.post('screensaveralert/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("ScreenSaver HTML/Multimedia Added Successfully !!");
          this.htmlScreensaverForm.reset();
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
          // this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          if (val === 'next') {
            this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else {
            this.router.navigate([`/screensaver/draft`]);
          }
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
      this.http.patch(`screensaveralert/${this.ScreenSaverEditId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("ScreenSaver HTML/Multimedia Updated Successfully !!");
          this.htmlScreensaverForm.reset();
          this.loading = false;
          this.authService.setCurrentUser({ token: res.token });
          // this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          if (val === 'next') {
            this.router.navigate([`/screensaver/send-user/${responseData.id}/${responseData.alert_type}`]);
          } else {
            this.router.navigate([`/screensaver/draft`]);
          }
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

  // ScreenSaver HTML Alert Get By ID 
  GetHtmlAlertById() {
    this.loading = true;
    this.http.get(`screensaveralert/${this.AlertId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.ScreenSaverEditId = res.data.id;
        let StartDate = this.dtPipe.transform(res.data.start_date_time, 'yyyy-MM-ddTHH:mm');
        let EndDate = this.dtPipe.transform(res.data.end_date_time, 'yyyy-MM-ddTHH:mm');
        this.authService.setCurrentUser({ token: res.token });
        this.htmlScreensaverForm.setValue({
          name: res.data.name,
          html: res.data.html,
          display_time: res.data.display_time,
          scheduled: res.data.scheduled,
          start_date_time: StartDate,
          end_date_time: EndDate,
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

  // Import HTML Screensaver Created functionality End

}