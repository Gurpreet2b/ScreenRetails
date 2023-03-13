import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-video-alert',
  templateUrl: './video-alert.component.html',
  styleUrls: ['./video-alert.component.css'],
})
export class VideoAlertComponent implements OnInit {

  public loading = false;
  public loadingVideo = false;
  public loadingVideoTable = false;
  public VideoId: any;
  public submitted: true;
  public VideoList: any = [];
  public Think: any = 5;
  public HeaderTextImg: any = '/assets/img/logo.png';
  public HeaderLogo: any = 'left';
  public FooterLogo: any = 'left'
  public HeaderBorder: any = '#00838f';
  public FooterBgColor: any;
  public footerColor: any;
  public FooterFontSize: any;
  public FooterText: any;
  public VideoAlertId: any;
  public IsVideoAndIframe = false;
  public IframeUrl: any = '';

  public SkinList: any = [];
  public SkinId: any;
  public ScriptHTML: any;
  public AlertEditTitle: any = '';
  public AlertEditBody: any = '';
  public DateTimePopup = new Date();
  public AlertId: any;
  public AlertType: any;
  public AlertEdit: any;
  public VideoPicture: File | undefined;
  public VideoUrl: any = '';

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
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    outline: true,
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
  };

  VideohtmlContent = '';
  Vconfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '10rem',
    placeholder: 'Enter text here...',
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
  // config1: AngularEditorConfig = {
  //   editable: true,
  //   spellcheck: true,
  //   height: '20rem',
  //   minHeight: '10rem',
  //   placeholder: 'Enter text here...',
  //   translate: 'no',
  //   defaultParagraphSeparator: 'p',
  //   defaultFontName: 'Arial',
  //   toolbarHiddenButtons: [
  //     ['backgroundColor'],
  //   ],
  //   customClasses: [
  //     {
  //       name: "quote",
  //       class: "quote",
  //     },
  //     {
  //       name: 'redText',
  //       class: 'redText'
  //     },
  //     {
  //       name: "titleText",
  //       class: "titleText",
  //       tag: "h1",
  //     },
  //   ]
  // };

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Create Video Alert`);
    this.dragAreaClass = "dragarea";
    this.AlertId = this.activeRoute.snapshot.params['id'] || 0;
    this.AlertType = this.activeRoute.snapshot.params['type'] || '';
    this.AlertEdit = this.activeRoute.snapshot.params['edit'] || '';
    this.GetSkinList();
    this.GetVideoList(1);

    if (this.AlertType === 'VideoAlert') {
      this.GetVideoAlertById();
    }
  }

  get myForm() {
    return this.form.controls;
  }


  form = new FormGroup({
    search: new FormControl(''),
  });

  onSearch(formValue: any) {
    this.GetVideoList(1);
  }

  PageJump: any = 10;
  PageTotalNumber: any = [];
  GetVideoList(page: number) {
    this.loadingVideoTable = true;
    const formData = new FormData();
    const formValue = this.form.value;
    const search = formValue.search || '';
    formData.append('search', search);

    let params = new HttpParams();
    params = params.append('page', page.toString())
    this.http.get(`video_database/?search=${search}`, null, { params: params }).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.VideoList = res.data;
        this.totalItems = responseData.count;
        this.loadingVideoTable = false;
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.loadingVideoTable = false;
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

  currentPage: number = 1;
  totalItems: number | undefined;
  onPageChange(event: any, data: any) {
    if (data === '1') {
      this.currentPage = event;
      this.GetVideoList(event)
    } else {
      this.currentPage = Number(event.target.value);
      this.GetVideoList(this.currentPage)
    }
  }

  delete(id: number) {
    if (confirm('Are you sure delete this record?')) {
      this.onDeleteAlert(id);
    }
  }
  onDeleteAlert(id: number) {
    this.loadingVideoTable = true;
    this.http.delete(`video_database/${id}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.toastr.success("Video Deleted Successfully");
        this.GetVideoList(this.currentPage);
        this.authService.setCurrentUser({ token: res.token });
      } else {
        this.toastr.error(res.error);
        this.loadingVideoTable = false;
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

  IsVideoAndUrl(event: any) {
    this.IsVideoAndIframe = event.target.checked;
    this.IsScript();
  }

  // Video Alert Tab Alert Settings Acknowledgement Function
  IsAcknowledgement: any = false;
  OnChangeAcknowledgement(event: any) {
    if (event.target.checked === true) {
      this.IsAcknowledgement = true;
      this.IsScript();
    } else {
      this.IsAcknowledgement = false;
      this.IsScript();
    }
  }

  // Video Alert Editor Title and body Function Start
  IsEditorTitle(event: any) {
    this.AlertEditTitle = event.srcElement.innerText;
    this.IsScript();
  }

  IsEditorBody(event: any) {
    this.AlertEditBody = event.srcElement.innerText;
    this.IsScript();
  }
  // Video Alert Editor Title and body Function End

  // Video Alert Preview Script css and img Function
  IsScript() {
    let myContainer = <HTMLElement>document.querySelector("#videoAlertHtmlModal");
    document.getElementById("alert-border").style.border = `${this.Think}px solid ${this.HeaderBorder}`;
    document.getElementById("Header-img").style.textAlign = `${this.HeaderLogo}`;

    document.getElementById("header-text-img").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="50" height="50">`;
    document.getElementById("header-text").innerHTML = `${this.AlertEditTitle}`;
    document.getElementById("body-text").innerHTML = `${this.AlertEditBody}`;
    if (this.IsVideoAndIframe === false) {
      document.getElementById("body-video").innerHTML = `<video width="440" height="240" controls="hidden" autoplay loop muted>
      <source src="${this.VideoUrl}" type="video/mp4"></video>`;
    } else {
      document.getElementById("body-video").innerHTML = `<iframe src="${this.IframeUrl}" width="440" height="240" title="Iframe"></iframe>`;
    }
    document.getElementById("footer-align").style.textAlign = `${this.FooterLogo}`;
    document.getElementById("footer-BgColor").style.backgroundColor = `${this.FooterBgColor}`;
    document.getElementById("footer-color").style.color = `${this.footerColor}`;
    document.getElementById("footer-fontSize").style.fontSize = `${this.FooterFontSize}`;
    document.getElementById("footer-fontSize").innerHTML = `${this.FooterText}`;

    this.ScriptHTML = myContainer.innerHTML;
  }

  // Skin Change function Popup Alert tab
  IsColorValue: any;
  SetInterval: any = 1;
  IsColorChange(event: any) {
    this.IsColorValue = event.target.value;
    this.SkinId = event.target.value;
    if (this.SkinId) {
      this.GetSkinListById();
      this.SetInterval = setInterval(() => {
        this.IsScript();
        if (this.SetInterval > 2) {
          clearInterval(this.SetInterval);
        }
      }, 2000);
    }
  }

  videoForm = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    high_priority: [false],
    acknowledgement_required: [true],
    self_distructive: [false],
    autoplay: [false],
    mute: [false],
    controls: [false],
    loop: [false],
    auto_close: [false],
    auto_close_time: [null],
    allow_manual_close: [false],
    lifetime_given: [false],
    lifetime: [null],
    lifetime_option: [null],
    schedule_alert: [false],
    schedule_option: [''],
    schedule_time_start: [''],
    schedule_time_end: [''],
    reminder: [''],
    reminder_time_list: [''],
    width: [500],
    height: [400],
    position: ['bottom-right'],
    resizable: [false],
    fullscreen_windowed: ['window'],
  })

  get myAlertForm() {
    return this.videoForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    this.videoForm.markAllAsTouched();
    if (!this.videoForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.videoForm.value };
    const formData = new FormData();
    formData.append('html', this.ScriptHTML);
    formData.append('name', this.AlertEditTitle);
    formData.append('body_text', this.AlertEditBody);
    if (this.IsVideoAndIframe === false) {
      formData.append('video_url', this.VideoUrl);
      formData.append('i_frame', '');
    } else {
      formData.append('i_frame', this.IframeUrl);
      formData.append('video_url', '');
    }
    formData.append('skin', this.SkinId);

    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;

    if (this.AlertEdit === '') {
      this.http.post('videoalert/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Video Alert Added Successfully !!");
          this.videoForm.reset();
          this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
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
      this.http.patch(`videoalert/${this.VideoAlertId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          this.loading = false;
          const responseData = res.data;
          this.toastr.success("Video Alert Updated Successfully !!");
          this.videoForm.reset();
          this.router.navigate([`/create-alerts/send-user/${responseData.id}/${responseData.alert_type}`]);
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

  // Pop Alert Get By ID 
  GetVideoAlertById() {
    this.loading = true;
    this.http.get(`alerts_database/${this.AlertId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.VideoAlertId = res.data.video_alert.id;
        this.videoForm.setValue({
          title: res.data.video_alert.title,
          body: res.data.video_alert.body,
          high_priority: res.data.video_alert.high_priority,
          acknowledgement_required: res.data.video_alert.acknowledgement_required,
          self_distructive: res.data.video_alert.self_distructive,
          autoplay: res.data.video_alert.autoplay,
          mute: res.data.video_alert.mute,
          controls: res.data.video_alert.controls,
          loop: res.data.video_alert.loop,
          auto_close: res.data.video_alert.auto_close,
          auto_close_time: res.data.video_alert.auto_close_time,
          allow_manual_close: res.data.video_alert.allow_manual_close,
          lifetime_given: res.data.video_alert.lifetime_given,
          lifetime: res.data.video_alert.lifetime,
          lifetime_option: res.data.video_alert.lifetime_option,
          schedule_alert: '',
          schedule_option: '',
          schedule_time_start: '',
          schedule_time_end: '',
          reminder: '',
          reminder_time_list: '',
          width: res.data.video_alert.width,
          height: res.data.video_alert.height,
          position: res.data.video_alert.position,
          resizable: res.data.video_alert.resizable,
          fullscreen_windowed: res.data.video_alert.fullscreen_windowed,
        });
        this.SkinId = res.data.video_alert.skin;
        this.AlertEditTitle = res.data.video_alert.name;
        this.AlertEditBody = res.data.video_alert.body_text;
        this.VideoUrl = res.data.video_alert.video_url;
        this.authService.setCurrentUser({ token: res.token });
        if (this.SkinId) {
          this.GetSkinListById();
          this.SetInterval = setInterval(() => {
            this.IsScript();
            if (this.SetInterval > 2) {
              clearInterval(this.SetInterval);
            }
          }, 2000);
        }
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

  // Pop-up Alert All function End

  // Skin List All Data
  GetSkinList() {
    this.loading = true;
    this.http.get(`skins/`, null).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res;
        this.SkinList = res.data;
        this.SkinId = res.data[0].id;
        this.GetSkinListById();
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

  // Skin List By Id Data
  private GetSkinListById() {
    this.loading = true;
    this.http.get(`skins/${this.SkinId}/`).subscribe((res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.Think = res.data.border_thickness;
        this.HeaderBorder = res.data.border_color;
        this.HeaderLogo = res.data.team_image_align;
        this.HeaderTextImg = res.data.team_image;

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

  //embed a video

  embedForm = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
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
    scheduled: [''],
    schedule_option: [''],
    schedule_time_start: [''],
    schedule_time_end: [''],
    reminder: [''],
    reminder_time_list: [''],
    width: [''],
    height: [''],
    position: [''],
    resizable: [''],
    fullscreen: [''],
    device_type: [''],
  })

  IsEmbedColorValue: any;
  IsEmbedColorChange(event: any) {
    this.IsEmbedColorValue = event.target.value;
    this.VideoId = event.target.value;
    if (this.VideoId) {
      // this.GetVideoListById();
    }
  }
  get myEmbedForm() {
    return this.embedForm.controls;
  }

  OnEmbedSubmit(): any {
    this.submitted = true;
    this.embedForm.markAllAsTouched();
    if (!this.embedForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.embedForm.value };
    const formData = new FormData();
    formData.append('lockscreenalert', this.VideoId);
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });
    this.loading = true;
    this.http.post('lockscreenalert/', formData).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res.data;
        this.toastr.success("Embed Video Added Successfully !!");
        this.embedForm.reset();
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

  IsVideoSelected(item: any) {
    this.VideoUrl = item.video;
    this.SelectedName = item.name;
    this.IsScript();
  }

  error: string;
  dragAreaClass: string;
  SelectedName: any;
  onFileChange(event: any) {
    let files: FileList = event.target.files;
    this.SelectedName = event.target.files['0'].name
    const file = event.target.files[0];
    if (file.size > '104857600') {
      this.toastr.warning("File size cannot be larger than 100MB!");
      return;
    } else {
      this.VideoPicture = file;
      this.loadingVideo = true;
      const formData = new FormData();
      formData.append('video', this.VideoPicture);
      this.http.post(`video_database/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res;
          this.VideoUrl = res.data.video;
          this.GetVideoList(1);
          this.IsScript();
          this.loadingVideo = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.loadingVideo = false;
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

  @HostListener("dragover", ["$event"]) onDragOver(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragenter", ["$event"]) onDragEnter(event: any) {
    this.dragAreaClass = "droparea";
    event.preventDefault();
  }
  @HostListener("dragend", ["$event"]) onDragEnd(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("dragleave", ["$event"]) onDragLeave(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
  }
  @HostListener("drop", ["$event"]) onDrop(event: any) {
    this.dragAreaClass = "dragarea";
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files) {
      // let files: FileList = event.dataTransfer.files;
      this.SelectedName = event.dataTransfer.files['0'].name
      this.saveFiles(event);
    }
  }

  saveFiles(event: any) {
    // let files: FileList = event.dataTransfer.files;
    this.SelectedName = event.dataTransfer.files['0'].name

    const file = event.dataTransfer.files[0];
    if (file.size > '104857600') {
      this.toastr.warning("File size cannot be larger than 100MB!");
      return;
    } else {
      this.VideoPicture = file;
      this.loadingVideo = true;
      const formData = new FormData();
      formData.append('video', this.VideoPicture);
      this.http.post(`video_database/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res;
          this.VideoUrl = res.data.video;
          this.GetVideoList(1);
          this.IsScript();
          this.loadingVideo = false;
          this.authService.setCurrentUser({ token: res.token });
        } else {
          this.loadingVideo = false;
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


}