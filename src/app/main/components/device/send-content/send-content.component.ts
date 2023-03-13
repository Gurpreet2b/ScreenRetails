import { DatePipe } from '@angular/common';
import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import SkinData from 'src/app/core/services/skin.json';
declare const tinymce: any;
import * as $ from 'jquery';

@Component({
  selector: 'app-send-content',
  templateUrl: './send-content.component.html',
  styleUrls: ['./send-content.component.css'],
})
export class SendContentComponent implements OnInit {

  public loading = false;
  public submitted = false;
  public SkinList: any = [];
  public SkinId: any;
  public HeaderBorder: any = '#00838f';
  public Think: any = 5;
  public HeaderLogo: any = 'left';
  public HeaderTitle: any = '';
  public HeaderFontSize: any = '';
  public HeaderBgColor: any = '';
  public AlertBgColor: any = '';

  public FooterImageUrl: any = '/assets/img/dewa-lines.png';
  public FooterLogo: any = 'left';
  public FooterBgColor: any;
  public footerColor: any;
  public FooterFontSize: any;
  public FooterText: any = '';
  public ScriptHTML: any;
  public ScriptScrollingHTML: any;
  public ScriptRSVPHTML: any;
  public DefaultSettingList: any = {};
  public DateTimePopup = new Date();
  public SkinIdListLocalStorge: any = [];
  public SkinListLocal: any
  public MediaImageList: any = [];
  public ShowSlideImage: any = 0;
  public SelectedMediaImage: any;

  constructor(private http: HttpService,
    private toastr: ToastrService, private router: Router,
    private activeRoute: ActivatedRoute, public translate: TranslateService,
    private dtPipe: DatePipe, public fb: FormBuilder,
    private authService: AuthService, private _sanitizer: DomSanitizer) {
    translate.setDefaultLang(authService.currentLanguage);
  }

  configTinyTitle = {
    init: {
      plugins: 'link, table, preview, advlist, searchreplace, code, autolink, lists, autoresize link unlink',
      default_link_target: '_blank',
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | fontfamily link unlink | table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
      content_style: "@import url('https://fonts.cdnfonts.com/css/dubai?family=Dubai&display=dubai'); body { font-family: Dubai; }",
      font_formats: "Dubai=dubai",
      font_family_formats: 'Andale Mono=andale mono,times; Dubai=dubai; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
      height: 200,
      branding: false,
      autoresize_bottom_margin: 20,
      paste_block_drop: true,
    },
  }

  configTiny = {
    init: {
      plugins: 'link, table, preview, advlist, searchreplace, code, autolink, lists, autoresize, image link unlink',
      default_link_target: '_blank',
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | fontfamily link unlink | image table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
      content_style: "@import url('https://fonts.cdnfonts.com/css/dubai?family=Dubai&display=dubai'); body { font-family: Dubai; }",
      font_formats: "Dubai=dubai",
      font_family_formats: 'Andale Mono=andale mono,times; Dubai=dubai; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
      height: 400,
      branding: false,
      table_responsive_width: true,
      image_advtab: true,
      image_caption: true,
      autoresize_bottom_margin: 20,
      // paste_block_drop: true,
      file_picker_callback: function(cb, value, meta) {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = function() {
          const file = input.files[0];
          if(file.size > 1048576){
            alert('File size cannot be larger than 1MB!')
            return;
          } else {
            const reader = new FileReader();
            reader.onload = function() {
              const id = "blobid" + new Date().getTime();
              const blobCache = tinymce.activeEditor.editorUpload.blobCache;
              const base64 = (<string>reader.result).split(",")[1];
              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);
              cb(blobInfo.blobUri());
            };
            reader.readAsDataURL(file);
          }
        };

        input.click();
      }

    },
  }

  OnDropImage(event: any) {
    if(event.event.dataTransfer.files[0].size > 1048576){
      this.toastr.warning('File size cannot be larger than 1MB!')
      event.event.preventDefault();
      return;
    }
  }

  configTinyTicker = {
    init: {
      plugins: 'link, table, preview, advlist, searchreplace, code, autolink, lists, autoresize, link',
      default_link_target: '_blank',
      toolbar: 'formatselect | bold italic strikethrough forecolor backcolor | fontfamily link unlink | table lists | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat | code preview',
      content_style: "@import url('https://fonts.cdnfonts.com/css/dubai?family=Dubai&display=dubai'); body { font-family: Dubai; }",
      font_formats: "Dubai=dubai",
      font_family_formats: 'Andale Mono=andale mono,times; Dubai=dubai; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
      height: 400,
      branding: false,
      table_responsive_width: true,
      autoresize_bottom_margin: 20,
      paste_block_drop: true,
    },
  }

  public AlertId: any;
  public AlertType: any;
  public AlertEdit: any;
  public popupAlertId: any;
  public TickerAlertId: any;
  public RSVPAlertId: any;
  public IsActivePopupAlert: any = false;
  public IsActiveTickerAlert: any = false;
  public IsActiveRsvpAlert: any = false;

  ngOnInit(): void {
    this.authService.SetRestaurantName(`Send Content Alerts`);
    this.AlertId = this.activeRoute.snapshot.params['id'] || 0;
    this.AlertType = this.activeRoute.snapshot.params['type'] || '';
    this.AlertEdit = this.activeRoute.snapshot.params['edit'] || '';
    // this.GetSkinList();
    // this.IsScript();
    // this.IsScrollingScript();
    this.GetDefaultSettings();

    this.SkinIdListLocalStorge = this.authService.getSkinIdList();
    if (this.SkinIdListLocalStorge.length > 0) {
      this.SkinListLocal = SkinData;
      this.GetLocalSkinList(this.SkinListLocal);
    }

    if (this.AlertId) {
      this.GetDigitalById();
    }

    // if (this.AlertType === 'PopupAlert') {
    //   this.IsActivePopupAlert = true;
    //   this.GetPopupAlertById();
    // } else if (this.AlertType === 'TickerAlert') {
    //   this.IsActivePopupAlert = '';
    //   this.GetTickerAlertById();
    //   this.IsActiveTickerAlert = true;
    // } else {
    //   this.IsActivePopupAlert = true;
    // }
  }

  // Local Skin List All Data
  GetLocalSkinList(res: any) {
    let SkinList = res.data;
    this.SkinList = [];
    for (let i = 0; i < this.SkinIdListLocalStorge.length; i++) {
      const element = this.SkinIdListLocalStorge[i];
      let SkinData = SkinList.filter((x: any) => x.id === element);
      this.SkinList.push(SkinData[0]);
    }
    this.SkinId = this.SkinList[0].id;
    this.GetLocalSkinListById(this.SkinId);
  }

  // Local Skin List By Id Data
  async GetLocalSkinListById(skinId: any) {
    let SkinData = this.SkinList.filter((x: any) => x.id === skinId);
    let res = SkinData[0];

    this.Think = res.border_thickness;
    this.HeaderBorder = res.border_color;
    this.HeaderLogo = res.team_image_align;
    if (this.AlertTabType === 'popup') {
      this.HeaderTextImg = environment.apiUrl + res.team_image;
    } else { }
    if (this.AlertTabType === 'popup') {
      this.HeaderTextImg = environment.apiUrl + res.team_image;
    }
    if (res.name === 'White') {
      this.IsWhiteColor = true;
    } else {
      this.IsWhiteColor = false;
    }
    this.HeaderTextImgTicker = environment.apiUrl + res.team_image;
    this.AlertBgColor = res.alert_background_color;
    this.HeaderBgColor = res.header_background_color;
    this.HeaderTitle = res.header_custom_message;
    this.HeaderTitleCheck = res.header_custom_message;
    this.HeaderFontSize = res.header_custom_message_font_color;
    this.ShowFooter = res.show_alert_footer;
    this.IsColorValue = res.show_alert_footer;
    this.ShowFooterImgCheck = res.show_alert_footer;

    this.FooterImageUrl = environment.apiUrl + res.footer_background_image;
    this.FooterImgUrl = environment.apiUrl + res.alternate_footer_image;
    this.FooterLogo = res.footer_align;
    this.FooterBgColor = res.footer_background_color;
    this.footerColor = res.footer_text_color;
    this.FooterFontSize = res.footer_font_size;
    this.FooterText = res.footer_text;
    await new Promise(f => setTimeout(f, 2000));
    this.IsScript();
    this.IsScrollingScript();
  }

  // Popup Alert Editor Title and body Function Start
  AlertEditTitle: any = '';
  AlertEditTitlePreview: any = '';
  async IsEditorTitle(event: any) {
    if (event.event.target.innerText !== undefined) {
      this.AlertEditTitlePreview = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
      // this.AlertEditTitlePreview = event.event.target.innerText;
    } else {
      this.AlertEditTitlePreview = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertEditTitlePreview);
      // this.AlertEditTitlePreview = this.AlertEditTitlePreview;
    }
    
    this.AlertEditTitle = this.alertForm.value.title;
    await new Promise(f => setTimeout(f, 2000));
    this.IsScript();
  }

  AlertEditBody: any = '';
  AlertEditBodyPreview: any = '';
  HeaderTextImg: any = '/assets/img/logo.png';
  async IsEditorBody(event: any) {
    if (event.event.target.innerText !== undefined) {
      this.AlertEditBodyPreview = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
      // this.AlertEditBodyPreview = event.event.target.innerText;
    } else {
      this.AlertEditBodyPreview = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertEditBodyPreview);
      // this.AlertEditBodyPreview = this.AlertEditBodyPreview;
    }
    
    this.AlertEditBody = this.alertForm.value.body;
    await new Promise(f => setTimeout(f, 2000));
    this.IsScript();
  }

  // Popup Alert Editor Title and body Function End

  // Popup Alert Tab Alert Settings Acknowledgement Function
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

  // Popup Alert Preview Print Function
  IsPrintf: any = false;
  OnChangePrintf(event: any) {
    if (event.target.checked === true) {
      this.IsPrintf = true;
      this.IsScript();
    } else {
      this.IsPrintf = false;
      this.IsScript();
    }
  }

  // Popup Alert Preview Heart Function

  IsHeart: any = false;
  OnChangeHeart(event: any) {
    if (event.target.checked === true) {
      this.IsHeart = true;
      this.IsScript();
    } else {
      this.IsHeart = false;
      this.IsScript();
    }
  }


  // Popup Alert Preview Script css and img Function
  IsScript() {
    let myContainer = <HTMLElement>document.querySelector("#alertContentHtmlModal");
    if (this.alertForm.value.fullscreen === 'fullscreen') {
      document.getElementById("alert-width").style.width = `100vw`;
      document.getElementById("alert-width").style.height = `99vh`;
    } else {
      document.getElementById("alert-width").style.width = `${this.alertForm.value.width}px`;
      document.getElementById("alert-width").style.height = `${this.alertForm.value.height}px`;
    }

    document.getElementById("alert-width").style.boxShadow = `0 0 0 ${this.Think}px ${this.HeaderBorder} inset`;
    document.getElementById("alert-width").style.backgroundColor = `${this.AlertBgColor}`;

    if (this.ShowFooter === true || this.ShowFooter === null) {
      if (document.getElementById("alert-border") !== null || document.getElementById("header-Bg-color") !== null || document.getElementById("Header-img") !== null) {
        document.getElementById("alert-border").style.backgroundColor = `${this.AlertBgColor}`;
        document.getElementById("header-Bg-color").style.backgroundColor = `${this.HeaderBgColor}`;
        document.getElementById("Header-img").style.textAlign = `${this.HeaderLogo}`;
      }

      if (this.alertForm.value.fullscreen !== 'fullscreen') {
        if (document.getElementById("alert-max-height") !== null) {
          let MaxHeight = Number(this.alertForm.value.height) - 250;
          document.getElementById("alert-max-height").style.maxHeight = `${MaxHeight}px`;
        }
      } else {
        if (document.getElementById("alert-max-height") !== null) {
          let MaxHeight = Number(100) - 40;
          document.getElementById("alert-max-height").style.maxHeight = `${MaxHeight}vh`;
        }
      }

      // if (document.getElementById("alert-max-height") !== null) {
      //   let MaxHeight = Number(this.alertForm.value.height) - 250;
      //   document.getElementById("alert-max-height").style.maxHeight = `${MaxHeight}px`;
      // }
      if (document.getElementById("header-text-skin") !== null || document.getElementById("header-text-img") !== null) {
        document.getElementById("header-text-skin").innerHTML = `${this.HeaderTitle}`;
        document.getElementById("header-text-img").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="180" height="auto">`;
      }
      document.getElementById("footer-img").innerHTML = `<img src="${this.FooterImageUrl}" alt="Logo" width="180" height="55">`;
      // document.getElementById("footer-align").style.textAlign = `${this.FooterLogo}`;
      if (document.getElementById("footer-BgColor") !== null) {
        document.getElementById("footer-BgColor").style.backgroundColor = `${this.FooterBgColor}`;
        document.getElementById("footer-color").style.color = `${this.footerColor}`;
        document.getElementById("footer-fontSize").style.fontSize = `${this.FooterFontSize}`;
        document.getElementById("footer-text").innerHTML = `${this.FooterText}`;
      }
    } else {
      if (document.getElementById("header-text-img-white") !== null || document.getElementById("footer-img") !== null) {
        document.getElementById("header-text-img-white").innerHTML = `<img src="${this.HeaderTextImg}" alt="Logo" width="110" height="auto">`;
        document.getElementById("footer-img").innerHTML = `<img src="${this.FooterImgUrl}" alt="Logo" width="35%" height="auto" style="float:right;">`;
      }
    }

    if (this.alertForm.value.fullscreen !== 'fullscreen') {
      if (document.getElementById("alert-max-height-check") !== null) {
        let MaxHeight = Number(this.alertForm.value.height) - 300;
        document.getElementById("alert-max-height-check").style.maxHeight = `${MaxHeight}px`;
      }
    } else {
      if (document.getElementById("alert-max-height-check") !== null) {
        let MaxHeight = Number(100) - 50;
        document.getElementById("alert-max-height-check").style.maxHeight = `${MaxHeight}vh`; 
      }
    }

    // if (document.getElementById("alert-max-height-check") !== null) {
    //   let MaxHeight = Number(this.alertForm.value.height) - 300;
    //   document.getElementById("alert-max-height-check").style.maxHeight = `${MaxHeight}px`;
    // }
    if (document.getElementById("header-text") !== null || document.getElementById("body-text") !== null) {
      document.getElementById("header-text").innerHTML = `${this.AlertEditTitle}`;
      document.getElementById("header-text-scroll").innerHTML = `<style> #header-text::-webkit-scrollbar {
        display: none;
    } </style>`;
      document.getElementById("body-text").innerHTML = `${this.AlertEditBody}`;
    }

    this.ScriptHTML = myContainer.innerHTML;
  }

  // Scrolling Alert Editor Title, body and Range Function Start
  AlertScrollingEditTitle: any = '';
  IsScrollingEditorTitle(event: any) {
    if (event.event.target.innerText !== undefined) {
      this.AlertScrollingEditTitle = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
    } else {
      this.AlertScrollingEditTitle = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertScrollingEditTitle);
    }
    // this.AlertScrollingEditTitle = event.srcElement.innerText;
    // this.AlertScrollingEditTitle = this._sanitizer.sanitize(SecurityContext.HTML, event.srcElement.innerText);
    this.IsScrollingScript();
  }

  AlertScrollingEditBody: any = '';
  IsScrollingEditorBody(event: any) {
    if (event.event.target.innerText !== undefined) {
      this.AlertScrollingEditBody = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
    } else {
      this.AlertScrollingEditBody = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertScrollingEditBody);
    }
    // this.AlertScrollingEditBody = this._sanitizer.sanitize(SecurityContext.HTML, event.srcElement.innerText);
    this.IsScrollingScript();
  }

  // Scrolling Alert Editor Title, body and Range Function End

  // Scrolling Alert Preview Script css and img Function Start
  IsScrollingScript() {  
    let ScrollingContainer = <HTMLElement>document.querySelector("#ScrollingContentHtmlModal");
    // document.getElementById("alert-Scroll-border").style.border = `${this.Think}px solid ${this.HeaderBorder}`;
    document.getElementById("alert-Scroll-border").style.boxShadow = `0 0 0 2px ${this.HeaderBorder} inset`;
    document.getElementById("alert-Scroll-border").style.backgroundColor = `${this.AlertBgColor}`;

    document.getElementById("header-scroll-img").innerHTML = `<img src="${this.HeaderTextImgTicker}" alt="Logo" width="" height="52">`;
    document.getElementById("header-scroll-text").innerHTML = `${this.AlertScrollingEditTitle} ${this.AlertScrollingEditBody}`;
    document.getElementById("header-scroll-texts").innerHTML = `${this.AlertScrollingEditTitle} ${this.AlertScrollingEditBody}`;
    document.getElementById("header-scroll-text").style.fontSize = `24px`;

    this.ScriptScrollingHTML = ScrollingContainer.innerHTML;

  }

  
  IsScreenSizeAlert(item: any) {
    if (item === 'fullscreen') {
      this.alertForm.value.width = '100';
      this.alertForm.value.height = '100';
      this.IsScript();
    } else {
      this.IsScript();
    }
  }

  // Scrolling Alert Preview Script css and img Function End

  // Pop-up Alert All function Start

  ScollingDirection: any = 'left';

  alertForm = this.fb.group({
    title: [''],
    body: ['', Validators.required],
    width: [500],
    height: [400],
    windowed_fullscreen: ['window'],
    device_type: ['All'],
    fullscreen: [false],
  })

  // Skin Change function Popup Alert tab

  IsColorValue = false;
  SetInterval: any = 1;
  IsWhiteColor: any = true
  async IsColorChange(event: any) {
    this.IsColorValue = event.show_alert_footer;
    this.SkinId = event.id;
    if (event.name === 'White') {
      this.IsWhiteColor = true;
    } else {
      this.IsWhiteColor = false;
    }
    if (this.SkinId) {
      // this.GetSkinListById();
      this.GetLocalSkinListById(this.SkinId);
      await new Promise(f => setTimeout(f, 2000));
        this.IsScript();

      // this.SetInterval = setInterval(() => {
      //   this.IsScript();
      //   if (this.SetInterval > 2) {
      //     clearInterval(this.SetInterval);
      //   }
      // }, 2000);
    }

  }

  // Getter method to access formcontrols
  get myForm() {
    return this.alertForm.controls;
  }

  OnSubmit(): any {
    this.submitted = true;
    this.alertForm.markAllAsTouched();
    if (!this.alertForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.alertForm.value };
    const formData = new FormData();
    formData.append('name', this.AlertEditTitlePreview);
    formData.append('body_text', this.AlertEditBodyPreview);
    formData.append('skin', this.SkinId);
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.AlertEdit === '') {
      this.http.post('signage_popup/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Alert Added Successfully !!");
          this.alertForm.reset();
          this.router.navigate([`/device/send-user/${responseData.id}/${responseData.alert_type}`]);
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
      this.http.patch(`signage_popup/${this.popupAlertId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          this.loading = false;
          const responseData = res.data;
          this.toastr.success("Alert Updated Successfully !!");
          this.alertForm.reset();
          this.router.navigate([`/device/send-user/${responseData.id}/${responseData.alert_type}`]);
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

  // Pop Alert Get By ID 
  GetPopupAlertById() {
    this.loading = true;
    this.http.get(`alerts_database/${this.AlertId}/`).subscribe(async (res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.popupAlertId = res.data.popup_alert.id;
        this.alertForm.setValue({
          title: res.data.popup_alert.title,
          body: res.data.popup_alert.body,
          width: res.data.popup_alert.width,
          height: res.data.popup_alert.height,
          windowed_fullscreen: res.data.popup_alert.windowed_fullscreen,
          device_type: res.data.popup_alert.device_type,
          fullscreen: res.data.popup_alert.fullscreen,
        });
        this.SkinId = res.data.popup_alert.skin;
        this.AlertEditTitlePreview = res.data.popup_alert.name;
        this.AlertEditBodyPreview = res.data.popup_alert.body_text;
        this.authService.setCurrentUser({ token: res.token });
        if (this.SkinId) {
          // this.GetSkinListById();
          this.GetLocalSkinListById(this.SkinId);
          await new Promise(f => setTimeout(f, 2000));
          this.IsScript();

          // this.SetInterval = setInterval(() => {
          //   this.IsScript();
          //   if (this.SetInterval > 2) {
          //     clearInterval(this.SetInterval);
          //   }
          // }, 2000);
        }
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

  // Pop-up Alert All function End

  // Skin List All Data
  // GetSkinList() {
  //   this.loading = true;
  //   this.http.get(`skins/?location=popup`, null).subscribe((res: any) => {
  //     if (res.status === true) {
  //       const responseData = res;
  //       this.SkinList = res.data;
  //       this.SkinId = res.data[0].id;
  //       this.GetSkinListById();
  //       this.loading = false;
  //       this.authService.setCurrentUser({ token: res.token });
  //     } else {
  //       this.loading = false;
  //       this.toastr.warning(res.message);
  //     }
  //   }, error => {
  //     this.loading = false;
  //     if (error.error.code === 'token_not_valid') {
  //       this.authService.logout();
  //       this.router.navigate(['/signin']);
  //       this.loading = false;
        
  //     } else if(error.status === 400) {
  //       this.toastr.error("Server Bad Request");
  //     } else if(error.status === 403) {
  //       this.toastr.error("Forbidden Error");
  //     } else if(error.status === 404) {
  //       this.toastr.error("Server not Found");
  //     } else if(error.status === 500) {
  //       this.toastr.error("Internal Server Error");
  //     } else {
  //       this.toastr.error("Server not reachable");
  //       this.loading = false;
  //     }
  //   });
  // }

  
  AlertTabType: any = 'popup';
  OnAlertTabChange(type: any) {
    this.AlertTabType = type;
    this.IsWhiteColor = true;
    this.ShowFooterImgCheck = false;
    this.ShowFooter = false;
    // this.GetSkinList();
    this.GetLocalSkinList(this.SkinListLocal);
  }

  IsClose: any = false;
  OnChangeClose(event: any) {
    if (event.target.checked === true) {
      this.IsClose = true;
      this.IsScript();
    } else {
      this.IsClose = false;
      this.DefaultSettingList.autoclose_boolean = true;
      this.IsScript();
    }
    this.IsScript();
  }

  HeaderTitleCheck: any = '';
  HeaderTextImgTicker: any = '';
  ShowFooter = false;
  public FooterImgUrl: any = '';
  // Skin List By Id Data
  // private GetSkinListById() {
  //   this.loading = true;
  //   this.http.get(`skins/${this.SkinId}/`).subscribe((res: any) => {
  //     if (res.status === true) {
  //       this.loading = false;
  //       this.Think = res.data.border_thickness;
  //       this.HeaderBorder = res.data.border_color;
  //       this.HeaderLogo = res.data.team_image_align;
  //       if (this.AlertTabType === 'popup') {
  //         this.HeaderTextImg = res.data.team_image;
  //       } else { }
  //       if (this.AlertTabType === 'popup') {
  //         this.HeaderTextImg = res.data.team_image;
  //       }
  //       if (res.data.name === 'White') {
  //         this.IsWhiteColor = true;
  //       } else {
  //         this.IsWhiteColor = false;
  //       }
  //       this.HeaderTextImgTicker = res.data.team_image;
  //       this.AlertBgColor = res.data.alert_background_color;
  //       this.HeaderBgColor = res.data.header_background_color;
  //       this.HeaderTitle = res.data.header_custom_message;
  //       this.HeaderTitleCheck = res.data.header_custom_message;
  //       this.HeaderFontSize = res.data.header_custom_message_font_color;
  //       this.ShowFooter = res.data.show_alert_footer;
  //       this.ShowFooterImgCheck = res.data.show_alert_footer;

  //       this.FooterImageUrl = res.data.footer_background_image;
  //       this.FooterImgUrl = res.data.alternate_footer_image;
  //       this.FooterLogo = res.data.footer_align;
  //       this.FooterBgColor = res.data.footer_background_color;
  //       this.footerColor = res.data.footer_text_color;
  //       this.FooterFontSize = res.data.footer_font_size;
  //       this.FooterText = res.data.footer_text;
  //       this.authService.setCurrentUser({ token: res.token });
  //       this.IsScript();
  //       this.IsScrollingScript();
  //     } else {
  //       this.loading = false;
  //       this.toastr.warning(res.message);
  //     }
  //   }, error => {
  //     this.loading = false;
  //     if (error.error.code === 'token_not_valid') {
  //       this.authService.logout();
  //       this.router.navigate(['/signin']);
  //       this.loading = false;
        
  //     } else if(error.status === 400) {
  //       this.toastr.error("Server Bad Request");
  //     } else if(error.status === 403) {
  //       this.toastr.error("Forbidden Error");
  //     } else if(error.status === 404) {
  //       this.toastr.error("Server not Found");
  //     } else if(error.status === 500) {
  //       this.toastr.error("Internal Server Error");
  //     } else {
  //       this.toastr.error("Server not reachable");
  //       this.loading = false;
  //     }
  //   });
  // }

  // Scrolling Ticker All function Start

  IsScrollingDirection: any = 'left'
  IsSpeed: number = 6;

  OnChangeDirection(item: any){
    this.IsScrollingDirection = item;
  }

  OnChangeSpeed(speed){
    this.IsSpeed = Number(speed);
  }

  tickerForm = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    device_type: ['All'],
  })

  IsTickerColorValue: any;
  ShowFooterImgCheck: any = false
  async IsTickerColorChange(event: any) {
    this.ShowFooterImgCheck = event.show_alert_footer;
    this.IsTickerColorValue = event.id;
    this.SkinId = event.id;
    if (event.name === 'White') {
      this.IsWhiteColor = true;
    } else {
      this.IsWhiteColor = false;
    }
    if (this.SkinId) {
      // this.GetSkinListById();
      this.GetLocalSkinListById(this.SkinId);
      await new Promise(f => setTimeout(f, 2000));
      this.IsScrollingScript();

      // this.SetInterval = setInterval(() => {
      //   this.IsScrollingScript();
      //   if (this.SetInterval > 2) {
      //     clearInterval(this.SetInterval);
      //   }
      // }, 2000);
    }
  }

  // Getter method to access formcontrols
  get myTickerForm() {
    return this.tickerForm.controls;
  }

  OnTickerSubmit(): any {
    this.submitted = true;
    this.tickerForm.markAllAsTouched();
    if (!this.tickerForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.tickerForm.value };
    const formData = new FormData();
    formData.append('name', this.AlertScrollingEditTitle);
    formData.append('body_text', this.AlertScrollingEditBody);
    formData.append('skin', this.SkinId);
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.AlertEdit === '') {
      this.http.post('signage_ticker/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Scrolling Ticker Added Successfully !!");
          this.router.navigate([`/device/send-user/${responseData.id}/${responseData.alert_type}`]);
          this.tickerForm.reset();
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
      this.http.patch(`tickeralert/${this.TickerAlertId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Scrolling Ticker Updated Successfully !!");
          this.router.navigate([`/device/send-user/${responseData.id}/${responseData.alert_type}`]);
          this.tickerForm.reset();
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

  // Scrolling Ticker Alert Get By ID 
  GetTickerAlertById() {
    this.loading = true;
    this.http.get(`alerts_database/${this.AlertId}/`).subscribe(async (res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.TickerAlertId = res.data.ticker_alert.id;
        this.tickerForm.setValue({
          title: res.data.ticker_alert.title,
          body: res.data.ticker_alert.body,
          device_type: res.data.ticker_alert.device_type,
        });
        this.SkinId = res.data.ticker_alert.skin;
        this.AlertScrollingEditTitle = res.data.ticker_alert.name;
        this.AlertScrollingEditBody = res.data.ticker_alert.body_text;
        if (this.SkinId) {
          // this.GetSkinListById();
          this.GetLocalSkinListById(this.SkinId);
          await new Promise(f => setTimeout(f, 2000));
          this.IsScrollingScript();

          // this.SetInterval = setInterval(() => {
          //   this.IsScrollingScript();
          //   if (this.SetInterval > 2) {
          //     clearInterval(this.SetInterval);
          //   }
          // }, 2000);
        }
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

  // Scrolling Ticker All function End

  // Default Settings Check function
  GetDefaultSettings() {
    this.loading = true;
    this.http.get(`default_settings/`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.DefaultSettingList = res.result;
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


  // Add Media Image 

  MediaForm = this.fb.group({
    hours: [0],
    minutes: [0],
    seconds: [10],
    image: ['', Validators.required],
  });

  // Getter method to access formcontrols
  get myMediaForm() {
    return this.MediaForm.controls;
  }

  OnMediaSubmit(){
    this.submitted = true;
    this.MediaForm.markAllAsTouched();
    if (!this.MediaForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.MediaForm.value };
    const formData = new FormData();
    formData.append('name', this.DeviceImageName);
    formData.append('media_file', this.DeviceImageFile);

    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    this.http.post('scoller_media/', formData).subscribe((res: any) => {
      if (res.status === true) {
        const responseData = res.data;
        this.toastr.success("Media Added Successfully !!");
        this.onDismiss()
        this.MediaImageList.push(responseData);

        let index = 0
        if (this.MediaImageList.length > 0) {
            this.SetInterval = setInterval(() => {
              if (index === this.MediaImageList.length-1){
                index = 0;
              }
              else{
                index = index + 1;
              }
            this.ShowSlideImage = index;
          }, Number(this.MediaImageList[index].total_seconds) * 1000);
        }
        
        // this.router.navigate([`/device/send-user/${responseData.id}/${responseData.alert_type}`]);
        this.MediaForm.reset();
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

  DeviceImageUrl: any = '';
  DeviceImageName: any = '';
  DeviceImageFile: any = [];
  onFileChangeDevice(event: any) {
    const file = event.target.files[0];
    this.DeviceImageName = file.name;
    if (file.size > '1048576') {
      this.toastr.warning("File size cannot be larger than 1MB!");
      return;
    } else {
      this.DeviceImageFile = file;
    }
  }

  onDismiss() {
    const target = "#AddMediaModal";
    $(target).hide();
    $('.modal-backdrop').remove();
    $("body").removeClass("modal-open");
    $("body").addClass("modal-overflow");
  }

  onRemoveRow(index: any) {
    this.MediaImageList.splice(index, 1);
  }


  // Add Media Image 

  DigitalMediaForm = this.fb.group({
    name: ['', Validators.required],
  });

  // Getter method to access formcontrols
  get myDigitalMediaForm() {
    return this.DigitalMediaForm.controls;
  }

  OnDigitalSubmit(){
    if (this.MediaImageList.length === 0) {
      this.toastr.warning("Please Add Media Images");
      return;
    }
    this.submitted = true;
    this.DigitalMediaForm.markAllAsTouched();
    if (!this.DigitalMediaForm.valid) {
      return;
    }
    const dataToSubmit = { ...this.DigitalMediaForm.value };
    const formData = new FormData();
    formData.append('media', JSON.stringify(this.MediaImageList));

    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;

    if (this.AlertId) {
      this.http.patch(`signage_scroller/${this.AlertId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Digital Signage Updated Successfully !!");
          this.router.navigate([`/device/sent-list`]);
          this.DigitalMediaForm.reset();
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
      this.http.post('signage_scroller/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Digital Signage Added Successfully !!");
          this.router.navigate([`/device/send-user/${responseData.id}/${responseData.alert_type}`]);
          this.DigitalMediaForm.reset();
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

  // Digital Signage media Get By ID 
  GetMediaById(Media: any) {
    this.loading = true;

    const formData = new FormData();
    formData.append('hours', Media.hours);
    formData.append('minutes', Media.minutes);
    formData.append('seconds', Media.seconds);

    this.http.patch(`scoller_media/${Media.id}/`, formData).subscribe(async (res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.toastr.success("Updated Successfully !!");
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

  // Digital Signage Scroller media Get By ID 
  GetDigitalById() {
    this.loading = true;
    this.http.get(`signage_scroller/${this.AlertId}/`).subscribe(async (res: any) => {
      if (res.status === true) {
        this.loading = false;
        this.DigitalMediaForm.setValue({
          name: res.data.name,
        });
        this.MediaImageList = res.data.media;
        let index = 0
        if (this.MediaImageList.length > 0) {
            this.SetInterval = setInterval(() => {
              if (index === this.MediaImageList.length-1){
                index = 0;
              }
              else{
                index = index + 1;
              }
            this.ShowSlideImage = index;
          }, Number(this.MediaImageList[index].total_seconds) * 1000);
        }
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

  OnSelectedMediaImage(val: any) {
    this.SelectedMediaImage = val;
  }

  OnPreviousPreview(index: any){
    if (index !== 0) {
      this.ShowSlideImage = index - 1;
    }
  }

  OnNextPreview(index: any){
    if (this.MediaImageList.length - 1 !== index) {
      this.ShowSlideImage = index + 1;
    }
  }

}