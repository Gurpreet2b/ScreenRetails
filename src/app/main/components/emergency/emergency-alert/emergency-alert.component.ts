import { DatePipe } from '@angular/common';
import { Component, OnInit, SecurityContext } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { HttpService, AuthService } from 'src/app/core/services';
import * as $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import SkinData from 'src/app/core/services/skin.json';
declare const tinymce: any;

@Component({
  selector: 'app-emergency-alert',
  templateUrl: './emergency-alert.component.html',
  styleUrls: ['./emergency-alert.component.css'],
})
export class EmergencyAlertComponent implements OnInit {

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

  public FooterImageUrl: any = '';

  public FooterLogo: any = 'left';
  public FooterBgColor: any;
  public footerColor: any;
  public FooterFontSize: any;
  public FooterText: any = '';
  public ScriptHTML: any;
  public ScriptScrollingHTML: any;
  public DefaultSettingList: any = {};
  public DateTimePopup = new Date();
  public ColorCodeList: any = [];
  public SelectedColorCode: any;
  public colorCode: any;
  public MessageTemplateList: any = [];
  public AlertId: any;
  public AlertType: any;
  public AlertEdit: any;
  public popupAlertId: any;
  public TickerAlertId: any;
  public IsActivePopupAlert: any = false;
  public IsActiveTickerAlert: any = false;
  public Permission: any = [];
  public RoleName: any;
  public RoleAssign: any = [];
  public PolicyAlertSetting: any = [];
  ShowFooter: boolean;
  show_alert_footer: boolean;
  FooterImgUrl: any;
  public MessageId: any
  public SkinIdListLocalStorge: any = [];
  public SkinListLocal: any

  constructor(private http: HttpService,
    private toastr: ToastrService, public translate: TranslateService,
    private activeRoute: ActivatedRoute, public fb: FormBuilder,
    private dtPipe: DatePipe, private router: Router,
    private authService: AuthService, private _sanitizer: DomSanitizer) {
    translate.setDefaultLang(authService.currentLanguage);
  }
  // Alert popup Editor Start


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
      file_picker_callback: function (cb, value, meta) {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = function () {
          const file = input.files[0];
          if (file.size > 1048576) {
            alert('File size cannot be larger than 1MB!')
            return;
          } else {
            const reader = new FileReader();
            reader.onload = function () {
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
    if (event.event.dataTransfer.files[0].size > 1048576) {
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


  config1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '8rem',
    minHeight: '0',
    maxHeight: '10rem',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'Dubai-Bold', name: 'Dubai-Bold' }
    ],
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
    toolbarHiddenButtons: [
      [
        // 'undo',
        // 'redo',
        // 'bold',
        // 'italic',
        // 'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        // 'justifyLeft',
        // 'justifyCenter',
        // 'justifyRight',
        // 'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        // 'heading',
        // 'fontName'
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '35rem',
    minHeight: '0',
    maxHeight: '20rem',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
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
    toolbarHiddenButtons: [
      [
        // 'undo',
        // 'redo',
        // 'bold',
        // 'italic',
        'underline',
        // 'strikeThrough',
        // 'subscript',
        'superscript',
        // 'justifyLeft',
        // 'justifyCenter',
        // 'justifyRight',
        // 'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        // 'heading',
        // 'fontName'
      ],
      [
        // 'fontSize',
        // 'textColor',
        // 'backgroundColor',
        'customClasses',
        // 'link',
        // 'unlink',
        // 'insertImage',
        'insertVideo',
        // 'insertHorizontalRule',
        'removeFormat',
        // 'toggleEditorMode'
      ]
    ]
  };

  // Alert popup Editor End

  // Scrolling Ticker Editor Start
  configTicker: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '8rem',
    minHeight: '0',
    maxHeight: '10rem',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
      { class: 'Dubai-Bold', name: 'Dubai-Bold' }
    ],
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
    toolbarHiddenButtons: [
      [
        // 'undo',
        // 'redo',
        // 'bold',
        // 'italic',
        // 'underline',
        'strikeThrough',
        'subscript',
        'superscript',
        // 'justifyLeft',
        // 'justifyCenter',
        // 'justifyRight',
        // 'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        // 'heading',
        // 'fontName'
      ],
      [
        'fontSize',
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  configTicker1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '35rem',
    minHeight: '0',
    maxHeight: '20rem',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
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
    toolbarHiddenButtons: [
      [
        // 'undo',
        // 'redo',
        // 'bold',
        // 'italic',
        'underline',
        // 'strikeThrough',
        // 'subscript',
        'superscript',
        // 'justifyLeft',
        // 'justifyCenter',
        // 'justifyRight',
        // 'justifyFull',
        'indent',
        'outdent',
        'insertUnorderedList',
        'insertOrderedList',
        // 'heading',
        // 'fontName'
      ],
      [
        // 'fontSize',
        // 'textColor',
        // 'backgroundColor',
        'customClasses',
        // 'link',
        // 'unlink',
        'insertImage',
        'insertVideo',
        // 'insertHorizontalRule',
        'removeFormat',
        // 'toggleEditorMode'
      ]
    ]
  };
  // Scrolling Ticker Editor End
  ngOnInit(): void {
    this.authService.SetRestaurantName(`Create Emergency Alert`);
    this.AlertId = this.activeRoute.snapshot.params['id'] || 0;
    this.AlertType = this.activeRoute.snapshot.params['type'] || '';
    this.AlertEdit = this.activeRoute.snapshot.params['edit'] || '';
    this.Permission = this.authService.getPermission();
    this.RoleAssign = JSON.parse(this.Permission.access_control_list);
    this.PolicyAlertSetting = JSON.parse(this.Permission.alert_setting_list);
    this.RoleName = this.Permission.role;
    // this.GetSkinList();
    // this.IsScript();
    // this.IsScrollingScript();
    this.GetDefaultSettings();
    this.OnColorCodeChange();
    this.GetMessageList();

    this.SkinIdListLocalStorge = this.authService.getSkinIdList();
    if (this.SkinIdListLocalStorge.length > 0) {
      this.SkinListLocal = SkinData;
      this.GetLocalSkinList(this.SkinListLocal);
    }

    if (this.AlertType === 'EmergencyPopupAlert') {
      this.IsActivePopupAlert = true;
      this.GetPopupAlertById();
    } else if (this.AlertType === 'EmergencyTickerAlert') {
      this.IsActivePopupAlert = '';
      this.GetTickerAlertById();
      this.IsActiveTickerAlert = true;
    } else {
      this.IsActivePopupAlert = true;
    }
  }

  IsOnLoadCompleted: any = false;
  OnLoadAllApiResponseCheck() {
    if (this.IsMessageRes === true && this.IsDefaultSettingsRes === true) {
      this.IsOnLoadCompleted = true;
      console.log("IsOnLoadCompleted");
    }
  }

  OnLoadAllApiResponseCheckEdit() {
    if (this.IsMessageRes === true && this.IsDefaultSettingsRes === true || this.IsPopupAlertByIdRes === true) {
      this.IsOnLoadCompleted = true;
      console.log("IsOnLoadCompleted Edit");
    }
  }

  OnLoadAllApiResponseCheckEditTicker() {
    if (this.IsMessageRes === true && this.IsDefaultSettingsRes === true || this.IsTickerAlertByIdRes === true) {
      this.IsOnLoadCompleted = true;
      console.log("IsOnLoadCompleted Edit");
    }
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


  AlertTabType: any = 'popup';
  OnAlertTabChange(type: any) {
    this.AlertTabType = type;
    this.IsWhiteColor = true;
    this.ShowFooterImgCheck = false;
    this.ShowFooter = false;
    // this.GetSkinList();
    this.GetLocalSkinList(this.SkinListLocal);
  }

  IsMessageRes: any = false;
  GetMessageList() {
    this.loading = true;
    this.http.get(`templates/`, null).subscribe((res: any) => {
      this.IsMessageRes = res.status;
      this.OnLoadAllApiResponseCheck();
      if (res.status === true) {
        this.MessageTemplateList = res.data;
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
        
      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  // IsChangeMessageTemplate(event: any) {
  //   this.MessageId = event.target.value;
  //   this.GetMessageListById();
  // }

  // private GetMessageListById() {
  //   this.loading = true;
  //   this.http.get(`templates/${this.MessageId}/`).subscribe((res: any) => {
  //     if (res.status === true) {
  //       this.loading = false;
  //       this.alertForm.setValue({
  //         title: res.data.name,
  //         body: res.data.body,
  //         high_priority: this.DefaultSettingList.high_priority_alert,
  //         acknowledgement_required: this.DefaultSettingList.acknowledgement_required,
  //         self_distructive: this.DefaultSettingList.self_destructing_alert,
  //         auto_close: this.DefaultSettingList.autoclose_boolean,
  //         auto_close_time: this.DefaultSettingList.autoclose_time_seconds,
  //         allow_manual_close: this.DefaultSettingList.allow_manual_close,
  //         lifetime_given: true,
  //         lifetime: this.DefaultSettingList.lifetime_count,
  //         lifetime_option: this.DefaultSettingList.lifetime_choice,
  //         add_print_button: '',
  //         allow_feedback: '',
  //         scheduled: '',
  //         schedule_option: '',
  //         schedule_time_start: '',
  //         schedule_time_end: '',
  //         reminder: '',
  //         reminder_time_list: '',
  //         width: this.DefaultSettingList.width,
  //         height: this.DefaultSettingList.height,
  //         position: this.DefaultSettingList.alert_position,
  //         resizable: '',
  //         fullscreen: this.DefaultSettingList.windowed_fullscreen,
  //         device_type: '',
  //         call_alert: this.DefaultSettingList.text_to_call,
  //         email_alert: this.DefaultSettingList.email,
  //         sms_alert: this.DefaultSettingList.sms,
  //         teams_alert: false,
  //       });
  //       this.authService.setCurrentUser({ token: res.token });
  //     } else {
  //       this.loading = false;
  //       this.toastr.warning(res.message);
  //     }
  //   }, error => {
  //     if (error.error.code === 'token_not_valid') {
  //       this.authService.logout();
  //       this.router.navigate(['/signin']);
  //       this.loading = false;
  //     } else {
  //       this.toastr.error("Server not reachable");
  //       this.loading = false;
  //     }
  //   });
  // }


  IsCheckPreview: any = false;
  async OnPreviewCheck() {
    await new Promise(f => setTimeout(f, 2000));
    if (this.AlertEditBody || this.AlertEditBodyPreview) {
      this.IsCheckPreview = true;
    }
  }

  IsCheckPreviewTicker: any = false;
  async OnPreviewTickerCheck() {
    await new Promise(f => setTimeout(f, 2000));
    if (this.AlertScrollingEditBody) {
      this.IsCheckPreviewTicker = true;
    }
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
    this.IsCheckPreview = false;
    await new Promise(f => setTimeout(f, 2000));
    this.IsScript();
  }

  AlertEditBody: any = '';
  AlertEditBodyPreview: any = '';
  HeaderTextImg: any = '';
  async IsEditorBody(event: any) {
    if (event.event.target.innerText !== undefined) {
      this.AlertEditBodyPreview = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
      // this.AlertEditBodyPreview = event.event.target.innerText;
    } else {
      this.AlertEditBodyPreview = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertEditBodyPreview);
      // this.AlertEditBodyPreview = this.AlertEditBodyPreview;
    }

    this.AlertEditBody = this.alertForm.value.body;
    this.IsCheckPreview = false;
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
    this.IsCheckPreview = false;
  }

  // Popup Alert Preview Print Function
  // IsPrintf: any = false;
  // OnChangePrintf(event: any) {
  //   if (event.target.checked === true) {
  //     this.IsPrintf = true;
  //     this.IsScript();
  //   } else {
  //     this.IsPrintf = false;
  //     this.IsScript();
  //   }
  // }

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
    this.IsCheckPreview = false;
  }

  IsClose: any = false;
  IsAutoCloseEmergency(event: any) {
    if (event.target.checked) {
      this.DefaultSettingList.allow_manual_close = true;
      this.IsClose = true;
      this.IsScript();
    } else {
      this.DefaultSettingList.allow_manual_close = true;
      this.IsClose = true;
      this.IsScript();
    }
    this.IsCheckPreview = false;
    this.IsScript();
  }

  IsAutoCloseManual(event: any) {
    if (event.target.checked === true) {
      this.IsClose = true;
      this.IsScript();
    } else {
      this.IsClose = false;
      this.DefaultSettingList.autoclose_boolean = true;
      this.IsScript();
    }
    this.IsCheckPreview = false;
    this.IsScript();
  }


  // Popup Alert Preview Script css and img Function
  IsScript() {
    let myContainer = <HTMLElement>document.querySelector("#alertHtmlEmergencyModal");
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
          let MaxHeight = Number(this.alertForm.value.height) - 280;
          document.getElementById("alert-max-height").style.maxHeight = `${MaxHeight}px`;
        }
      } else {
        if (document.getElementById("alert-max-height") !== null) {
          let MaxHeight = Number(100) - 32;
          document.getElementById("alert-max-height").style.maxHeight = `${MaxHeight}vh`;
        }
      }

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
        document.getElementById("footer-img").innerHTML = `<img src="${this.FooterImgUrl}" alt="Logo" width="30%" height="auto" style="float:right;">`;
      }
    }

    if (this.alertForm.value.fullscreen !== 'fullscreen') {
      if (document.getElementById("alert-max-height-check") !== null) {
        let MaxHeight = Number(this.alertForm.value.height) - 300;
        document.getElementById("alert-max-height-check").style.maxHeight = `${MaxHeight}px`;
      }
    } else {
      if (document.getElementById("alert-max-height-check") !== null) {
        let MaxHeight = Number(100) - 45;
        document.getElementById("alert-max-height-check").style.maxHeight = `${MaxHeight}vh`;
      }
    }

    if (document.getElementById("header-text") !== null || document.getElementById("body-text") !== null) {
      document.getElementById("header-text").innerHTML = `${this.AlertEditTitle}`;
      document.getElementById("header-text-scroll-emergency").innerHTML = `<style> #header-text::-webkit-scrollbar {display: none;} </style>`;
      document.getElementById("body-text").innerHTML = `${this.AlertEditBody}`;
    }

    this.ScriptHTML = myContainer.innerHTML;
  }

  IsScreenSizeAlert(item: any) {
    if (item === 'fullscreen') {
      this.alertForm.value.width = '100';
      this.alertForm.value.height = '99';
      this.IsScript();
    } else {
      this.IsScript();
    }
    this.IsCheckPreview = false;
  }

  // Scrolling Alert Editor Title, body and Range Function Start
  AlertScrollingEditTitle: any = '';
  AlertScrollingEditTitleName: any = '';
  IsScrollingEditorTitle(event: any) {
    if (event.event.target.innerText !== undefined) {
      this.AlertScrollingEditTitle = this._sanitizer.sanitize(SecurityContext.HTML, event.event.target.innerText);
      this.AlertScrollingEditTitleName = event.event.target.innerText;
    } else {
      this.AlertScrollingEditTitle = this._sanitizer.sanitize(SecurityContext.HTML, this.AlertScrollingEditTitle);
      this.AlertScrollingEditTitleName = this.AlertScrollingEditTitleName;
    }
    // this.AlertScrollingEditTitle = event.srcElement.innerText;
    this.IsCheckPreviewTicker = false;
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
    this.IsCheckPreviewTicker = false;
    this.IsScrollingScript();
  }

  // Scrolling Alert Editor Title, body and Range Function End

  // Scrolling Alert Preview Script css and img Function Start
  IsScrollingScript() {
    let ScrollingContainer = <HTMLElement>document.querySelector("#ScrollingHtmlEmergencyModal");
    // document.getElementById("alert-Scroll-border").style.border = `${this.Think}px solid ${this.HeaderBorder}`;
    document.getElementById("alert-Scroll-border").style.boxShadow = `0 0 0 2px ${this.HeaderBorder} inset`;
    document.getElementById("alert-Scroll-border").style.backgroundColor = `${this.AlertBgColor}`;

    document.getElementById("header-scroll-img").innerHTML = `<img src="${this.HeaderTextImgTicker}" alt="Logo" width="" height="52">`;
    document.getElementById("header-scroll-text").innerHTML = `${this.AlertScrollingEditTitle} ${this.AlertScrollingEditBody}`;
    document.getElementById("header-scroll-texts").innerHTML = `${this.AlertScrollingEditTitle} ${this.AlertScrollingEditBody}`;
    document.getElementById("header-scroll-text").style.fontSize = `24px`;
    // document.getElementById("header-scroll-text").style.color = `#fff`;

    this.ScriptScrollingHTML = ScrollingContainer.innerHTML;
  }
  // Scrolling Alert Preview Script css and img Function End

  // Pop-up Alert All function Start

  alertForm = this.fb.group({
    title: [''],
    body: ['', Validators.required],
    high_priority: [false],
    acknowledgement_required: [false],
    // unobtrusive: [''],
    self_distructive: [false],
    auto_close: [false],
    auto_close_time: [0],
    allow_manual_close: [false],
    lifetime_given: [true],
    lifetime: [1],
    lifetime_option: ['day'],
    add_print_button: [false],
    allow_feedback: [false],
    scheduled: [false],
    schedule_option: [''],
    schedule_time_start: [''],
    schedule_time_end: [''],
    reminder: [''],
    reminder_time_list: [''],
    width: [500],
    height: [400],
    position: ['bottom-right'],
    resizable: [false],
    fullscreen: [false],
    device_type: [''],
  })

  // Skin Change function Popup Alert tab

  IsColorValue = false;
  IsWhiteColor: any = true
  SetInterval: any = 1;
  async IsColorChange(event: any) {
    this.IsColorValue = event.show_alert_footer;
    this.SkinId = event.id;
    if (this.SkinId) {
      if (event.name === 'White') {
        this.IsWhiteColor = true;
      } else {
        this.IsWhiteColor = false;
      }

      if (this.SkinId) {
        this.IsCheckPreview = false;
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
    // formData.append('group_list', this.IsSelectedGroupList);
    formData.append('html', this.ScriptHTML);
    formData.append('name', this.AlertEditTitlePreview);
    // formData.append('body_text', this.AlertEditBody);
    formData.append('body_text', this.AlertEditBodyPreview);

    formData.append('skin', this.SkinId);
    formData.append('color_code', this.SelectedColorCode);
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.AlertEdit === '') {
      this.http.post('emergency_popup/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Emergency Alert Added Successfully !!");
          this.alertForm.reset();
          this.router.navigate([`/emergency/send-user/${responseData.id}/${responseData.alert_type}`]);
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
          
        } else if (error.status === 400) {
          this.toastr.error("Server Bad Request");
        } else if (error.status === 403) {
          this.toastr.error("Forbidden Error");
        } else if (error.status === 404) {
          this.toastr.error("Server not Found");
        } else if (error.status === 500) {
          this.toastr.error("Internal Server Error");
        } else {
          this.toastr.error("Server not reachable");
          this.loading = false;
        }
      });
    } else {
      this.http.patch(`emergency_popup/${this.popupAlertId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          this.loading = false;
          const responseData = res.data;
          this.toastr.success("Emergency Alert Updated Successfully !!");
          this.alertForm.reset();
          this.router.navigate([`/emergency/send-user/${responseData.id}/${responseData.alert_type}`]);
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
          
        } else if (error.status === 400) {
          this.toastr.error("Server Bad Request");
        } else if (error.status === 403) {
          this.toastr.error("Forbidden Error");
        } else if (error.status === 404) {
          this.toastr.error("Server not Found");
        } else if (error.status === 500) {
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

  // Pop Alert Get By ID 
  IsPopupAlertByIdRes: any = false;
  GetPopupAlertById() {
    this.loading = true;
    this.http.get(`emergency_alerts/?alert_id=${this.AlertId}&alert_type=${this.AlertType}`).subscribe(async (res: any) => {
      this.IsPopupAlertByIdRes = res.status;
      this.OnLoadAllApiResponseCheckEdit();
      if (res.status === true) {
        this.loading = false;
        this.popupAlertId = res.data.id;
        this.alertForm.setValue({
          title: res.data.title,
          body: res.data.body,
          high_priority: res.data.high_priority,
          acknowledgement_required: res.data.acknowledgement_required,
          self_distructive: res.data.self_distructive,
          auto_close: res.data.auto_close,
          auto_close_time: res.data.auto_close_time,
          allow_manual_close: res.data.allow_manual_close,
          lifetime_given: res.data.lifetime_given,
          lifetime: res.data.lifetime,
          lifetime_option: res.data.lifetime_option,
          add_print_button: res.data.add_print_button,
          allow_feedback: res.data.allow_feedback,
          scheduled: '',
          schedule_option: '',
          schedule_time_start: '',
          schedule_time_end: '',
          reminder: res.data.reminder,
          reminder_time_list: res.data.reminder_time_list,
          width: res.data.width,
          height: res.data.height,
          position: res.data.position,
          resizable: res.data.resizable,
          fullscreen: res.data.fullscreen,
          device_type: res.data.device_type,
        });
        this.SkinId = res.data.skin;
        this.SelectedColorCode = res.data.color_code;
        this.colorCode = '#fff';
        this.AlertEditTitlePreview = res.data.name;
        // this.AlertEditBody = res.data.body_text;
        this.AlertEditBodyPreview = res.data.body_text;
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
        
      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  // Pop-up Alert All function End

  // Skin List All Data
  IsSkinRes: any = false;
  // GetSkinList() {
  //   this.loading = true;
  //   this.http.get(`skins/?location=popup`, null).subscribe((res: any) => {
  //     this.IsSkinRes = res.status;
  //     this.OnLoadAllApiResponseCheck();
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
        
  //     } else if (error.status === 400) {
  //       this.toastr.error("Server Bad Request");
  //     } else if (error.status === 403) {
  //       this.toastr.error("Forbidden Error");
  //     } else if (error.status === 404) {
  //       this.toastr.error("Server not Found");
  //     } else if (error.status === 500) {
  //       this.toastr.error("Internal Server Error");
  //     } else {
  //       this.toastr.error("Server not reachable");
  //       this.loading = false;
  //     }
  //   });
  // }
  HeaderTitleCheck: any = '';
  HeaderTextImgTicker: any = '';
  // Skin List By Id Data
  IsSkinByIdRes: any = false;
  // private GetSkinListById() {
  //   this.loading = true;
  //   this.http.get(`skins/${this.SkinId}/`).subscribe(async (res: any) => {
  //     this.IsSkinByIdRes = res.status;
  //     this.OnLoadAllApiResponseCheck();
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
  //       await new Promise(f => setTimeout(f, 2000));
  //       this.IsScript();
  //       this.IsScrollingScript();

  //       // this.SetInterval = setInterval(() => {
  //       //   this.IsScript();
  //       //   this.IsScrollingScript();
  //       //   if (this.SetInterval > 2) {
  //       //     clearInterval(this.SetInterval);
  //       //   }
  //       // }, 2000);
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
        
  //     } else if (error.status === 400) {
  //       this.toastr.error("Server Bad Request");
  //     } else if (error.status === 403) {
  //       this.toastr.error("Forbidden Error");
  //     } else if (error.status === 404) {
  //       this.toastr.error("Server not Found");
  //     } else if (error.status === 500) {
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

  OnChangeDirection(item: any) {
    this.IsScrollingDirection = item;
  }

  OnChangeSpeed(speed) {
    this.IsSpeed = Number(speed);
  }

  tickerForm = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    high_priority: [false],
    acknowledgement_required: [false],
    unobtrusive: [false],
    self_distructive: [false],
    auto_close: [false],
    auto_close_time: [0],
    allow_manual_close: [false],
    lifetime_given: [true],
    lifetime: [1],
    lifetime_option: ['day'],
    speed: [null],
    allow_feedback: [false],
    scheduled: [false],
    schedule_option: [null],
    schedule_time_start: [null],
    schedule_time_end: [null],
    reminder: [false],
    reminder_time_list: [null],
    // width: [500],
    // height: [400],
    position: ['bottom'],
    device_type: [null],
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
      this.IsCheckPreviewTicker = false;
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
    formData.append('html', this.ScriptScrollingHTML);
    formData.append('name', this.AlertScrollingEditTitleName);
    formData.append('body_text', this.AlertScrollingEditBody);
    formData.append('skin', this.SkinId);
    formData.append('color_code', this.SelectedColorCode);
    Object.keys(dataToSubmit).forEach(key => {
      if (!formData.has(key)) {
        formData.append(key, dataToSubmit[key])
      }
    });

    this.loading = true;
    if (this.AlertEdit === '') {
      this.http.post('emergency_ticker/', formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Emergency Scrolling Ticker Added Successfully !!");
          this.router.navigate([`/emergency/send-user/${responseData.id}/${responseData.alert_type}`]);
          this.tickerForm.reset();
          this.onDismiss();
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
          
        } else if (error.status === 400) {
          this.toastr.error("Server Bad Request");
        } else if (error.status === 403) {
          this.toastr.error("Forbidden Error");
        } else if (error.status === 404) {
          this.toastr.error("Server not Found");
        } else if (error.status === 500) {
          this.toastr.error("Internal Server Error");
        } else {
          this.toastr.error("Server not reachable");
          this.loading = false;
        }
      });
    } else {
      this.http.patch(`emergency_ticker/${this.TickerAlertId}/`, formData).subscribe((res: any) => {
        if (res.status === true) {
          const responseData = res.data;
          this.toastr.success("Emergency Scrolling Ticker Updated Successfully !!");
          this.router.navigate([`/emergency/send-user/${responseData.id}/${responseData.alert_type}`]);
          this.tickerForm.reset();
          this.onDismiss();
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
          
        } else if (error.status === 400) {
          this.toastr.error("Server Bad Request");
        } else if (error.status === 403) {
          this.toastr.error("Forbidden Error");
        } else if (error.status === 404) {
          this.toastr.error("Server not Found");
        } else if (error.status === 500) {
          this.toastr.error("Internal Server Error");
        } else {
          this.toastr.error("Server not reachable");
          this.loading = false;
        }
      });
    }
  }

  // Scrolling Ticker Alert Get By ID 
  IsTickerAlertByIdRes: any = false;
  GetTickerAlertById() {
    this.loading = true;
    this.http.get(`emergency_alerts/?alert_id=${this.AlertId}&alert_type=${this.AlertType}`).subscribe(async (res: any) => {
      this.IsTickerAlertByIdRes = res.status;
      this.OnLoadAllApiResponseCheckEditTicker();
      if (res.status === true) {
        this.loading = false;
        this.TickerAlertId = res.data.id;
        this.tickerForm.setValue({
          title: res.data.title,
          body: res.data.body,
          high_priority: res.data.high_priority,
          acknowledgement_required: res.data.acknowledgement_required,
          unobtrusive: res.data.unobtrusive,
          self_distructive: res.data.self_distructive,
          auto_close: res.data.auto_close,
          auto_close_time: res.data.auto_close_time,
          allow_manual_close: res.data.allow_manual_close,
          lifetime_given: res.data.lifetime_given,
          lifetime: res.data.lifetime,
          lifetime_option: res.data.lifetime_option,
          speed: res.data.speed,
          allow_feedback: res.data.allow_feedback,
          scheduled: '',
          schedule_option: '',
          schedule_time_start: '',
          schedule_time_end: '',
          reminder: res.data.reminder,
          reminder_time_list: res.data.reminder_time_list,
          // width: res.data.width,
          // height: res.data.height,
          position: res.data.position,
          device_type: res.data.device_type,
        });
        this.SkinId = res.data.skin;
        this.AlertScrollingEditTitle = res.data.name;
        this.AlertScrollingEditBody = res.data.body_text;
        this.SelectedColorCode = res.data.color_code;
        this.authService.setCurrentUser({ token: res.token });
        this.colorCode = '#fff';
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
        
      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  // Scrolling Ticker All function End

  // Default Settings Check function
  IsDefaultSettingsRes: any = false;
  GetDefaultSettings() {
    this.loading = true;
    this.http.get(`default_settings/`, null).subscribe((res: any) => {
      this.IsDefaultSettingsRes = res.status;
      this.OnLoadAllApiResponseCheck();
      const responseData = res;
      if (res.status === true) {
        this.DefaultSettingList = res.result;
        this.IsClose = this.DefaultSettingList.allow_manual_close;
        // this.IsRSVPClose = this.DefaultSettingList.allow_manual_close;

        this.IsScript();
        // this.IsRSVPScript();

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
        
      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }
  OnColorCodeChange() {
    this.http.get(`color_code/`, null).subscribe((res: any) => {
      const responseData = res;
      if (res.status === true) {
        this.ColorCodeList = res.data;
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
        
      } else if (error.status === 400) {
        this.toastr.error("Server Bad Request");
      } else if (error.status === 403) {
        this.toastr.error("Forbidden Error");
      } else if (error.status === 404) {
        this.toastr.error("Server not Found");
      } else if (error.status === 500) {
        this.toastr.error("Internal Server Error");
      } else {
        this.toastr.error("Server not reachable");
        this.loading = false;
      }
    });
  }

  IsColorCode(color: any) {
    this.SelectedColorCode = color.code;
    this.colorCode = '#fff';
  }

}